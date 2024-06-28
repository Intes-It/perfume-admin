import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
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
import { formatDay } from '../../utils/format.ts';
import { DELETE, GET } from '../../utils/fetch.ts';
import VoucherEditForm from '../form/VoucherEditForm.tsx';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';

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
    scrolled: false,
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
    search: '',
  });
  const {
    scrolled,
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
    setState((p) => ({ ...p, voucherData: res?.data?.results }));
    setState((p) => ({ ...p, count: res?.data?.num_pages }));
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
            minDate={new Date()}
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
            minDate={start_date ? new Date(start_date) : new Date()}
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
        Discount voucher ({voucherData?.length})
      </Title>

      <Paper shadow="md" radius="md" sx={{ border: '1px solid #B82C67' }}>
        <Table sx={{ borderRadius: '0.65em', overflow: 'hidden' }}>
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
              <td className="w-1/6">
                Name of <br />
                voucher
              </td>
              <td className="w-[10%]">Promo code</td>
              <td className="w-[15%]">Type of discount</td>
              <td className="w-1/12">Quantity</td>
              <td className="w-1/12">Apply to</td>
              <td className="w-[13%]">Start date</td>
              <td className="w-[13%]">End date</td>
              <td className="w-1/12">Status</td>
              {/* <td>Pendre le code</td> */}
              {/* <td></td> */}
              <td className="w-1/12"></td>
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
                      ? ` Valuer - ${item.discount}$`
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
                      style={{ marginRight: '16px' }}
                      onClick={function () {
                        setState((p) => ({
                          ...p,
                          voucherID: item.id as number,
                          editModal: true,
                        }));
                      }}
                    >
                      <svg
                        width="22"
                        height="20"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.5 18.5H21.5V20H0.5V18.5ZM18.05 5.75C18.65 5.15 18.65 4.25 18.05 3.65L15.35 0.95C14.75 0.35 13.85 0.35 13.25 0.95L2 12.2V17H6.8L18.05 5.75ZM14.3 2L17 4.7L14.75 6.95L12.05 4.25L14.3 2ZM3.5 15.5V12.8L11 5.3L13.7 8L6.2 15.5H3.5Z"
                          fill="#B82C67"
                        />
                      </svg>
                    </UnstyledButton>
                    <UnstyledButton
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          deleteModal: true,
                          deleteId: item.id as number,
                        }))
                      }
                    >
                      <svg
                        width="24"
                        height="23"
                        viewBox="0 0 24 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_929_1477)">
                          <path
                            d="M20 4.79199C20.2652 4.79199 20.5196 4.89296 20.7071 5.07268C20.8946 5.2524 21 5.49616 21 5.75033C21 6.00449 20.8946 6.24825 20.7071 6.42797C20.5196 6.60769 20.2652 6.70866 20 6.70866H19L18.997 6.7767L18.064 19.3031C18.0281 19.7866 17.8023 20.2392 17.4321 20.5696C17.0619 20.9 16.5749 21.0837 16.069 21.0837H7.93C7.42414 21.0837 6.93707 20.9 6.56688 20.5696C6.1967 20.2392 5.97092 19.7866 5.935 19.3031L5.002 6.77766C5.00048 6.75469 4.99982 6.73167 5 6.70866H4C3.73478 6.70866 3.48043 6.60769 3.29289 6.42797C3.10536 6.24825 3 6.00449 3 5.75033C3 5.49616 3.10536 5.2524 3.29289 5.07268C3.48043 4.89296 3.73478 4.79199 4 4.79199H20ZM16.997 6.70866H7.003L7.931 19.167H16.069L16.997 6.70866ZM14 1.91699C14.2652 1.91699 14.5196 2.01796 14.7071 2.19768C14.8946 2.3774 15 2.62116 15 2.87533C15 3.12949 14.8946 3.37325 14.7071 3.55297C14.5196 3.73269 14.2652 3.83366 14 3.83366H10C9.73478 3.83366 9.48043 3.73269 9.29289 3.55297C9.10536 3.37325 9 3.12949 9 2.87533C9 2.62116 9.10536 2.3774 9.29289 2.19768C9.48043 2.01796 9.73478 1.91699 10 1.91699H14Z"
                            fill="#B82C67"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_929_1477">
                            <rect width="24" height="23" fill="white" />
                          </clipPath>
                        </defs>
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
      >
        <Paper pt={'1rem'}>
          <Text align={'center'} sx={{ fontSize: '16px', fontWeight: 600 }}>
            Do you really want to delete this voucher?
          </Text>
          <Group sx={{ float: 'right' }} my={32}>
            <Button
              variant={'subtle'}
              onClick={() => setState((p) => ({ ...p, deleteModal: false }))}
            >
              <span style={{ color: '#333' }}>No</span>
            </Button>
            <Button
              onClick={async function () {
                await DELETE(`/api/admin/voucher/delete/?ids=${deleteId}`);
                setState((p) => ({
                  ...p,
                  deleteModal: false,
                })),
                  getVoucher();
              }}
            >
              Yes
            </Button>
          </Group>
        </Paper>
      </Modal>
    </div>
  );
};

export default Voucher;
