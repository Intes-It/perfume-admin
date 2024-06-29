import {
  Box,
  Button,
  Group,
  Radio,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';

import { useForm } from '@mantine/form';
import { voucherType } from '../../utils/utilsInterface';
import { PATCH, GET } from '../../utils/fetch';
import { notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type voucherFormprops = {
  onSuccess: () => void;
  id: number;
};
const statusData = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];
const VoucherEditForm = ({ onSuccess, id }: voucherFormprops) => {
  const [state, setState] = useState({
    voucherData: {} as voucherType,
    start_date: '',
    end_date: '',
    isPercent: true,
  });
  const { voucherData, start_date, end_date, isPercent } = state;
  async function getVoucherData() {
    const res = await GET(`/api/admin/voucher/${id}`);

    setState((p) => ({
      ...p,
      voucherData: res?.data,
      start_date: res?.data.start_date,
      end_date: res?.data.end_date,
    }));
  }

  const form = useForm<voucherType>({
    initialValues: voucherData,
    validate: {
      discount: (v) =>
        v === -1
          ? 'error'
          : isPercent
          ? v > 100
            ? 'error'
            : null
          : v.toString().length > 4
          ? 'error'
          : null,
      name: (v) => (v.length === 0 ? 'error' : null),
      start_date: (v) => (!v ? 'error' : null),
      end_date: (v) => (!v ? 'error' : null),
      description: (v) => (v.length === 0 ? 'error' : null),
      total_quantity: (v) =>
        v.toString().length > 6 || v === -1 ? 'error' : null,
    },
  });

  useEffect(() => {
    getVoucherData();
  }, []);
  useEffect(() => {
    form.setValues(voucherData);
  }, [voucherData]);
  async function editVoucher(v: voucherType) {
    try {
      const res = await PATCH(`/api/admin/voucher/${id}/patch/`, v);
      console.log(res);
      onSuccess();
    } catch (e) {
      notifications.show({
        message: 'Oups! L’erreur système s’est produite',
        icon: <img src={'/warning.svg'} alt={'icon'} />,
        withCloseButton: true,
        color: 'red',
      });
    }
  }

  return (
    <Box px={'4rem'}>
      <form
        className={'voucher_form'}
        onSubmit={form.onSubmit((v) => editVoucher(v))}
      >
        <Stack spacing={'lg'}>
          <div>
            <Title
              c={'#707070'}
              weight={500}
              size={12}
              sx={{ marginBottom: '8px' }}
            >
              Name of voucher <span style={{ color: 'red' }}>*</span>
            </Title>
            <TextInput
              w={' 23.6875rem'}
              h={'2.25rem'}
              value={form.values?.name || ''}
              onChange={(e) => {
                form.setFieldValue('name', e.target.value);
              }}
              maxLength={100}
              error={null}
            />
            {Object.hasOwn(form.errors, 'name') && (
              <div className="font-medium text-[#D72525] text-[10px] ">
                Name of voucher is required
              </div>
            )}
          </div>
          <div>
            <Title
              order={4}
              c={'#707070'}
              size={12}
              weight={500}
              sx={{ marginBottom: '8px' }}
            >
              Description <span style={{ color: 'red' }}>*</span>
            </Title>
            <textarea
              style={{
                width: '41.3125rem',
                height: '12.25rem',
                resize: 'none',
                border: '1px solid #b82c67',
                borderRadius: '4px',
                padding: '5px 10px',
              }}
              value={form.values?.description || ''}
              onChange={(e) =>
                form.setFieldValue('description', e.target.value)
              }
            />
            {Object.hasOwn(form.errors, 'description') && (
              <div className="font-medium text-[#D72525] text-[10px] ">
                Description of voucher is required
              </div>
            )}
          </div>
          <Title c={'#E7639A'} order={5} mb={'-16px'}>
            Voucher details
          </Title>
          <Group align="start">
            <div>
              <span
                style={{
                  color: '#707070',
                  fontSize: '12px',
                  marginBottom: '8px',
                  fontWeight: '500px',
                }}
              >
                Status
              </span>

              <Select
                className="input_select_status_create"
                data={statusData}
                bg={'#FFE7EF'}
                w={'15.5rem'}
                h={'2.375rem'}
                variant="unstyled"
                sx={{
                  borderRadius: '4px',
                  background: '#FFE7EF',
                  padding: '0px 10px',
                }}
                rightSection={<img alt="icon" src="/down_arrow.svg" />}
                onChange={(e: string) => {
                  form.setFieldValue('active', e === 'true');
                }}
                value={String(form.values.active)}
                pl={'5px'}
              />
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <div className="flex flex-row">
                <div>
                  <span
                    style={{
                      color: '#707070',
                      fontSize: '12px',
                      marginBottom: '8px',
                      fontWeight: '500px',
                    }}
                  >
                    Quantity <span style={{ color: 'red' }}>*</span>
                  </span>
                  <TextInput
                    w={'6.375rem'}
                    h={'2.25rem'}
                    type={'number'}
                    min={0}
                    maxLength={9}
                    value={
                      form.values.total_quantity < 0
                        ? ''
                        : form.values.total_quantity
                    }
                    onKeyDown={(e) =>
                      e.key === '.' ||
                      e.key === ',' ||
                      e.key === 'e' ||
                      e.key === '-' ||
                      e.key === '+'
                        ? e.preventDefault()
                        : null
                    }
                    onChange={(e) => {
                      form.setFieldValue(
                        'total_quantity',
                        !e.target.value ? -1 : +e.target.value,
                      );
                    }}
                    sx={{
                      resize: 'none',
                      border: '1px solid #b82c67',
                      borderRadius: '4px',
                      padding: '0px 10px',
                    }}
                    variant={'unstyled'}
                  />
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  <span
                    style={{
                      color: '#7c7c7c',
                      fontSize: '12px',
                      marginBottom: '8px',
                      fontWeight: '500',
                    }}
                  >
                    Used
                  </span>
                  <br />
                  <div
                    style={{
                      resize: 'none',
                      border: '1px solid #858585',
                      borderRadius: '4px',
                      padding: '0px 10px',
                      color: '#858585',
                      width: '6.375rem',
                      height: '2.25rem',
                      fontSize: '14px',
                    }}
                    className="items-center flex"
                  >
                    {voucherData?.used_quantity}
                  </div>
                </div>
              </div>
              {Object.hasOwn(form.errors, 'total_quantity') && (
                <div className="font-medium text-[#D72525] text-[10px] ">
                  {form.values.total_quantity === -1
                    ? 'Quantity is required'
                    : 'Maximum quantity is 999999'}
                </div>
              )}
            </div>
          </Group>
          <div>
            <Group>
              <div>
                <span
                  style={{
                    color: '#707070',
                    fontSize: '12px',
                    marginBottom: '8px',
                    fontWeight: '500px',
                  }}
                >
                  Start date <span style={{ color: 'red' }}>*</span>
                </span>
                <DateInput
                  rightSection={<img src={'calendar.svg'} alt={'icon'} />}
                  w={'15.5rem'}
                  h={'2.25rem'}
                  variant="unstyled"
                  bg={'#FFE7EF'}
                  pl={'10px'}
                  sx={{ borderRadius: '4px' }}
                  value={dayjs(form.values?.start_date).toDate()}
                  // {...form.getInputProps('start_date')}
                  onChange={(e) => {
                    if (dayjs(end_date).isBefore(dayjs(), 'day')) {
                      form.setFieldValue(
                        'end_date',
                        dayjs(e).format('YYYY-MM-DD'),
                      );
                      setState((p) => ({ ...p, end_date: String(e) }));
                    }
                    form.setFieldValue(
                      'start_date',
                      dayjs(e).format('YYYY-MM-DD'),
                    );
                    setState((p) => ({ ...p, start_date: String(e) }));
                  }}
                  minDate={new Date()}
                  maxDate={
                    end_date
                      ? dayjs(end_date).isBefore(dayjs(), 'day')
                        ? undefined
                        : new Date(end_date)
                      : undefined
                  }
                  className="date-input-class-create"
                />
                {Object.hasOwn(form.errors, 'start_date') && (
                  <div className="font-medium text-[#D72525] text-[10px] ">
                    Start date is required
                  </div>
                )}
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <span
                  style={{
                    color: '#707070',
                    fontSize: '12px',
                    marginBottom: '8px',
                    fontWeight: '500px',
                  }}
                >
                  End date <span style={{ color: 'red' }}>*</span>
                </span>
                <DateInput
                  className="date-input-class-create"
                  value={dayjs(form.values?.end_date).toDate()}
                  rightSection={<img src={'calendar.svg'} alt={'icon'} />}
                  w={'15.5rem'}
                  h={'2.25rem'}
                  variant="unstyled"
                  bg={'#FFE7EF'}
                  pl={'10px'}
                  sx={{ borderRadius: '4px' }}
                  onChange={(e) => {
                    form.setFieldValue(
                      'end_date',
                      dayjs(e).format('YYYY-MM-DD'),
                    );
                    setState((p) => ({ ...p, end_date: String(e) }));
                  }}
                  minDate={
                    start_date && dayjs(start_date).isAfter(dayjs(), 'day')
                      ? new Date(start_date)
                      : new Date()
                  }
                />
                {Object.hasOwn(form.errors, 'end_date') && (
                  <div className="font-medium text-[#D72525] text-[10px] ">
                    End date is required
                  </div>
                )}
              </div>
            </Group>
          </div>
          <Title order={5} c={'#E7639A'} mb={'-8px'}>
            Apply to
          </Title>
          <Radio.Group
            value={'1'}
            onChange={(value) => form.setFieldValue('apply_to', value)}
            required
          >
            <Group>
              <Radio
                value={'1'}
                checked={form.values.apply_to == '1'}
                label={<span style={{ color: '#E7639A' }}>Product</span>}
                disabled={true}
              />
              <Radio
                value={'2'}
                checked={form.values.apply_to == '2'}
                disabled={true}
                label={
                  <span style={{ color: '#E7639A', fontSize: '12px' }}>
                    Delivery
                  </span>
                }
              />
            </Group>
          </Radio.Group>

          <Title order={5} c={'#E7639A'} mb={'-8px'}>
            Type of discount
          </Title>
          <Group>
            <Select
              data={[
                { value: '1', label: '% Discount' },
                { value: '2', label: '$ Value' },
              ]}
              w={'9.125rem'}
              h={'2.25rem'}
              onChange={(e) => {
                form.setFieldValue('discount_type', String(e));
                form.setFieldError('discount', null);
                if (e === '1') {
                  setState((p) => ({ ...p, isPercent: true }));
                } else {
                  setState((p) => ({ ...p, isPercent: false }));
                }
              }}
              value={String(form.values.discount_type)}
              required={true}
              rightSection={<img src="/down_arrow.svg" alt="icon" />}
              sx={{
                resize: 'none',
                border: '1px solid #b82c67',
                borderRadius: '4px',
                padding: '0px 10px',
              }}
              variant={'unstyled'}
            />

            <TextInput
              w={56}
              value={form.values.discount >= 0 ? form.values.discount : ''}
              type={'number'}
              min={-1}
              sx={{
                resize: 'none',
                border: '1px solid #b82c67',
                borderRadius: '4px',
                padding: '0px 10px',
              }}
              onKeyDown={(e) =>
                e.key === '.' ||
                e.key === 'e' ||
                e.key === '-' ||
                e.key === ',' ||
                e.key === '+'
                  ? e.preventDefault()
                  : null
              }
              variant={'unstyled'}
              maxLength={4}
              onChange={(e) =>
                form.setFieldValue(
                  'discount',
                  !e.target.value ? -1 : +e.target.value,
                )
              }
            />
            <span>{String(form.values.discount_type) === '1' ? '%' : '$'}</span>
          </Group>
          {Object.hasOwn(form.errors, 'discount') && (
            <div className="font-medium text-[#D72525] text-[10px] mt-[-20px]">
              {form.values.discount === -1
                ? 'Must enter a discount value'
                : isPercent
                ? 'Maximum amount is 100%'
                : 'Maximum value is $ 9999'}
            </div>
          )}
        </Stack>
        <Button
          type="submit"
          c={'#fff'}
          w={'7.875rem'}
          h={'2.5rem'}
          sx={{ float: 'right' }}
          bg={'#B82C67'}
          radius={'md'}
        >
          <span style={{ fontSize: '16px' }}>Confirm</span>
        </Button>
        <div style={{ height: '60px' }}></div>
      </form>
    </Box>
  );
};

export default VoucherEditForm;
