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

import { DateInput } from '@mantine/dates';
import _ from 'lodash';
import { useForm } from '@mantine/form';
import { voucherType } from '../../utils/utilsInterface';
import { useState } from 'react';
import { POST } from '../../utils/fetch';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';

type voucherFormprops = {
  onSuccess: () => void;
};
const VoucherCreateForm = ({ onSuccess }: voucherFormprops) => {
  const [state, setState] = useState({
    start_date: '',
    isPercent: true,
    end_date: '',
  });
  const { start_date, end_date, isPercent } = state;
  const form = useForm<voucherType>({
    initialValues: {
      name: '',
      discount_type: '1',
      total_quantity: 0,
      discount: 0,
      apply_to: '1',
      start_date: '',
      end_date: '',
      active: true,
      description: '',
      // total: 0,
    },
    validate: {
      // total: (v) => (v.toString().length >= 4 ? 'error' : null),
      discount: (v) =>
        isPercent
          ? v > 100
            ? 'error'
            : null
          : v.toString().length > 4
          ? 'error'
          : null,
      name: (v) => (v.length > 100 ? 'error' : null),
      total_quantity: (v) => (v.toString().length > 6 ? 'error' : null),
    },
  });

  async function createVoucher(v: voucherType) {
    try {
      const res = await POST('/api/admin/voucher/create/', v);
      console.log(res);
      onSuccess();
      // if (res.message !== 'Data not valid') {
      //   onSuccess();
      // } else {
      //   notifications.show({
      //     message: 'Oups! L’erreur système s’est produite',
      //     color: 'red',
      //   });
      // }
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
        onSubmit={form.onSubmit((v) => createVoucher(v))}
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
              {...form.getInputProps('name')}
              required
              maxLength={100}
            />
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
              maxLength={500}
              required
              {...form.getInputProps('description')}
            />
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
                data={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
                w={'15.5rem'}
                h={'2.375rem'}
                onChange={(e: string) => {
                  form.setFieldValue('active', e === 'true');
                }}
                value={String(form.values.active)}
                required={true}
                rightSection={<img src="/down_arrow.svg" alt="icon" />}
                withAsterisk
                sx={{
                  borderRadius: '4px',
                  background: '#FFE7EF',
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
                sx={{
                  resize: 'none',
                  border: '1px solid #b82c67',
                  borderRadius: '4px',
                  padding: '0px 10px',
                }}
                maxLength={9}
                variant={'unstyled'}
                onKeyDown={(e) =>
                  e.key === '.' ||
                  e.key === 'e' ||
                  e.key === '-' ||
                  e.key === '+'
                    ? e.preventDefault()
                    : null
                }
                required
                onChange={(e) =>
                  form.setFieldValue('total_quantity', +e.target.value)
                }
              />
              {Object.hasOwn(form.errors, 'total_quantity') && (
                <div className="font-medium text-[#D72525] text-[10px] ">
                  Maximum quantity is 999999
                </div>
              )}
            </div>
          </Group>
          <div>
            <div style={{ display: 'flex' }}>
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
                      Start date
                    </span>
                    <DateInput
                      rightSection={<img src={'calendar.svg'} alt={'icon'} />}
                      w={'15.5rem'}
                      // pt={'5px'}
                      h={'2.25rem'}
                      variant="unstyled"
                      className="date-input-class-create"
                      bg={'#FFE7EF'}
                      pl={'10px'}
                      sx={{ borderRadius: '4px' }}
                      minDate={new Date()}
                      maxDate={end_date ? new Date(end_date) : undefined}
                      onChange={(e) => {
                        form.setFieldValue(
                          'start_date',
                          dayjs(e).format('YYYY-MM-DD'),
                        );
                        setState((p) => ({ ...p, start_date: String(e) }));
                      }}
                      required
                    />
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
                      End date
                    </span>
                    <DateInput
                      rightSection={<img src={'calendar.svg'} alt={'icon'} />}
                      w={'15.5rem'}
                      className="date-input-class-create"
                      // pt={'5px'}
                      h={'2.25rem'}
                      variant="unstyled"
                      pl={'10px'}
                      sx={{
                        borderRadius: '4px',
                        backgroundColor:
                          start_date === '' ? '#f1f3f5' : '#FFE7EF',
                        opacity: start_date === '' ? 0.6 : 1,
                      }}
                      onChange={(e) => {
                        form.setFieldValue(
                          'end_date',
                          dayjs(e).format('YYYY-MM-DD'),
                        );
                        setState((p) => ({ ...p, end_date: String(e) }));
                      }}
                      disabled={start_date === ''}
                      minDate={new Date(start_date)}
                      required
                    />
                  </div>
                </Group>
              </div>
            </div>
          </div>
          <Title order={5} c={'#E7639A'} mb={'-8px'}>
            Apply to
          </Title>
          {/* <Radio.Group {...form.getInputProps('discount_target')} required> */}
          <Radio.Group
            required
            value={form.values.apply_to}
            onChange={(value) => form.setFieldValue('apply_to', value)}
          >
            <Group>
              <Radio
                value={'1'}
                checked={form.values.apply_to === '1'}
                disabled={true}
                // onClick={() => setState((p) => ({ ...p, isShip: false }))}
                label={
                  <span style={{ color: '#E7639A', fontSize: '12px' }}>
                    Product
                  </span>
                }
              />
              <Radio
                value={'2'}
                checked={form.values.apply_to === '2'}
                // onClick={() => setState((p) => ({ ...p, isShip: true }))}
                label={
                  <span style={{ color: '#E7639A', fontSize: '12px' }}>
                    Delivery
                  </span>
                }
                disabled={true}
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
              onChange={(e: string) => {
                form.setFieldValue('discount_type', e);
                form.setFieldError('discount', null);
                if (e === '1') {
                  setState((p) => ({ ...p, isPercent: true }));
                } else {
                  setState((p) => ({ ...p, isPercent: false }));
                }
              }}
              value={form.values.discount_type}
              required={true}
              rightSection={<img src="/down_arrow.svg" alt="icon" />}
              withAsterisk
              className="input_select_status_create"
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
              type={'number'}
              min={0}
              maxLength={4}
              onChange={(e) => form.setFieldValue('discount', +e.target.value)}
              required
              onKeyDown={(e) =>
                e.key === '.' || e.key === 'e' || e.key === '_' || e.key === '+'
                  ? e.preventDefault()
                  : null
              }
              sx={{
                resize: 'none',
                border: '1px solid #b82c67',
                borderRadius: '4px',
                padding: '0px 10px',
              }}
              variant={'unstyled'}
            />
            {isPercent ? '%' : '$'}
          </Group>
          {Object.hasOwn(form.errors, 'discount') && (
            <div className="font-medium text-[#D72525] text-[10px] mt-[-20px]">
              {isPercent ? 'Maximum amount is 100%' : 'Maximum value is $ 9999'}
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
          <div className="flex flex-row justify-center items-center">
            {' '}
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
            <span
              style={{ fontSize: '16px' }}
              className="font-medium text-white ml-2"
            >
              Done
            </span>
          </div>
        </Button>
        <div style={{ height: '60px' }}></div>
      </form>
    </Box>
  );
};

export default VoucherCreateForm;
