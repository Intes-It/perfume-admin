import { Button, Modal, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { apiRoute } from '../../utils/apiRoute';
import { DELETE, PATCH, POST } from '../../utils/fetch';
import { shippingProps } from './Delivery';

type ModalDeliveryProps = {
  opened: boolean;
  handleCloseModal: () => void;
  typeModal: 'ADD' | 'EDIT' | 'DELETE';
  itemSelected: shippingProps | null;
  onSuccess: () => void;
};

const ModalDelivery = ({
  opened,
  handleCloseModal,
  typeModal,
  onSuccess,
  itemSelected,
}: ModalDeliveryProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    validate: {
      minimum_weight: (value: string) => {
        if (value?.toString().trim().length < 1) {
          return 'Minimum weight is required';
        }
      },
      maximum_weight: (value: string) => {
        if (value?.toString().trim().length < 1)
          return 'Maximum weight is required';
        // Access the maximum weight value using getValues or watch
        const maxWeight = form.values?.minimum_weight;

        if (parseFloat(value) <= parseFloat(maxWeight)) {
          return 'Maximum weight must be higher than minimum weight';
        }

        return null;
      },

      cost: (value: string) =>
        value?.toString().trim().length < 1 ? 'Cost is required' : null,
    },
    validateInputOnBlur: true,
    initialValues: {
      minimum_weight: '',
      maximum_weight: '',
      cost: '',
      created_at: '',
    },
  });

  const handleDelete = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await DELETE(
        apiRoute.delete_delivery_cost + `?ids=${itemSelected?.id}`,
      );
      if (res.status === 204 || res.status === 200) {
        notifications.show({
          message: `Deleted successfully!`,
          color: 'green',
        });
        onSuccess();
        handleCloseModal();
        form.reset();
        setIsLoading(false);
        return;
      }
      if (res?.data?.detail?.non_field_errors?.length > 0) {
        notifications.show({
          message: res?.data?.detail?.non_field_errors[0],
          color: 'red',
        });
      } else {
        notifications.show({
          message: `Deleted unsuccessfully!`,
          color: 'red',
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (value: any) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await (typeModal === 'ADD'
        ? POST(apiRoute.create_delivery_cost, value)
        : PATCH(
            apiRoute.detail_delivery_cost + itemSelected?.id + '/patch/',
            value,
          ));
      if (res.status === 201 || res.status === 200) {
        notifications.show({
          message: `Added successfully!`,
          color: 'green',
        });
        onSuccess();
        handleCloseModal();
        form.reset();
        setIsLoading(false);
        return;
      }
      if (res?.data?.detail?.non_field_errors?.length > 0) {
        notifications.show({
          message: res?.data?.detail?.non_field_errors[0],
          color: 'red',
        });
      } else {
        notifications.show({
          message: `Add unsuccessfully!`,
          color: 'red',
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (itemSelected && opened) form.setValues(itemSelected);
  }, [opened]);

  const contentDelete = (
    <div className="w-[370px]">
      <div className="text-sm">
        Do you really want to delete this delivery cost?
      </div>
      <div className="flex float-right gap-2 mt-10 mb-5">
        <Button
          variant={'subtle'}
          className="text-sm font-medium"
          onClick={handleCloseModal}
        >
          <span style={{ color: '#333' }}>Cancel</span>
        </Button>
        <Button
          onClick={handleDelete}
          className="text-sm font-medium"
          bg="#E13434"
          color="white"
          radius={6}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <Modal.Root
      opened={opened}
      onClose={() => {
        handleCloseModal();
        form.reset();
      }}
      size={'auto'}
    >
      <Modal.Overlay />
      <Modal.Content
        sx={{
          top: '50%',
        }}
      >
        {typeModal !== 'DELETE' && (
          <Modal.Header>
            <Modal.Title>
              <div className="text-[#B82C67] mt-8 ml-16 text-2xl font-semibold">
                {typeModal === 'ADD'
                  ? `Add new delivery cost`
                  : `Update delivery cost`}
              </div>
            </Modal.Title>
            <Modal.CloseButton style={{ marginRight: 24 }}>
              <img src={'/close.svg'} alt={'icon'} />
            </Modal.CloseButton>
          </Modal.Header>
        )}
        <Modal.Body>
          {typeModal === 'DELETE' ? (
            contentDelete
          ) : (
            <form
              onSubmit={form.onSubmit((v) => onSubmit(v))}
              className="w-[1100px] pt-6 px-16 pb-8"
            >
              <div className="grid grid-cols-4 gap-10">
                <div className="flex flex-col gap-2">
                  <span style={{ color: '#707070', fontSize: 12 }}>
                    Minimum weight (g)
                    <span className="text-[#FF0000]">*</span>
                  </span>

                  <NumberInput
                    sx={{
                      border: form.errors?.minimum_weight
                        ? '1px solid #FF0000'
                        : '1px solid #B82C67',
                      borderRadius: '4px',
                      '.mantine-Input-input': { fontSize: 12 },
                    }}
                    onKeyUp={(e: any) => {
                      if (+e.target?.value > 999999) {
                        e.target.value = 999999;
                        form.setFieldValue('minimum_weight', 999999);
                      }
                    }}
                    maxLength={9}
                    pl={5}
                    h={38}
                    max={999999999}
                    type="number"
                    step={0.01}
                    variant={'unstyled'}
                    precision={2}
                    decimalSeparator="."
                    {...form.getInputProps('minimum_weight')}
                    min={0}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span style={{ color: '#707070', fontSize: 12 }}>
                    Maximum weight (g)
                    <span className="text-[#FF0000]">*</span>
                  </span>

                  <NumberInput
                    sx={{
                      border: form.errors?.maximum_weight
                        ? '1px solid #FF0000'
                        : '1px solid #B82C67',
                      borderRadius: '4px',
                      '.mantine-Input-input': { fontSize: 12 },
                    }}
                    onKeyUp={(e: any) => {
                      if (+e.target?.value > 999999) {
                        e.target.value = 999999;
                        form.setFieldValue('maximum_weight', 999999);
                      }
                    }}
                    maxLength={9}
                    type="number"
                    pl={5}
                    h={38}
                    max={999999999}
                    step={0.01}
                    variant={'unstyled'}
                    precision={2}
                    decimalSeparator="."
                    {...form.getInputProps('maximum_weight')}
                    min={0}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span style={{ color: '#707070', fontSize: 12 }}>
                    Delivery cost ($)
                    <span className="text-[#FF0000]">*</span>
                  </span>

                  <NumberInput
                    sx={{
                      border: form.errors?.cost
                        ? '1px solid #FF0000'
                        : '1px solid #B82C67',
                      borderRadius: '4px',
                      '.mantine-Input-input': { fontSize: 12 },
                    }}
                    onKeyUp={(e: any) => {
                      if (+e.target?.value > 999999) {
                        e.target.value = 999999;
                        form.setFieldValue('cost', 999999);
                      }
                    }}
                    maxLength={9}
                    pl={5}
                    h={38}
                    max={999999999}
                    step={0.01}
                    variant={'unstyled'}
                    type="number"
                    precision={2}
                    decimalSeparator="."
                    {...form.getInputProps('cost')}
                    min={0}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span style={{ color: '#707070', fontSize: 12 }}>
                    Creation date
                    <span className="text-[#FF0000]">*</span>
                  </span>

                  <TextInput
                    variant="unstyled"
                    bg="#FFE7EF"
                    readOnly
                    h={38}
                    pl={20}
                    defaultValue={
                      form?.values?.created_at
                        ? dayjs(form?.values?.created_at).format('DD-MM-YYYY')
                        : dayjs().format('DD-MM-YYYY')
                    }
                    sx={{ borderRadius: '4px' }}
                    {...form.getInputProps('name')}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="block mx-auto text-base font-medium mt-14"
                bg={'#B82C67'}
                radius={'md'}
                w={120}
                h={42}
                disabled={isLoading}
              >
                Done
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ModalDelivery;
