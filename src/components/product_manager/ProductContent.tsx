import { Button, Group, Modal, Paper, Tabs, Text, Title } from '@mantine/core';
import FunctionHeader from '../common/FunctionHeader.tsx';

import { useEffect, useMemo, useState } from 'react';
import { CategoryType, productType } from '../../utils/utilsInterface.ts';
import ProductForm from '../form/ProductForm.tsx';

import { useDisclosure } from '@mantine/hooks';
import { apiRoute } from '../../utils/apiRoute.ts';
import { DELETE, GET } from '../../utils/fetch.ts';

import { notifications } from '@mantine/notifications';
import ProductEditForm from '../form/ProductEditForm.tsx';
import ProductTable from './ProductTable.tsx';

interface CategoryContentProps {
  listCategory: CategoryType[];
}

const ProductContent = ({ listCategory }: CategoryContentProps) => {
  const [state, setState] = useState({
    productID: 0,
    editModal: false,
    searchValue: '',
    deleteModal: false,
    deleteID: 0,
    reversed: false,
    total: 0,
  });
  const { productID, editModal, deleteModal, deleteID, total } = state;
  const [opened, { open, close }] = useDisclosure(false);

  const [search, setSearch] = useState('');

  const [categorySelected, setCategorySelected] = useState<any>(
    listCategory?.[0]?.id?.toString(),
  );
  const [subCategorySelected, setSubCategorySelected] = useState<any>(null);
  const [subSubCategorySelected, setSubSubCategorySelected] =
    useState<any>(null);
  const [productData, setProductData] = useState<productType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProduct = async (value?: any) => {
    const queryParams = {
      ...((value?.category || categorySelected) && {
        category_ids: value?.category ? value?.category : categorySelected,
      }),
      ...(search && {
        search: value?.category !== categorySelected ? '' : search,
      }),
      ...(value?.subCategory && {
        subcategory_ids: value?.subCategory,
      }),
      ...(value?.subSubCategory && {
        sub_subcategory_ids: value?.subSubCategory,
      }),
    };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = 'api/admin/product/' + `?${queryString}`;

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await GET(url);

      if (res.status === 200) {
        setProductData(res.data?.results);
        setState((prev) => ({ ...prev, total: res.data?.results?.length }));
      }
      setIsLoading(false);
    } catch (error) {
      console.log('error :>> ', error);
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    const res = await DELETE(`${apiRoute.delete_product}?ids=${deleteID}`);

    if (res.status === 204) {
      setState((prev) => ({ ...prev, deleteModal: false }));
      handleSearch();
      notifications.show({
        message: 'Deleted successfully!',
        color: 'green',
      });
    } else {
      notifications.show({
        message: 'Delete unsuccessfully!',
        color: 'red',
      });
    }
  };

  const handleSearch = () => {
    getProduct({
      category: categorySelected,
      subCategory: subCategorySelected,
      subSubCategory: subSubCategorySelected,
    });
  };

  function openEditModal(id: number) {
    setState((p) => ({ ...p, productID: id, editModal: true }));
  }

  const subCategory = useMemo(() => {
    if (listCategory && listCategory?.length > 0) {
      const list = listCategory?.find(
        (item: any) => +item?.id === +categorySelected,
      ) as any;

      return (
        list?.subcategories.map((item: any) => ({
          value: item.id,
          label: item.name,
          ...item,
        })) || []
      );
    }
    return [];
  }, [categorySelected]) as any;

  const subSubCategory = useMemo(() => {
    let list = [] as any;
    if (subCategory && subCategory?.length > 0) {
      subCategory?.forEach((item: any) => {
        if (subCategorySelected?.includes(item?.id)) {
          list = [...list, ...item?.sub_subcategories];
        }
      });
      return (
        list?.map((item: any) => ({
          value: item.id,
          label: item.name,
        })) || []
      );
    }
    return [];
  }, [subCategory, categorySelected, subCategorySelected]) as any;

  useEffect(() => {
    categorySelected && getProduct();
  }, []);

  return (
    <div>
      <div style={{ padding: '0 30px' }}>
        <Tabs
          value={categorySelected}
          onTabChange={(tab: string) => {
            if (tab === categorySelected) return;
            setCategorySelected(tab);
            getProduct({
              category: tab,
              subCategory: null,
              subSubCategory: null,
            });
            if (subCategorySelected) setSubCategorySelected([]);
            if (subSubCategorySelected) setSubSubCategorySelected([]);
            if (search) setSearch('');
          }}
        >
          <Tabs.List grow>
            {listCategory?.length > 0 &&
              listCategory?.map((item: CategoryType) => (
                <Tabs.Tab
                  key={item.id}
                  value={item?.id ? item?.id.toString() : '0'}
                  style={{
                    padding: '16px 32px',
                  }}
                >
                  <Title
                    style={{
                      color:
                        item?.id && +categorySelected === +item?.id
                          ? '#B72C68'
                          : '#909090',
                    }}
                    order={4}
                    size={16}
                    weight={600}
                  >
                    {item?.name}
                  </Title>
                </Tabs.Tab>
              ))}
          </Tabs.List>
        </Tabs>
      </div>
      <div style={{ marginTop: '2rem', padding: '0 80px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title c="#B82C67" mb={4} size={24}>
            Product management
          </Title>
          <Button
            radius="md"
            bg={' #B82C67'}
            onClick={open}
            rightIcon={<img src="/plus.svg" alt="icon" />}
            className="w-[200px] font-medium text-base"
            h={42}
          >
            Add new product
          </Button>
        </div>

        <FunctionHeader
          title=""
          onCreateNew={open}
          onSelectSubCategories={(v) => {
            setSubCategorySelected(v);
            setSubSubCategorySelected([]);
            getProduct({
              category: categorySelected,
              subCategory: v,
              subSubCategory: null,
            });
          }}
          subCategorySelected={subCategorySelected}
          subSubCategorySelected={subSubCategorySelected}
          onSelectSubSubCategories={(v) => {
            setSubSubCategorySelected(v);
            getProduct({
              category: categorySelected,
              subCategory: subCategorySelected,
              subSubCategory: v,
            });
          }}
          onSelectStatus={function (_v): void {}}
          onSearch={function (e) {
            setSearch(e.target.value?.trim());
          }}
          subCategory={subCategory}
          subSubCategory={subSubCategory}
          handleSearch={handleSearch}
          searchValue={search}
        />
        <div className="text-[#B82C67] font-medium text-xl pt-5">
          Total product ({total})
        </div>
        {isLoading ? (
          <div
            style={{
              paddingTop: 150,
              textAlign: 'center',
            }}
          >
            <span className="loader" />
          </div>
        ) : (
          <ProductTable
            openEditModal={openEditModal}
            productData={productData}
            total={total}
            setState={setState}
          />
        )}
        {/*create modal*/}
        <Modal.Root
          opened={opened}
          onClose={close}
          closeOnClickOutside={false}
          size={'auto'}
        >
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>
                <div className="text-[#B82C67] mt-8 ml-12 text-2xl font-semibold">
                  Add new product
                </div>
              </Modal.Title>
              <Modal.CloseButton>
                <img src={'/close.svg'} alt={'icon'} />
              </Modal.CloseButton>
            </Modal.Header>
            <Modal.Body>
              <ProductForm
                onSuccess={() => {
                  handleSearch();
                  close();
                }}
                listCategory={listCategory}
                categorySelected={categorySelected}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
        {/*Edit modal*/}
        <Modal.Root
          opened={editModal}
          onClose={() => setState((p) => ({ ...p, editModal: false }))}
          closeOnClickOutside={false}
          size={'auto'}
        >
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>
                <div className="text-[#B82C67] mt-8 ml-16 text-2xl font-semibold">
                  Edit product
                </div>
              </Modal.Title>
              <Modal.CloseButton>
                <img src={'/close.svg'} alt={'icon'} />
              </Modal.CloseButton>
            </Modal.Header>
            <Modal.Body>
              <ProductEditForm
                id={productID}
                onSuccess={() => {
                  handleSearch();
                  setState((prev) => ({ ...prev, editModal: false }));
                }}
                listCategory={listCategory}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
        {/*  Delete Modal*/}
        <Modal
          opened={deleteModal}
          onClose={() => setState((prev) => ({ ...prev, deleteModal: false }))}
          withCloseButton={false}
          w={400}
          centered
          radius={'md'}
          sx={{
            '.mantine-iewzhb': {
              maxWidth: 420,
            },
          }}
        >
          <Paper pt={'1rem'} px={16}>
            <Text align={'left'} sx={{ fontSize: '16px', fontWeight: 600 }}>
              Do you really want to delete product?
            </Text>
            <Group sx={{ float: 'right' }} my={32}>
              <Button
                variant={'subtle'}
                onClick={() => setState((p) => ({ ...p, deleteModal: false }))}
              >
                <span style={{ color: '#333' }}>Cancel</span>
              </Button>
              <Button onClick={handleDeleteProduct} bg={'#E13434'} radius={6}>
                Delete
              </Button>
            </Group>
          </Paper>
        </Modal>
      </div>
    </div>
  );
};

export default ProductContent;
