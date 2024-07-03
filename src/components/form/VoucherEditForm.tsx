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
    statusCheck: true,
    usedQuantity: 0,
  });
  const {
    voucherData,
    start_date,
    end_date,
    isPercent,
    statusCheck,
    usedQuantity,
  } = state;
  async function getVoucherData() {
    const res = await GET(`/api/admin/voucher/${id}`);

    setState((p) => ({
      ...p,
      voucherData: res?.data,
      start_date: res?.data.start_date,
      end_date: res?.data.end_date,
      isPercent: res?.data.discount_type === 1,
      statusCheck: res?.data.active,
      usedQuantity: res?.data.used_quantity,
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
      active: (v) =>
        v && !statusCheck && dayjs(end_date).isBefore(dayjs(), 'day')
          ? 'error'
          : null,
      start_date: (v) => (!v ? 'error' : null),
      end_date: (v) => (!v ? 'error' : null),
      description: (v) => (v.length === 0 ? 'error' : null),
      total_quantity: (v) =>
        v.toString().length > 6 || v === -1
          ? 'error'
          : v < usedQuantity
          ? 'error'
          : null,
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
                      color: '#707070',
                      fontSize: '12px',
                      marginBottom: '8px',
                      fontWeight: '500',
                    }}
                  >
                    Used amount
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
                    : form.values.total_quantity < usedQuantity
                    ? 'Quantity must be bigger or equal to used amount'
                    : 'Maximum quantity is 999999'}
                </div>
              )}
            </div>
          </Group>
          <div>
            <Group>
              <div className=" flex flex-col h-[70px] items-start">
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
              <div
                style={{ marginLeft: '1rem' }}
                className=" flex flex-col h-[70px] items-start"
              >
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
                {Object.hasOwn(form.errors, 'active') && (
                  <div className="font-medium text-[#D72525] text-[10px] ">
                    {'End date must be greater than the current date'}
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
              className="input_select_status_create"
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
              h={36}
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
          w={'94px'}
          h={'2.5rem'}
          sx={{ float: 'right' }}
          bg={'#B82C67'}
          radius={'md'}
        >
          <svg
            width="14"
            height="11"
            viewBox="0 0 14 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.45807 8.78081L1.67779 5.76555C1.60509 5.68574 1.5185 5.62237 1.42305 5.57913C1.3276 5.53588 1.22518 5.51361 1.12173 5.51361C1.01829 5.51361 0.91587 5.53588 0.820419 5.57913C0.724967 5.62237 0.638381 5.68574 0.565678 5.76555C0.492088 5.8444 0.433661 5.9383 0.393784 6.04182C0.353908 6.14534 0.333374 6.25641 0.333374 6.3686C0.333374 6.48079 0.353908 6.59186 0.393784 6.69538C0.433661 6.7989 0.492088 6.8928 0.565678 6.97165L3.89407 10.5813C4.20387 10.9173 4.70432 10.9173 5.01413 10.5813L13.4344 1.45804C13.508 1.37919 13.5664 1.28529 13.6063 1.18177C13.6462 1.07825 13.6667 0.967177 13.6667 0.854988C13.6667 0.742799 13.6462 0.631726 13.6063 0.528207C13.5664 0.424689 13.508 0.330784 13.4344 0.251937C13.3617 0.172128 13.2751 0.108763 13.1797 0.0655158C13.0842 0.0222688 12.9818 0 12.8783 0C12.7749 0 12.6725 0.0222688 12.577 0.0655158C12.4816 0.108763 12.395 0.172128 12.3223 0.251937L4.45807 8.78081Z"
              fill="white"
            />
          </svg>
          <span style={{ fontSize: '16px', marginLeft: '3px' }}>Done</span>
        </Button>
        <div style={{ height: '60px' }}></div>
      </form>
    </Box>
  );
};

export default VoucherEditForm;
