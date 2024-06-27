import { Button, Group, Image, Modal, Paper, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { GET, PATCH } from '../utils/fetch';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [orderDetail, setOrderDetail] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = React.useState({
    checkChangeStatus: false,
    rejectModal: false,
  });
  const { checkChangeStatus, rejectModal } = state;
  async function changeStatusOrder(status: number) {
    try {
      setIsLoading(true);
      const res = await PATCH(`/api/admin/order/${id}/patch/`, {
        status: status,
      });
      setState((pre) => ({
        ...pre,
        checkChangeStatus: !checkChangeStatus,
      }));
      setIsLoading(false);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  async function getOrderDetail() {
    setIsLoading(true);
    const res = await GET(`/api/admin/order/${id}/`);
    setOrderDetail(res?.data);
    setIsLoading(false);
  }
  useEffect(() => {
    getOrderDetail();
  }, [checkChangeStatus]);
  return (
    <div className="ml-[56px]">
      <h1 className="text-[#374151] font-semibold text-2xl flex flex-row gap-3">
        <svg
          onClick={handleBack}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto cursor-pointer"
        >
          <g clip-path="url(#clip0_306_3068)">
            <path
              d="M3.63605 11.2932C3.44858 11.4807 3.34326 11.735 3.34326 12.0002C3.34326 12.2653 3.44858 12.5197 3.63605 12.7072L9.29305 18.3642C9.48165 18.5463 9.73425 18.6471 9.99645 18.6449C10.2586 18.6426 10.5095 18.5374 10.6949 18.352C10.8803 18.1666 10.9854 17.9158 10.9877 17.6536C10.99 17.3914 10.8892 17.1388 10.707 16.9502L6.75705 13.0002H20C20.2653 13.0002 20.5196 12.8948 20.7072 12.7073C20.8947 12.5198 21 12.2654 21 12.0002C21 11.735 20.8947 11.4806 20.7072 11.2931C20.5196 11.1055 20.2653 11.0002 20 11.0002H6.75705L10.707 7.05018C10.8892 6.86158 10.99 6.60898 10.9877 6.34678C10.9854 6.08458 10.8803 5.83377 10.6949 5.64836C10.5095 5.46295 10.2586 5.35778 9.99645 5.35551C9.73425 5.35323 9.48165 5.45402 9.29305 5.63618L3.63605 11.2932Z"
              fill="#374151"
            />
          </g>
          <defs>
            <clipPath id="clip0_306_3068">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Order Detail
      </h1>
      {isLoading ? (
        <div className="flex justify-center py-72">
          <span className="loader" />
        </div>
      ) : (
        <div className="mt-[42px] flex flex-wrap">
          <div className="w-3/5 border border-[#E9E9E9]  mr-8 p-6 h-fit">
            <div className="flex justify-between">
              <div className="text-[16px] text-[#374151] font-medium">
                Order ID:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold">
                #{orderDetail.id}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Date order:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                <span className="mr-2">
                  {dayjs(
                    orderDetail?.paid_at || orderDetail?.created_at,
                  ).format('HH:mm')}
                </span>
                {dayjs(orderDetail?.paid_at || orderDetail?.created_at).format(
                  'YYYY-MM-DD',
                )}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Name:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.first_name + ' ' + orderDetail.last_name}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Name of company (optional):
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.company_name}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Email:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.email}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Address:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.address}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                City:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.city}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Code Post:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.postal_code}
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="text-[16px] text-[#374151] font-medium">
                Phone Number:
              </div>
              <div className="text-[#970024] text-[16px] font-semibold text-right">
                {orderDetail.phone_number}
              </div>
            </div>
            {/* <div className="flex justify-between mt-3">
            <div className="text-[16px] text-[#374151] font-medium">
              Estimate time:
            </div>
            <div className="text-[#603813] text-[16px] font-semibold">
              <span className="mr-2">
                {dayjs(orderDetail.delivered_at).format("HH:MM")}
              </span>
              {dayjs(orderDetail.delivered_at).format("YYYY-MM-DD")}
            </div>
          </div> */}

            <div className="text-[16px] text-[#374151] font-semibold my-8">
              Orders ({orderDetail?.quantity})
            </div>
            <div className="">
              {orderDetail?.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-row justify-between pb-5 pt-4"
                  style={{
                    borderBottom:
                      index !== orderDetail?.items?.length - 1
                        ? '1px solid #E9E9E9'
                        : 'none',
                  }}
                >
                  <div className="flex flex-row">
                    <Image
                      src={item.image ? item.image : item.product.thumbnail.url}
                      alt="item"
                      width={'60px'}
                      height={'60px'}
                    />
                    <div className="flex flex-col ml-3">
                      <div className="flex flex-row gap-5 text-[16px] text-[#374151] font-medium mb-2">
                        <div>{item.product?.name}</div>{' '}
                        <div>{'x ' + item.quantity}</div>
                      </div>
                      <div className="text-[#ABABAB] text-[14px] font-medium">
                        {item.color !== null ? item.color?.name : ''}
                        {item.color !== null && item.capacity !== null && ', '}
                        {item.capacity !== null ? item.capacity?.name : ''}
                        {((item.package !== null && item.capacity !== null) ||
                          (item.color !== null && item.package !== null)) &&
                          ', '}
                        {item.package !== null ? item.package?.name : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[#970024] text-[16px] font-semibold mb-1">
                      {'$ '}
                      {Number(item.total).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3 border border-[#E9E9E9] p-6 flex flex-col h-fit ">
            <div className="flex justify-between mb-3">
              <div className="text-[16px] text-[#374151] font-medium">
                Sub-total
              </div>
              <div className="text-[#970024] text-[16px] font-semibold">
                $ {Number(orderDetail?.total_price_items).toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between pb-3 ">
              <div className="text-[16px] text-[#374151] font-medium">
                Discount
              </div>
              <div className="text-[#970024] text-[16px] font-semibold">
                ${' '}
                {orderDetail.discount !== null
                  ? Number(orderDetail.discount).toFixed(2)
                  : 0.0}
              </div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-[16px] text-[#374151] font-medium">
                Shipping
              </div>
              <div className="text-[#970024] text-[16px] font-semibold">
                $ {Number(orderDetail.shipping_fee).toFixed(2)}
              </div>
            </div>
            <div className="text-[12px] font-normal text-[#ABABAB] mb-6">
              Not included in the price but need to include in the final invoice
              (payment)
            </div>

            <div
              className="flex justify-between pb-6 mb-4 "
              style={{ borderBottom: '1px solid #E9E9E9' }}
            >
              <div className="text-[16px] text-[#374151] font-medium">VAT</div>
              <div className="text-[#970024] text-[16px] font-semibold">
                <span className="mr-3 font-semibold">(5%)</span>${' '}
                {Number(orderDetail?.tax_fee).toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between mb-8">
              <div className="text-[16px] text-[#374151] font-bold">Total</div>
              <div className="flex flex-row gap-8">
                <div className="text-[#970024] text-[20px] font-bold">
                  $ {Number(orderDetail?.total).toFixed(2)}
                </div>
              </div>
            </div>
            {orderDetail?.status === 3 ? (
              <div className="flex flex-row justify-between">
                <button
                  onClick={() => {
                    setState((prev) => ({ ...prev, rejectModal: true }));
                  }}
                  className="bg-[#DB1818] w-[164px] h-[48px] text-[16px] text-white font-bold rounded-lg "
                >
                  REJECT
                </button>
                <button
                  onClick={() => {
                    changeStatusOrder(4);
                  }}
                  className="bg-[#18DB4E] w-[164px] h-[48px] text-[16px] text-white font-bold rounded-lg "
                >
                  ACCEPT
                </button>
              </div>
            ) : orderDetail?.status === 4 ? (
              <button
                onClick={() => {
                  changeStatusOrder(7);
                }}
                className="bg-[#1871DB] w-[291px] h-[48px] text-[16px] text-white font-bold rounded-lg mx-auto "
              >
                SWITCH TO DELIVERY
              </button>
            ) : orderDetail?.status === 5 ? (
              <div className="text-[#DB1818] text-xl font-normal ml-auto">
                Rejected
              </div>
            ) : orderDetail?.status === 7 ? (
              <button
                onClick={() => {
                  changeStatusOrder(8);
                }}
                className="bg-[#18DB4E] w-full h-[48px] text-[16px] text-white font-bold rounded-lg  "
              >
                DONE
              </button>
            ) : (
              <div className="text-[#18DB4E] text-xl font-normal ml-auto">
                Done
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        opened={rejectModal}
        onClose={() => setState((prev) => ({ ...prev, rejectModal: false }))}
        withCloseButton={false}
        centered
        radius={'md'}
      >
        <Paper px={'20px'} py={'16px'}>
          <Text sx={{ fontSize: '16px', fontWeight: 600 }}>
            Are you sure you want to reject this order?
          </Text>
          <Group sx={{ float: 'right' }} my={32}>
            <Button
              variant={'subtle'}
              onClick={() => setState((p) => ({ ...p, rejectModal: false }))}
            >
              <span
                style={{
                  color: '#000',
                  fontWeight: '500px',
                  fontSize: '14px',
                }}
              >
                Cancel
              </span>
            </Button>
            <Button
              onClick={() => {
                changeStatusOrder(5);
                setState((p) => ({ ...p, rejectModal: false }));
              }}
              style={{
                color: '#fff',
                fontWeight: '500px',
                fontSize: '14px',
                backgroundColor: '#E13434',
              }}
            >
              Reject
            </Button>
          </Group>
        </Paper>
      </Modal>
    </div>
  );
};
export default OrderDetail;
