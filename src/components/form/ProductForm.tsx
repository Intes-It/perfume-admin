import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Tabs,
  TextInput,
  Title,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { GetColorName } from 'hex-color-to-color-name';
import { KeyboardEvent, useState } from 'react';
import * as yup from 'yup';
import { apiRoute } from '../../utils/apiRoute';
import { POST, instance } from '../../utils/fetch';
import { listStatus } from '../../utils/mockData';
import {
  CategoryType,
  IAttribute,
  IProductForm,
} from '../../utils/utilsInterface';
import AttributeCards from '../common/AttributeCards';
import ImagePreview from '../common/ImagePreview';
import TextEditor from '../common/TextEditor';

type ProductFormProps = {
  listCategory: CategoryType[];
  onSuccess: () => void;
  categorySelected: string | number | null;
};

const schema = yup.object().shape({
  name: yup.string().trim().required('Name of product is required'),
  price: yup
    .string()
    .trim()
    .min(1, 'Price must be greater than 0 or equal to 1')
    .test({
      name: 'greaterThanZero',
      message: 'Price must be greater than 0',
      test: function (value) {
        if (!value) return false;
        const priceNumber = parseFloat(value);
        return !isNaN(priceNumber) && priceNumber > 0;
      },
    })
    .test({
      name: 'decimalPlaces',
      exclusive: false,
      message: 'Price must have at most 2 decimal places',
      test: function (currentPrice) {
        if (!currentPrice) {
          return true; // Skip validation if value is missing
        }
        const decimalPlaces =
          currentPrice.toString().split('.')[2]?.length || 0;
        return decimalPlaces <= 2;
      },
    })
    .required('Price of product is required')
    .typeError('Invalid number'),
  current_price: yup
    .string()
    .trim()
    .when('price', (_price, schema) => {
      return schema
        .test({
          name: 'currentPriceLessThanPrice',
          exclusive: false,
          message: 'Sale price must be less than price',
          test: function (currentPrice) {
            const { parent } = this;
            const priceValue = parent.price;
            if (!currentPrice || !priceValue) {
              return true; // Skip validation if either value is missing
            }
            return parseFloat(currentPrice) < parseFloat(priceValue);
          },
        })
        .test({
          name: 'decimalPlaces',
          exclusive: false,
          message: 'Sale price must have at most 2 decimal places',
          test: function (currentPrice) {
            if (!currentPrice) {
              return true; // Skip validation if value is missing
            }
            const decimalPlaces =
              currentPrice.toString().split('.')[2]?.length || 0;

            return decimalPlaces <= 2;
          },
        })
        .typeError('Invalid number')
        .max(999999.99, 'Sale price must be less than 999999.99');
    }),
  mass: yup.string().trim().required('Mass is required'),
  total_quantity: yup.string().trim().required('Quantity is required'),
  image: yup.mixed().required('Image is required'),
});

const ProductForm = ({
  listCategory,
  onSuccess,
  categorySelected,
}: ProductFormProps) => {
  const listSubCategoryCurr = listCategory.find(
    (item) => item.id && categorySelected && +item.id === +categorySelected,
  );

  const [state, setState] = useState({
    subCategory:
      listSubCategoryCurr?.subcategories?.map((item) => ({
        value: item.id,
        label: item.name,
        ...item,
      })) || [],
    subsubCategory: [] as any,
    categories: listCategory.map((item) => ({
      value: item.id,
      label: item.name,
      ...item,
    })),
    attributes: [],
    url_image: '',
    progress: 0,
    isLoading: false,
    colorAttribute: [] as IAttribute[],
    capacityAttribute: [] as IAttribute[],
    packageAttribute: [] as IAttribute[],
    tabSelected: '1' as string,
    messageError: '' as string,
  });
  const {
    isLoading,
    url_image,
    subCategory,
    subsubCategory,
    categories,
    colorAttribute,
    capacityAttribute,
    packageAttribute,
    tabSelected,
    messageError,
  } = state;

  const today = new Date().getDate();
  const thisMonth = new Date().getMonth() + 1;
  const thisYear = new Date().getFullYear();
  const createdDay = `${today}-${thisMonth}-${thisYear}`;

  const form = useForm<IProductForm | any>({
    validate: yupResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      name: '',
      status: 1,
      price: '',
      current_price: '',
      url_image: '',
      category_id: (categorySelected && +categorySelected) as any,
      total_quantity: '',
      description: '',
      use: '',
      composition: '',
      characteristics: '',
    },
  });

  const handlePostImage = async (image: File) => {
    try {
      const formData = new FormData();

      formData.append('name', image?.name);
      formData.append('source ', 'product');
      formData.append('file', image);
      const resFile = await instance.post(apiRoute.upload_image, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return resFile.data;
    } catch (error) {}
  };

  const handleUpdateOption = async (arr: IAttribute[]) => {
    const newArr = await Promise.all(
      arr.map(async (item) => {
        if (item?.imageFile) {
          const responseImg = await handlePostImage(item.imageFile);
          if (responseImg?.id) item.image_id = responseImg?.id;
        }
        return item;
      }),
    );

    // newArr now contains the updated attributes
    return newArr;
  };

  async function createNewProduct(value: IProductForm) {
    try {
      if (isLoading) return;
      setState((prev) => ({ ...prev, isLoading: true }));
      if (value?.image) {
        const resFile = await handlePostImage(value.image);

        if (resFile.id) {
          value.image_ids = [resFile.id];
        }
      }
      if (colorAttribute?.length > 0) {
        const updatedAttributes = await handleUpdateOption(colorAttribute);
        value.color = updatedAttributes;
      }

      if (capacityAttribute?.length > 0) {
        const updatedAttributes = await handleUpdateOption(capacityAttribute);
        value.capacity = updatedAttributes;
      }
      if (packageAttribute?.length > 0) {
        const updatedAttributes = await handleUpdateOption(packageAttribute);
        value.package = updatedAttributes;
      }

      if (!value?.subcategory_id) {
        delete value.subcategory_id;
      }

      if (!value?.sub_subcategory_id) {
        delete value.sub_subcategory_id;
      }

      const res = await POST(apiRoute.create_product, value);

      if (res.status === 201) {
        onSuccess();
        notifications.show({
          message: 'Added successfully!',
          color: 'green',
        });
      } else {
        notifications.show({
          message: 'Add unsuccessfully!',
          color: 'red',
        });
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      notifications.show({
        message: `${error}`,
        color: 'red',
      });
      setState((prev) => ({ ...prev, isLoading: true }));
    }
  }

  const handleChangeTab = (tab: string) => {
    const attributes = [colorAttribute, capacityAttribute, packageAttribute];
    const selectedIndex = +tabSelected - 1; // Assuming tabSelected starts from 1

    if (
      selectedIndex >= 0 &&
      selectedIndex < attributes.length &&
      attributes[selectedIndex].length > 0
    ) {
      const isError = attributes[selectedIndex].some((item) => !item.name);
      if (isError) {
        setState((prev) => ({
          ...prev,
          messageError: `Please fill the attributes of the ${
            tabSelected === '1'
              ? 'color'
              : tabSelected === '2'
              ? 'capacity'
              : 'package'
          }`,
        }));
        return;
      }
    }

    setState((prev) => ({ ...prev, tabSelected: tab }));
  };

  return (
    <div>
      <form
        onSubmit={form.onSubmit((v) => createNewProduct(v))}
        style={{ padding: '16px 48px', fontSize: 12 }}
      >
        <Stack spacing={'lg'}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            <div className={'badge'}>
              <span style={{ color: '#707070' }}>
                Name of product <span style={{ color: '#FF0000' }}>*</span>
              </span>
              <TextInput
                p={'0 10px'}
                h={36}
                variant={'unstyled'}
                key="name"
                width={313}
                maxLength={100}
                mt={'8px'}
                {...form.getInputProps('name')}
                sx={{
                  border: '1px solid #B82C67',
                  borderRadius: '5px',
                  '.mantine-Input-input': { fontSize: 12 },
                }}
              />
            </div>
            <div className={'badge text-xs'}>
              <span style={{ color: '#707070' }}>Creation date</span>
              <div className={'badge_child'}>
                <p>{createdDay}</p>
              </div>
            </div>{' '}
            <div className={'badge'}>
              <span style={{ color: '#707070' }}>Status</span>
              <Select
                width="19.5625rem"
                height="2.25rem"
                data={listStatus as any}
                variant="unstyled"
                value={form.values?.status as any}
                rightSection={<img alt="icon" src="/down_arrow.svg" />}
                bg={'#FFE7EF'}
                sx={{
                  borderRadius: 4,
                  marginTop: 8,
                  '.mantine-Input-input': { fontSize: 12 },
                }}
                onChange={(v) => {
                  form.setFieldValue('status', v as any);
                }}
              />
            </div>{' '}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            <div className={'badge'}>
              <span style={{ color: '#707070' }}>
                Category <span style={{ color: '#FF0000' }}>*</span>
              </span>
              <Select
                width="19.5625rem"
                height="2.25rem"
                data={categories as any}
                variant="unstyled"
                value={form.values?.category_id as any}
                rightSection={<img alt="icon" src="/down_arrow.svg" />}
                bg={'#FFE7EF'}
                sx={{
                  borderRadius: 4,
                  marginTop: 8,
                  '.mantine-Input-input': { fontSize: 12 },
                }}
                onChange={(v) => {
                  form.setFieldValue('category_id', (v && +v) as any);
                  const newSubCate = listCategory.find(
                    (item) => v && item?.id && +item.id === +v,
                  );
                  const convertList =
                    newSubCate?.subcategories?.map((item) => ({
                      value: item.id,
                      label: item.name,
                      ...item,
                    })) || [];
                  setState((prev) => ({
                    ...prev,
                    subCategory: convertList,
                  }));
                  form.values?.subcategory_id &&
                    form.setFieldValue('subcategory_id', null);
                  form.values?.sub_subcategory_id &&
                    form.setFieldValue('sub_subcategory_id', null);
                  subsubCategory &&
                    setState((prev) => ({
                      ...prev,
                      subsubCategory: [],
                    }));
                }}
              />
            </div>{' '}
            <div className={'badge'}>
              <span style={{ color: '#707070' }}>Sub-category</span>
              <Select
                width="19.5625rem"
                height="2.25rem"
                data={subCategory as any}
                value={form.values?.subcategory_id as any}
                variant="unstyled"
                rightSection={<img alt="icon" src="/down_arrow.svg" />}
                bg={'#FFE7EF'}
                sx={{
                  borderRadius: 4,
                  marginTop: 8,
                  '.mantine-Input-input': { fontSize: 12 },
                }}
                onChange={(v) => {
                  form.setFieldValue('subcategory_id', v as any);
                  const newSubCate = subCategory.find(
                    (item: any) => v && +item.value === +v,
                  ) as any;
                  form.values?.sub_subcategory_id &&
                    form.setFieldValue('sub_subcategory_id', null);
                  const convertList =
                    newSubCate?.sub_subcategories?.map((item: any) => ({
                      value: item.id,
                      label: item.name,
                    })) || [];
                  setState((prev) => ({
                    ...prev,
                    subsubCategory: convertList,
                  }));
                }}
              />
            </div>{' '}
            <div className={'badge'}>
              <span style={{ color: '#707070' }}>Sub-sub-category</span>
              <Select
                width="19.5625rem"
                height="2.25rem"
                data={subsubCategory as any}
                value={form.values?.sub_subcategory_id as any}
                variant="unstyled"
                rightSection={<img alt="icon" src="/down_arrow.svg" />}
                bg={'#FFE7EF'}
                sx={{
                  borderRadius: 4,
                  marginTop: 8,
                  '.mantine-Input-input': { fontSize: 12 },
                }}
                onChange={(v) => {
                  form.setFieldValue('sub_subcategory_id', v as any);
                }}
              />
            </div>{' '}
          </div>

          <Group spacing={'xl'}>
            <div>
              <h4
                style={{
                  color: '#B82C67',
                  fontSize: 16,
                  paddingBottom: 12,
                  paddingTop: 20,
                }}
              >
                Product image
              </h4>
              {url_image ? (
                <ImagePreview
                  imageWidth={174}
                  imageHeight={174}
                  remove={false}
                  image={url_image}
                  onReplace={(file) => {
                    if (file) {
                      setState((p) => ({
                        ...p,
                        url_image: URL.createObjectURL(file),
                      }));
                      form.setFieldValue('image', file);
                    }
                  }}
                />
              ) : (
                <Dropzone
                  onDrop={(file) => {
                    file?.[0] &&
                      setState((p) => ({
                        ...p,
                        url_image: URL.createObjectURL(file?.[0]),
                      }));
                    form.setFieldValue('image', file?.[0]);
                  }}
                  w={174}
                  multiple={false}
                  h={174}
                  style={{ borderColor: form.errors?.image ? '#ff0000' : '' }}
                  pt={'50px'}
                  accept={IMAGE_MIME_TYPE}
                >
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={'/add_image_ic.svg'}
                      width={32}
                      height={32}
                      style={{
                        margin: 'auto',
                        paddingBottom: 6,
                      }}
                      alt={'img'}
                    />
                    <p style={{ fontSize: '10px', fontWeight: 400 }}>
                      Add image
                    </p>
                  </div>
                </Dropzone>
              )}
            </div>
          </Group>
          {form.errors?.image && (
            <span
              style={{
                color: '#D72525',
              }}
            >
              {form.errors?.image}
            </span>
          )}
          <div>
            <Title
              align={'center'}
              size={24}
              order={2}
              c={'#B82C67'}
              weight={600}
              my={'2rem'}
            >
              Product detail
            </Title>

            <Grid gutter={7} gutterXs="md" gutterMd="xl" gutterXl={50}>
              <Grid.Col span={6}>
                <div className="text-base font-semibold text-[#B82C67] mb-4">
                  Price
                </div>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div
                    className={'badge'}
                    style={{
                      minHeight: 'fit-content',
                    }}
                  >
                    <span style={{ color: '#707070' }}>
                      Price of product ($){' '}
                      <span style={{ color: '#FF0000' }}>*</span>
                    </span>
                    <NumberInput
                      sx={{
                        border: '1px solid #B82C67',
                        borderRadius: '5px',
                        '.mantine-Input-input': { fontSize: 12 },
                      }}
                      w={472}
                      h={36}
                      onKeyUp={(e: any) => {
                        if (e.target?.value > 999999) {
                          e.target.value = 999999;
                          form.setFieldValue('price', 99999);
                        }
                      }}
                      pl={10}
                      mt={8}
                      maxLength={9}
                      max={999999999}
                      variant={'unstyled'}
                      precision={2}
                      decimalSeparator="."
                      {...form.getInputProps('price')}
                      min={0}
                    />
                  </div>
                  <div className={'badge'}>
                    <span style={{ color: '#707070' }}>Sale price ($) </span>
                    <NumberInput
                      min={0}
                      sx={{
                        border: '1px solid #B82C67',
                        borderRadius: '5px',
                        '.mantine-Input-input': { fontSize: 12 },
                      }}
                      w={472}
                      h={36}
                      pl={10}
                      mt={8}
                      maxLength={9}
                      variant={'unstyled'}
                      onKeyUp={(e: any) => {
                        if (e.target?.value > 999999) {
                          e.target.value = 999999;
                          form.setFieldValue('current_price', 99999);
                        }
                      }}
                      type="number"
                      precision={2}
                      decimalSeparator="."
                      {...form.getInputProps('current_price')}
                    />
                  </div>
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="text-base font-semibold text-[#B82C67] mb-4">
                  Quantity{' '}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div>
                    <span style={{ color: '#707070' }}>
                      Mass (g) <span style={{ color: '#FF0000' }}>*</span>{' '}
                    </span>
                    <NumberInput
                      sx={{
                        border: '1px solid #B82C67',
                        borderRadius: '5px',
                        '.mantine-Input-input': { fontSize: 12 },
                      }}
                      w={228}
                      h={36}
                      pl={10}
                      mt={8}
                      variant={'unstyled'}
                      maxLength={9}
                      onKeyUp={(e: any) => {
                        if (e.target?.value > 999999) {
                          e.target.value = 999999;
                          form.setFieldValue('mass', 99999);
                        }
                      }}
                      precision={2}
                      type="number"
                      decimalSeparator="."
                      min={0}
                      {...form.getInputProps('mass')}
                    />
                  </div>
                  <div>
                    <span style={{ color: '#707070' }}>
                      Quantity <span style={{ color: '#FF0000' }}>*</span>{' '}
                    </span>
                    <NumberInput
                      sx={{
                        border: '1px solid #B82C67',
                        borderRadius: '5px',
                        '.mantine-Input-input': { fontSize: 12 },
                      }}
                      w={228}
                      h={36}
                      onKeyDown={(event: KeyboardEvent) => {
                        if (
                          event.key === '.' ||
                          (form.values?.total_quantity.toString()?.length >=
                            9 &&
                            event.key !== 'Backspace')
                        ) {
                          event.preventDefault();
                        }
                      }}
                      type="number"
                      pl={10}
                      mt={8}
                      maxLength={9}
                      variant={'unstyled'}
                      min={1}
                      {...form.getInputProps('total_quantity')}
                    />
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[#B82C67] font-bold text-base ">
              Attribute
            </div>
            <Tabs
              value={tabSelected}
              style={{ width: 'fit-content' }}
              onTabChange={(tab: string) => {
                handleChangeTab(tab);
              }}
            >
              <Tabs.List className="grid grid-cols-3 font-semibold max-w-[250px]">
                <Tabs.Tab
                  value={'1'}
                  style={{
                    color: tabSelected === '1' ? '#B82C67' : '#7C7C7C',
                    fontSize: 12,
                  }}
                >
                  Color
                </Tabs.Tab>
                <Tabs.Tab
                  value={'2'}
                  style={{
                    fontSize: 12,
                    color: tabSelected === '2' ? '#B82C67' : '#7C7C7C',
                  }}
                >
                  Capacity
                </Tabs.Tab>
                <Tabs.Tab
                  value={'3'}
                  style={{
                    fontSize: 12,
                    color: tabSelected === '3' ? '#B82C67' : '#7C7C7C',
                  }}
                >
                  Package
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value={'1'}>
                <div className="flex py-4">
                  <img src={'/warning.svg'} alt={'icon'} />
                  <p
                    style={{
                      color: '#d72525',
                      fontSize: '10px',
                      marginLeft: '5px',
                      fontStyle: 'italic',
                    }}
                  >
                    The default value is the price of the product.
                  </p>
                </div>
                <ActionIcon
                  value={'filled'}
                  radius={'xl'}
                  bg={'#FFE7EF'}
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      colorAttribute: [
                        ...colorAttribute,
                        { image: '', name: '', price: 0, color: 'white' },
                      ],
                    }))
                  }
                  disabled={colorAttribute.length >= 4}
                >
                  <img src={'/plus_pink.svg'} alt={'icon'} />
                </ActionIcon>
                <Box mt={'1rem'}>
                  <Group>
                    {colorAttribute?.map((item: IAttribute, index: number) => (
                      <div key={index}>
                        <AttributeCards
                          defaultColor={item?.color}
                          onReplaceImage={(file) => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );
                            const addImage = {
                              ...colorAttribute[currentIndex],
                              image: URL.createObjectURL(file),
                              imageFile: file,
                            };
                            const newImage = [
                              ...colorAttribute.slice(0, currentIndex),
                              addImage,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];
                            setState((p) => ({
                              ...p,
                              colorAttribute: newImage,
                            }));
                          }}
                          onRemoveImage={() => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );

                            const addPrice = {
                              ...colorAttribute[currentIndex],
                              image: '',
                              imageFile: null,
                            };
                            const emptyImage = [
                              ...colorAttribute.slice(0, currentIndex),
                              addPrice,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];

                            setState((p) => ({
                              ...p,
                              colorAttribute: emptyImage,
                            }));
                          }}
                          productImage={item.image}
                          attributeTitle={'Color'}
                          onAddImage={(file) => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );
                            const addImage = {
                              ...colorAttribute[currentIndex],
                              image: URL.createObjectURL(file?.[0]),
                              imageFile: file?.[0],
                            };
                            const newImage = [
                              ...colorAttribute.slice(0, currentIndex),
                              addImage,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];
                            setState((p) => ({
                              ...p,
                              colorAttribute: newImage,
                            }));
                          }}
                          onCancel={() => {
                            setState((p) => ({
                              ...p,
                              colorAttribute: colorAttribute.filter(
                                (item: IAttribute) =>
                                  item !== colorAttribute[index],
                              ),
                              messageError: '',
                            }));
                          }}
                          onPriceChange={(e) => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );
                            const addPrice = {
                              ...colorAttribute[currentIndex],
                              price: e,
                            };
                            const newPrice = [
                              ...colorAttribute.slice(0, currentIndex),
                              addPrice,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];
                            setState((p) => ({
                              ...p,
                              colorAttribute: newPrice,
                            }));
                          }}
                          onNameColorChange={(value: string) => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );
                            const addColor = {
                              ...colorAttribute[currentIndex],
                              name: value,
                            };
                            const newColor = [
                              ...colorAttribute.slice(0, currentIndex),
                              addColor,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];

                            setState((p) => ({
                              ...p,
                              colorAttribute: newColor,
                              messageError: '',
                            }));
                          }}
                          onColorChange={(color) => {
                            const currentIndex = colorAttribute.findIndex(
                              (i) => i === colorAttribute[index],
                            );
                            const addColor = {
                              ...colorAttribute[currentIndex],
                              color: color,
                              name: GetColorName(color),
                            };
                            const newColor = [
                              ...colorAttribute.slice(0, currentIndex),
                              addColor,
                              ...colorAttribute.slice(currentIndex + 1),
                            ];

                            setState((p) => ({
                              ...p,
                              colorAttribute: newColor,
                              messageError: '',
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </Group>
                </Box>
              </Tabs.Panel>{' '}
              <Tabs.Panel value={'2'}>
                <div className="flex py-4">
                  <img src={'/warning.svg'} alt={'icon'} />
                  <p
                    style={{
                      color: '#d72525',
                      fontSize: '10px',
                      marginLeft: '5px',
                      fontStyle: 'italic',
                    }}
                  >
                    The default value is the price of the product.
                  </p>
                </div>
                <ActionIcon
                  value={'filled'}
                  radius={'xl'}
                  bg={'#FFE7EF'}
                  onClick={() =>
                    setState((p) => ({
                      ...p,

                      capacityAttribute: [
                        ...capacityAttribute,
                        { image: '', name: '', price: 0, color: '' },
                      ],
                    }))
                  }
                  disabled={capacityAttribute.length >= 4}
                >
                  <img src={'/plus_pink.svg'} alt={'icon'} />
                </ActionIcon>
                <Box mt="1rem">
                  <Group>
                    {capacityAttribute?.map(
                      (item: IAttribute, index: number) => (
                        <div key={index}>
                          <AttributeCards
                            onReplaceImage={(file) => {
                              const currentIndex = capacityAttribute.findIndex(
                                (i) => i === capacityAttribute[index],
                              );
                              const addImage = {
                                ...capacityAttribute[currentIndex],
                                image: URL.createObjectURL(file),
                                imageFile: file,
                              };
                              const newImage = [
                                ...capacityAttribute.slice(0, currentIndex),
                                addImage,
                                ...capacityAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                capacityAttribute: newImage,
                              }));
                            }}
                            onRemoveImage={() => {
                              const currentIndex = capacityAttribute.findIndex(
                                (i) => i === capacityAttribute[index],
                              );
                              const addPrice = {
                                ...capacityAttribute[currentIndex],
                                image: '',
                                imageFile: null,
                              };

                              const newPrice = [
                                ...capacityAttribute.slice(0, currentIndex),
                                addPrice,
                                ...capacityAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                capacityAttribute: newPrice,
                              }));
                            }}
                            productImage={item.image}
                            attributeTitle={'Capacity name'}
                            onAddImage={(file) => {
                              const currentIndex = capacityAttribute.findIndex(
                                (i) => i === capacityAttribute[index],
                              );

                              const addImage = {
                                ...capacityAttribute[currentIndex],
                                image: URL.createObjectURL(file?.[0]),
                                imageFile: file?.[0],
                              };
                              const newImage = [
                                ...capacityAttribute.slice(0, currentIndex),
                                addImage,
                                ...capacityAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                capacityAttribute: newImage,
                              }));
                            }}
                            onCancel={() => {
                              setState((p) => ({
                                ...p,
                                messageError: '',
                                capacityAttribute: capacityAttribute.filter(
                                  (item: IAttribute) =>
                                    item !== capacityAttribute[index],
                                ),
                              }));
                            }}
                            onPriceChange={(e) => {
                              const currentIndex = capacityAttribute.findIndex(
                                (i) => i === capacityAttribute[index],
                              );
                              const addPrice = {
                                ...capacityAttribute[currentIndex],
                                price: e,
                              };
                              const newPrice = [
                                ...capacityAttribute.slice(0, currentIndex),
                                addPrice,
                                ...capacityAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                capacityAttribute: newPrice,
                              }));
                            }}
                            onAttributeChange={(e) => {
                              const currentIndex = capacityAttribute.findIndex(
                                (i) => i === capacityAttribute[index],
                              );
                              const addPrice = {
                                ...capacityAttribute[currentIndex],
                                name: e.target.value,
                              };
                              const newPrice = [
                                ...capacityAttribute.slice(0, currentIndex),
                                addPrice,
                                ...capacityAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                capacityAttribute: newPrice,
                                messageError: '',
                              }));
                            }}
                          />
                        </div>
                      ),
                    )}
                  </Group>
                </Box>
              </Tabs.Panel>{' '}
              <Tabs.Panel value={'3'}>
                <div className="flex py-4">
                  <img src={'/warning.svg'} alt={'icon'} />
                  <p
                    style={{
                      color: '#d72525',
                      fontSize: '10px',
                      marginLeft: '5px',
                      fontStyle: 'italic',
                    }}
                  >
                    The default value is the price of the product.
                  </p>
                </div>
                <ActionIcon
                  value={'filled'}
                  radius={'xl'}
                  bg={'#FFE7EF'}
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      packageAttribute: [
                        ...packageAttribute,
                        { image: '', name: '', price: 0 },
                      ],
                    }))
                  }
                  disabled={packageAttribute.length >= 4}
                >
                  <img src={'/plus_pink.svg'} alt={'icon'} />
                </ActionIcon>
                <Box mt="1rem">
                  <Group>
                    {packageAttribute?.map(
                      (item: IAttribute, index: number) => (
                        <div key={index}>
                          <AttributeCards
                            onReplaceImage={(file) => {
                              const currentIndex = packageAttribute.findIndex(
                                (i) => i === packageAttribute[index],
                              );

                              const addImage = {
                                ...packageAttribute[currentIndex],
                                image: URL.createObjectURL(file),
                                imageFile: file,
                              };

                              const newImage = [
                                ...packageAttribute.slice(0, currentIndex),
                                addImage,
                                ...packageAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                packageAttribute: newImage,
                              }));
                            }}
                            onRemoveImage={() => {
                              const currentIndex = packageAttribute.findIndex(
                                (i) => i === packageAttribute[index],
                              );
                              const addPrice = {
                                ...packageAttribute[currentIndex],
                                image: '',
                                imageFile: null,
                              };
                              const newPrice = [
                                ...packageAttribute.slice(0, currentIndex),
                                addPrice,
                                ...packageAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                messageError: '',
                                packageAttribute: newPrice,
                              }));
                            }}
                            productImage={item.image}
                            attributeTitle={'Package name'}
                            onAddImage={(file) => {
                              const currentIndex = packageAttribute.findIndex(
                                (i) => i === packageAttribute[index],
                              );

                              const addImage = {
                                ...packageAttribute[currentIndex],
                                image: URL.createObjectURL(file?.[0]),
                                imageFile: file?.[0],
                              };
                              const newImage = [
                                ...packageAttribute.slice(0, currentIndex),
                                addImage,
                                ...packageAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                packageAttribute: newImage,
                              }));
                            }}
                            onCancel={() => {
                              setState((p) => ({
                                ...p,
                                messageError: '',
                                packageAttribute: packageAttribute.filter(
                                  (item: IAttribute) =>
                                    item !== packageAttribute[index],
                                ),
                              }));
                            }}
                            onPriceChange={(e) => {
                              const currentIndex = packageAttribute.findIndex(
                                (i) => i === packageAttribute[index],
                              );
                              const addPrice = {
                                ...packageAttribute[currentIndex],
                                price: e,
                              };
                              const newPrice = [
                                ...packageAttribute.slice(0, currentIndex),
                                addPrice,
                                ...packageAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                packageAttribute: newPrice,
                                messageError: '',
                              }));
                            }}
                            onAttributeChange={(e) => {
                              const currentIndex = packageAttribute.findIndex(
                                (i) => i === packageAttribute[index],
                              );
                              const addPrice = {
                                ...packageAttribute[currentIndex],
                                name: e.target.value,
                              };
                              const newPrice = [
                                ...packageAttribute.slice(0, currentIndex),
                                addPrice,
                                ...packageAttribute.slice(currentIndex + 1),
                              ];
                              setState((p) => ({
                                ...p,
                                packageAttribute: newPrice,
                                messageError: '',
                              }));
                            }}
                          />
                        </div>
                      ),
                    )}
                  </Group>
                </Box>
              </Tabs.Panel>
            </Tabs>
            {messageError && (
              <div
                style={{
                  fontSize: 12,
                  marginTop: 8,
                  color: '#ff0000',
                }}
              >
                {messageError}
              </div>
            )}
          </div>
          <Title
            order={2}
            c={'#B82C67'}
            py={16}
            size={24}
            weight={600}
            align="center"
          >
            Product description{' '}
          </Title>
          <Container
            style={{
              width: '100%',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Tabs defaultValue={'1'}>
              <Tabs.List grow>
                <Tabs.Tab value="1">
                  <Title order={4} size={16} weight={600} c={'#B82C67'}>
                    Description
                  </Title>
                </Tabs.Tab>
                <Tabs.Tab value="2">
                  <Title order={4} size={16} weight={600} c={'#B82C67'}>
                    Characteristics
                  </Title>
                </Tabs.Tab>
                <Tabs.Tab value="3">
                  <Title order={4} size={16} weight={600} c={'#B82C67'}>
                    Use
                  </Title>
                </Tabs.Tab>
                <Tabs.Tab value="4">
                  <Title order={4} size={16} weight={600} c={'#B82C67'}>
                    Composition
                  </Title>
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="1" pt={'md'}>
                <TextEditor
                  onChangeValue={(value) =>
                    form.setFieldValue('description', value)
                  }
                />
              </Tabs.Panel>
              <Tabs.Panel value="2" pt={'md'}>
                <TextEditor
                  onChangeValue={(value) =>
                    form.setFieldValue('characteristics', value)
                  }
                />
              </Tabs.Panel>
              <Tabs.Panel value="3" pt={'md'}>
                <TextEditor
                  onChangeValue={(value) => form.setFieldValue('use', value)}
                />
              </Tabs.Panel>
              <Tabs.Panel value="4" pt={'md'}>
                <TextEditor
                  onChangeValue={(value) =>
                    form.setFieldValue('composition', value)
                  }
                />
              </Tabs.Panel>
            </Tabs>
          </Container>
        </Stack>
        <Button
          type="submit"
          c={'#fff'}
          leftIcon={<img src="/tick.svg" width={16} alt="icon" />}
          w={100}
          h={40}
          sx={{ float: 'right' }}
          bg={'#B82C67'}
          radius={'md'}
          mt={'2rem'}
          disabled={isLoading}
        >
          Done
        </Button>
        <div style={{ height: '60px' }}></div>
      </form>
    </div>
  );
};

export default ProductForm;
