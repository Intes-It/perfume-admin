import { Paper, Table, TextInput, createStyles, rem } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { ordersListType } from '../utils/utilsInterface';
import { GET } from '../utils/fetch';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import { Link, useSearchParams } from 'react-router-dom';

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
}));
const listStatus: { [key: string]: string } = {
  '3': 'New order',
  '4': 'Accepted',
  '5': 'Rejected',
  '6': 'In progress',
  '7': 'Delivering',
  '8': 'Completed',
};
const orderStatus = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: '3',
    label: 'New order',
  },
  {
    value: '4',
    label: 'Accepted',
  },
  {
    value: '7',
    label: 'Delivering',
  },
  {
    value: '8',
    label: 'Completed',
  },
  {
    value: '5',
    label: 'Rejected',
  },
];
export default function ListOrder() {
  const [searchParams, setSearchParams] = useSearchParams();

  const StatusValue = searchParams.get('status') || 'all';
  const pageNumber = (searchParams.get('page') || 1) as number;
  const searchValue = searchParams.get('search')?.toString() || '';
  const { classes, cx } = useStyles();
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, setState] = React.useState({
    status: StatusValue,
    tab: '1',
    totalOrder: 0,
    orderId: -1,
    page: pageNumber,
    count: 1,
    searchText: searchValue,
    search: searchValue,
    rejectModal: false,
    checkChangeStatus: false,
  });
  const onchangePage = ({ selected: selectedPage }: { selected: number }) => {
    setState((pre) => ({
      ...pre,
      page: selectedPage + 1,
    }));
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', (selectedPage + 1).toString());

    setSearchParams(newSearchParams);
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
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('search', search);
    newSearchParams.set('page', '1');

    setSearchParams(newSearchParams);
  };
  const { status, page, searchText, search, checkChangeStatus } = state;
  async function getListOrder() {
    setIsLoading(true);
    const res = await GET(
      `/api/admin/order?page=${page}${
        status === 'all' ? '' : '&statuses=' + status
      }${'&page_size=10'}${
        searchText ? '&search_id_customer=' + searchText : ''
      }`,
    );
    setData(res?.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getListOrder();
  }, [status, page, searchText, checkChangeStatus]);

  return (
    <div className="w-[85%] mx-auto">
      <div
        style={{
          marginTop: '10px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#374151',
        }}
      >
        List Order{' '}
      </div>
      <div
        className="mt-8"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
        }}
      >
        {orderStatus?.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                width: '120px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item.value === status ? '#FFD9E2' : '#fff',
                cursor: 'pointer',
                color: item.value === status ? '#970024' : '#374151',
                fontWeight: item.value === status ? '600' : '400',
                borderRadius: '4px',
              }}
              onClick={() => {
                setState((pre) => ({
                  ...pre,
                  status: item.value,
                  page: 1,
                  searchText: '',
                  search: '',
                }));
                const newSearchParams = new URLSearchParams(
                  searchParams.toString(),
                );
                newSearchParams.set('search', '');
                newSearchParams.set('page', '1');
                newSearchParams.set('status', item.value);

                setSearchParams(newSearchParams);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div className="flex w-full justify-end">
        {/* <span style={{ color: '#B82C67', marginBottom: '4px', fontSize: 12 }}>
          Search
        </span>

        <TextInput
          rightSection={
            <img
              src="/search.svg"
              alt="icon"
              style={{ zIndex: 100, cursor: 'pointer' }}
              onClick={handleSearch}
            />
          }
          w={'320px'}
          variant="unstyled"
          sx={{
            border: '1px solid #B82C67',
            padding: '0 5px',
            borderRadius: '5px',
            maxWidth: '347px',
            height: 32,
            minHeight: 32,
            fontSize: 14,
            '.mantine-Input-input': {
              height: 32,
            },
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          value={search}
          onChange={onSearch}
        /> */}
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
          w={240}
          h={40}
          variant="unstyled"
          className="mt-6 mb-4 "
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          value={search}
          onChange={onSearch}
          style={{
            border: '0.5px solid #D9D9D9',
            borderRadius: '4px',
            fontSize: '12px',
            paddingLeft: '16px',
          }}
        />
      </div>

      <Paper
        shadow="md"
        radius="md"
        className="list_order_admin"
        sx={{ border: '1px solid #B82C67', color: '#970024' }}
      >
        {isLoading ? (
          <div className="flex justify-center py-72">
            <span className="loader" />
          </div>
        ) : (
          <Table
            sx={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              overflow: 'hidden',
            }}
            highlightOnHover
            withColumnBorders
          >
            <thead className={cx(classes.header)}>
              <tr
                style={{
                  textAlign: 'center',
                  color: '#970024',
                  backgroundColor: '#FFE2EC',
                  height: '60px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
                className="font-semibold"
              >
                <th className="w-1/12">Number</th>
                <th className="w-1/12">Order ID</th>
                <th className="w-1/6">Date order</th>
                <th className="w-1/12">Quantity</th>
                <th className="whitespace-nowrap  text-ellipsis  truncate max-w-10">
                  Customer
                </th>
                <th className="w-1/12">Total</th>
                <th className="w-1/6 ">Status</th>
                <th className="w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.results?.map((item: ordersListType, index: number) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fff' : '#FFF1F6',
                      color: '#374151',
                    }}
                  >
                    <td className="h-[60px]">{index + 1}</td>
                    <td>{item.id}</td>
                    <td>
                      {' '}
                      {dayjs(item.paid_at || item.created_at)?.format(
                        'YYYY-MM-DD',
                      )}
                      {'    '}
                      <span className="ml-2"></span>
                      {dayjs(item.paid_at || item.created_at)?.format('HH:mm')}
                    </td>
                    <td>
                      {item.quantity === 1
                        ? item.quantity + ' item'
                        : item.quantity + ' items'}
                    </td>
                    <td
                      style={{ fontWeight: '500' }}
                      className="whitespace-nowrap  text-ellipsis  truncate max-w-10"
                    >{`${item.first_name} ${item.last_name}`}</td>
                    <td style={{ fontWeight: '500' }}>
                      {Number(item.total).toFixed(2)}
                      <span style={{ fontWeight: '700' }}>{' $'}</span>
                    </td>

                    <td
                      style={{
                        fontWeight: '500',
                        color:
                          String(item.status) === '8'
                            ? '#00DD16'
                            : String(item.status) === '5'
                            ? '#FF2626'
                            : '#0047FF',
                      }}
                    >
                      {listStatus[item.status.toString()]}
                    </td>
                    <td>
                      <Link to={`/order_detail/${item.id}`}>
                        <div className="flex items-center gap-x-2 cursor-pointer">
                          <span className="text-[#005AEA] font-normal text-xs">
                            Detail
                          </span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.25596 2.21529C4.41321 2.0805 4.64994 2.09871 4.78473 2.25596L7.78473 5.75596C7.9051 5.89639 7.9051 6.10362 7.78473 6.24405L4.78473 9.74405C4.64994 9.9013 4.41321 9.91951 4.25596 9.78473C4.09871 9.64994 4.0805 9.41321 4.21529 9.25596L7.0061 6.00001L4.21529 2.74405C4.0805 2.58681 4.09871 2.35007 4.25596 2.21529Z"
                              fill="#575757"
                            />
                          </svg>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}

        {data && data?.results?.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            className="flex items-center custom-pagination justify-center gap-2 text-sm py-5"
            onPageChange={onchangePage}
            forcePage={page - 1 > 0 ? page - 1 : 0}
            pageRangeDisplayed={3}
            pageCount={data?.num_pages || 1}
            previousLabel="Previous"
          />
        )}
      </Paper>
    </div>
  );
}
