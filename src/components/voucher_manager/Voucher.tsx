import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Table,
  UnstyledButton,
  createStyles,
  rem,
  Title,
  Text,
  TextInput,
} from '@mantine/core';

import { useEffect, useState } from 'react';
// import VoucherForm from '../form/VoucherEditForm';
import { DateInput } from '@mantine/dates';
import VoucherCreateForm from '../form/VoucherCreateForm';
import { useDisclosure } from '@mantine/hooks';
import { voucherType } from '../../utils/utilsInterface.ts';
import { DELETE, GET } from '../../utils/fetch.ts';
import VoucherEditForm from '../form/VoucherEditForm.tsx';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import { notifications } from '@mantine/notifications';

const statusData = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];
const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    borderRadius: '1em',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  voucher_header: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    border: '1px solid #B82C67',
    borderRadius: '5px',
    padding: '8px 0',
    textAlign: 'center',
  },
}));
const Voucher = () => {
  const [state, setState] = useState({
    voucherID: 0,
    editModal: false,
    voucherData: [] as voucherType[],
    deleteModal: false,
    deleteId: 0,
    start_date: '',
    searchText: '',
    end_date: '',
    status: 'all',
    page: 1,
    count: 1,
    total: 0,
    search: '',
  });
  const {
    voucherData,
    deleteModal,
    deleteId,
    voucherID,
    editModal,
    searchText,
    start_date,
    end_date,
    status,
    page,
    search,
    count,
    total,
  } = state;
  const { classes, cx } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  async function getVoucher() {
    const res = await GET(
      `/api/admin/voucher?${
        status === 'active'
          ? 'active=true'
          : status === 'inactive'
          ? 'active=false'
          : ''
      }${searchText ? '&search=' + searchText : ''}${
        start_date
          ? '&start_date=' + dayjs(start_date).format('YYYY-MM-DD')
          : ''
      }${
        end_date ? '&end_date=' + dayjs(end_date).format('YYYY-MM-DD') : ''
      }${'&page_size=10'}${'&page=' + page}`,
    );
    setState((p) => ({
      ...p,
      count: res?.data?.num_pages,
      total: res?.data?.count,
      voucherData: res?.data?.results,
    }));
  }
  const onchangePage = ({ selected: selectedPage }: { selected: number }) => {
    setState((pre) => ({
      ...pre,
      page: selectedPage + 1,
    }));
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setState((pre) => ({
        ...pre,
        search: e.target.value,
        searchText: e.target.value,
        page: 1,
      }));
    } else {
      setState((pre) => ({
        ...pre,
        search: e.target.value,
      }));
    }
  };

  const handleSearch = () => {
    setState((pre) => ({
      ...pre,
      searchText: search,
      page: 1,
    }));
  };

  useEffect(() => {
    getVoucher();
  }, [status, searchText, start_date, end_date, page]);

  return (
    <div style={{ padding: '32px 5.44rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title order={2} c={'#B82C67'} sx={{ fontSize: '24px' }}>
          Voucher management
        </Title>
        <Button
          rightIcon={<img src="/plus.svg" alt="icon" />}
          bg={'#B82C67'}
          w={'218px'}
          h={'2.625rem'}
          onClick={open}
          sx={{
            borderRadius: '10px',
            fontSize: '16px',
          }}
        >
          Add new voucher
        </Button>
      </div>
      <br />

      <Box mt={32} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Group spacing={'xl'}>
          <Select
            // className="header_list_voucher"
            data={statusData}
            rightSection={<img alt="icon" src="/down_arrow.svg" />}
            bg={'#FFE7EF'}
            variant={'unstyled'}
            className="input_select_status"
            label={
              <span
                style={{
                  fontSize: '10px',
                  color: '#858585',
                  display: 'flex',
                  marginLeft: '6px',
                }}
              >
                Status
              </span>
            }
            h={58}
            w={'16.1875rem'}
            sx={{
              borderRadius: '5px',
              paddingLeft: '10px',
            }}
            value={status}
            onChange={(e: string) => {
              setState((p) => ({ ...p, status: e, page: 1 }));
            }}
            allowDeselect
          />

          <DateInput
            // className="header_list_voucher"
            clearable
            label={
              <span
                style={{
                  fontSize: '10px',
                  color: '#858585',
                  marginLeft: '6px',
                }}
              >
                Start date
              </span>
            }
            h={58}
            w={190}
            rightSection={
              <img src={'calendar.svg'} alt={'icon'} className={'mb-15 '} />
            }
            variant="unstyled"
            bg={'#FFE7EF'}
            className="date-input-class"
            sx={{ borderRadius: '5px', paddingLeft: '8px' }}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                start_date: e !== null ? String(e) : '',
                page: 1,
              }))
            }
            maxDate={end_date ? new Date(end_date) : undefined}
          />
          <DateInput
            clearable
            label={
              <span
                style={{
                  fontSize: '10px',
                  color: '#858585',
                  marginLeft: '6px',
                }}
              >
                End date
              </span>
            }
            h={58}
            w={190}
            rightSection={
              <img src={'calendar.svg'} alt={'icon'} className={'mb-15'} />
            }
            className="date-input-class"
            variant="unstyled"
            bg={'#FFE7EF'}
            sx={{ borderRadius: '5px', paddingLeft: '8px' }}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                end_date: e !== null ? String(e) : '',
                page: 1,
              }))
            }
            minDate={start_date ? new Date(start_date) : undefined}
          />
          {/* <Button
            bg={'#B82C67'}
            w={'7.5rem'}
            h={58}
            onClick={() => {
              setState((p) => ({ ...p, check: true }));
            }}
          >
            Confirm
          </Button> */}
        </Group>
        <TextInput
          rightSection={
            <img
              src="/search.svg"
              alt="icon"
              style={{ zIndex: 100, cursor: 'pointer' }}
              onClick={handleSearch}
            />
          }
          placeholder="Search"
          w={327}
          h={42}
          variant="unstyled"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          value={search}
          onChange={onSearch}
          className="input_search"
          style={{
            border: '0.5px solid #D9D9D9',
            borderRadius: '4px',
            fontSize: '12px',
            paddingLeft: '16px',
          }}
        />
      </Box>

      <br />
      <Title c={'#B82C67'} className="font-medium text-xl mb-8">
        Discount voucher ({total})
      </Title>

      <Paper shadow="md" radius="md" sx={{ border: '1px solid #B82C67' }}>
        <Table
          sx={{
            borderTopLeftRadius: '0.65em',
            borderTopRightRadius: '0.65em',
            overflow: 'hidden',
          }}
        >
          <thead className={cx(classes.header)}>
            <tr
              style={{
                color: '#B82C67',
                backgroundColor: '#FFE2EC',
                height: '60px',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              <td className="w-[14%]">
                Name of <br />
                voucher
              </td>
              <td className="w-[11%]">Promo code</td>
              <td className="w-[16%]">Type of discount</td>
              <td className="w-1/12">Quantity</td>
              <td className="w-[8%]">Apply to</td>
              <td className="w-[12%]">Start date</td>
              <td className="w-[12%]">End date</td>
              <td className="w-1/12 text-center">Status</td>
              {/* <td>Pendre le code</td> */}
              {/* <td></td> */}
              <td className="w-[5%] text-center">Modify</td>
              <td className="w-[5%] text-center">Delete</td>
            </tr>
          </thead>
          <tbody>
            {voucherData &&
              voucherData?.map((item: Partial<voucherType>, index: number) => (
                <tr
                  key={index}
                  style={{
                    textAlign: 'center',
                    height: '60px',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#FFF1F6',
                  }}
                  className={'hover_table'}
                >
                  <td className="whitespace-nowrap  text-ellipsis  truncate max-w-10">
                    {item.name}
                  </td>
                  <td>{item.code}</td>
                  <td>
                    {String(item.discount_type) === '2'
                      ? ` Value - ${item.discount}$`
                      : `% Discount - ${item.discount}%`}
                  </td>
                  <td>
                    {Number(item.total_quantity) - Number(item.used_quantity)}/
                    {item.total_quantity}
                  </td>
                  <td>{item.apply_to == '1' ? 'Product' : 'Delivery'}</td>
                  <td>{dayjs(item.start_date).format('DD-MM-YYYY')}</td>
                  <td>{dayjs(item.end_date).format('DD-MM-YYYY')}</td>
                  <td>
                    <span
                      style={{
                        background:
                          item.active === false ? '#FFC978' : '#87FF74',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        padding: item.active === true ? '6px 26px' : '6px 20px',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        fontWeight: 500,
                        fontSize: '14px',
                        width: '97px',
                      }}
                    >
                      {item.active === true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* <td>
                      {item.last_code ? (
                        <div
                          style={{
                            border: '1px solid #E7639A',
                            height: '3.5rem',
                            width: '7.0625rem',
                            borderRadius: '5px',
                            display: 'flex',
                          }}
                        >
                          <span
                            style={{
                              color: '#E7639A',
                              fontSize: '0.75rem',
                            }}
                          >
                            {item.last_code}
                          </span>
                          <div>
                            <CopyButton value={item.last_code}>
                              {({ copied, copy }) => (
                                <Tooltip
                                  label={copied ? 'Copied' : 'Copy'}
                                  withArrow
                                  position="right"
                                >
                                  <ActionIcon
                                    variant={'transparent'}
                                    color={copied ? 'teal' : 'gray'}
                                    onClick={copy}
                                  >
                                    {copied ? (
                                      <IconCheck size="1rem" />
                                    ) : (
                                      <IconCopy size="1rem" color={'#52C7FA'} />
                                    )}
                                  </ActionIcon>
                                </Tooltip>
                              )}
                            </CopyButton>
                            <Tooltip
                              label={'refresh'}
                              withArrow
                              position={'right'}
                            >
                              <ActionIcon
                                variant={'transparent'}
                                disabled={(item.available as number) <= 0}
                                onClick={() =>
                                  refreshVoucherCode(item.id as number)
                                }
                              >
                                <IconRefresh size={'1rem'} color={'#B82C67'} />
                              </ActionIcon>
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        <UnstyledButton
                          onClick={() => refreshVoucherCode(item.id as number)}
                        >
                          <img src="/plus_round.svg" alt="icon" />
                        </UnstyledButton>
                      )}
                    </td> */}
                  {/* <td>
                      
                    </td> */}
                  <td>
                    <UnstyledButton
                      onClick={function () {
                        setState((p) => ({
                          ...p,
                          voucherID: item.id as number,
                          editModal: true,
                        }));
                      }}
                      className="flex items-center mx-auto"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.16667 8.16699H7C6.38116 8.16699 5.78767 8.41282 5.35008 8.85041C4.9125 9.28799 4.66667 9.88149 4.66667 10.5003V21.0003C4.66667 21.6192 4.9125 22.2127 5.35008 22.6502C5.78767 23.0878 6.38116 23.3337 7 23.3337H17.5C18.1188 23.3337 18.7123 23.0878 19.1499 22.6502C19.5875 22.2127 19.8333 21.6192 19.8333 21.0003V19.8337"
                          stroke="#B82C67"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.6667 5.83346L22.1667 9.33346M23.7825 7.68263C24.242 7.22314 24.5001 6.59994 24.5001 5.95012C24.5001 5.30031 24.242 4.67711 23.7825 4.21762C23.323 3.75814 22.6998 3.5 22.05 3.5C21.4002 3.5 20.777 3.75814 20.3175 4.21762L10.5 14.0001V17.5001H14L23.7825 7.68263Z"
                          stroke="#B82C67"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </UnstyledButton>
                  </td>
                  <td>
                    <UnstyledButton
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          deleteModal: true,
                          deleteId: item.id as number,
                        }))
                      }
                      className="flex items-center mx-auto"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 8.80042L19.7474 10.9754L4.55324 2.17496L5.80585 0L9.61378 2.2001L11.3173 1.73494L16.7411 4.87795L17.2046 6.60031L21 8.80042ZM3 21.4856V6.39916H9.35073L18.0313 11.428V21.4856C18.0313 22.1525 17.7674 22.792 17.2976 23.2635C16.8277 23.7351 16.1905 24 15.5261 24H5.50522C4.84079 24 4.20358 23.7351 3.73376 23.2635C3.26394 22.792 3 22.1525 3 21.4856Z"
                          fill="#B82C67"
                        />
                      </svg>
                    </UnstyledButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {voucherData && voucherData?.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            className="flex items-center custom-pagination justify-center gap-2 text-sm py-5"
            onPageChange={onchangePage}
            forcePage={page - 1 > 0 ? page - 1 : 0}
            pageRangeDisplayed={3}
            pageCount={count || 1}
            previousLabel="Previous"
          />
        )}
        {voucherData && voucherData?.length === 0 && (
          <div className="flex flex-row justify-center gap-5 py-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 4.875H3C2.90054 4.875 2.80516 4.91451 2.73484 4.98484C2.66451 5.05516 2.625 5.15054 2.625 5.25V18C2.625 18.2984 2.74353 18.5845 2.9545 18.7955C3.16548 19.0065 3.45163 19.125 3.75 19.125H20.25C20.5484 19.125 20.8345 19.0065 21.0455 18.7955C21.2565 18.5845 21.375 18.2984 21.375 18V5.25C21.375 5.15054 21.3355 5.05516 21.2652 4.98484C21.1948 4.91451 21.0995 4.875 21 4.875ZM3.375 10.125H7.875V13.875H3.375V10.125ZM8.625 10.125H20.625V13.875H8.625V10.125ZM20.625 5.625V9.375H3.375V5.625H20.625ZM3.375 18V14.625H7.875V18.375H3.75C3.65054 18.375 3.55516 18.3355 3.48484 18.2652C3.41451 18.1948 3.375 18.0995 3.375 18ZM20.25 18.375H8.625V14.625H20.625V18C20.625 18.0995 20.5855 18.1948 20.5152 18.2652C20.4448 18.3355 20.3495 18.375 20.25 18.375Z"
                fill="black"
              />
            </svg>
            <span className="text-[16px] text-black font-medium">
              No data available
            </span>
          </div>
        )}
      </Paper>
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
              <Title c={'#B82C67'} size={'24px'} mt={32} ml={64}>
                Add new voucher{' '}
              </Title>
            </Modal.Title>
            <Modal.CloseButton>
              <img
                src={'/close.svg'}
                alt={'icon'}
                height={'18px'}
                width={'18px'}
              />
            </Modal.CloseButton>
          </Modal.Header>
          <Modal.Body>
            <VoucherCreateForm
              onSuccess={() => {
                getVoucher();
                close();
                notifications.show({
                  message: `Added successfully!`,
                  color: 'green',
                });
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {/*edit modal*/}
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
              <Title c={'#B82C67'} size={'24px'} mt={32} ml={64}>
                Edit voucher
              </Title>
            </Modal.Title>
            <Modal.CloseButton>
              <img src={'/close.svg'} alt={'icon'} />
            </Modal.CloseButton>
          </Modal.Header>
          <Modal.Body>
            <VoucherEditForm
              onSuccess={() => {
                getVoucher();
                setState((p) => ({ ...p, editModal: false }));
                notifications.show({
                  message: `Updated successfully!`,
                  color: 'green',
                });
              }}
              id={voucherID}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {/*  delete modal*/}
      <Modal
        opened={deleteModal}
        onClose={close}
        withCloseButton={false}
        centered
        radius={'md'}
        size={400}
      >
        <Paper px={4} w={360}>
          <Text
            align={'left'}
            sx={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
            w={360}
          >
            Do you really want to delete this voucher?
          </Text>
          <Group sx={{ float: 'right' }} mt={42} mb={16}>
            <Button
              variant={'subtle'}
              onClick={() => setState((p) => ({ ...p, deleteModal: false }))}
            >
              <span
                style={{
                  color: '#374151',
                  fontWeight: '500px',
                  fontSize: '14px',
                }}
              >
                Cancel
              </span>
            </Button>
            <Button
              onClick={async function () {
                await DELETE(`/api/admin/voucher/delete/?ids=${deleteId}`);
                setState((p) => ({
                  ...p,
                  deleteModal: false,
                })),
                  getVoucher();
                notifications.show({
                  message: `Delete successfully!`,
                  color: 'green',
                });
              }}
              className="bg-[#E13434] text-white font-medium text-sm"
            >
              Delete
            </Button>
          </Group>
        </Paper>
      </Modal>
    </div>
  );
};

export default Voucher;
