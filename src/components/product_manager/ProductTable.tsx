import { UnstyledButton } from '@mantine/core';

import ReactPaginate from 'react-paginate';
import { stripBaseUrl } from '../../hooks/convertImage';
import { productType } from '../../utils/utilsInterface';
type CategoryTableProps = {
  productData: productType[] | null;
  openEditModal: (value: number) => void;
  setState: (value: any) => void;
  total?: number;
  totalPage: number;
  page: number;
  onchangePage: (selectedItem: { selected: number }) => void;
};

const statusOption = {
  1: {
    name: 'Active',
    color: '#87FF74',
  },
  2: { name: 'Inactive', color: '#FFC978' },
  3: { name: 'Stockout', color: '#FF9090' },
} as any;

const ProductTable = ({
  productData,
  openEditModal,
  setState,
  page,
  onchangePage,
  totalPage,
}: CategoryTableProps) => {
  return (
    <div>
      <div className="my-10 border border-[#B82C67] rounded-lg overflow-hidden">
        <div className=" max-h-[500px] overflow-auto thin-scroll">
          <table className="w-full ">
            <thead className="sticky top-0">
              <tr
                style={{
                  color: '#B82C67',
                  backgroundColor: '#FFE2EC',
                  height: '60px',
                  fontWeight: 600,
                }}
              >
                <td className="text-center">Image</td>
                <td>Name of product</td>
                <td>Price</td>
                <td>Sub-sub-category</td>
                <td>Sub-category</td>
                <td className="text-center w-[110px]">Status</td>
                <td className="text-center">Modify</td>
                <td className="text-center">Delete</td>
              </tr>
            </thead>
            <tbody>
              {productData && productData?.length > 0 ? (
                productData?.map((item: productType, index) => (
                  <tr
                    key={item.id}
                    style={{
                      background: index % 2 !== 0 ? '#FFE2EC80' : '',
                      height: 60,
                    }}
                  >
                    <td>
                      <img
                        src={stripBaseUrl(item?.thumbnail?.url || '')}
                        alt="image"
                        className="object-cover w-10 h-10 mx-auto"
                        loading="lazy"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item?.sub_subcategory?.name}</td>
                    <td>{item?.subcategory?.name}</td>
                    <td>
                      {item?.status && (
                        <div
                          className="border border-black rounded-md w-[100px] h-[30px] flex items-center justify-center"
                          style={{
                            background:
                              item?.status &&
                              statusOption?.[item?.status]?.color,
                          }}
                        >
                          {item?.status && statusOption?.[item?.status]?.name}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      <UnstyledButton onClick={() => openEditModal(item.id)}>
                        <img src="/pen.svg" alt="icon" />
                      </UnstyledButton>
                    </td>
                    <td className="text-center">
                      <UnstyledButton
                        onClick={function () {
                          setState((p: any) => ({
                            ...p,
                            deleteModal: true,
                            deleteID: item.id,
                          }));
                        }}
                      >
                        <img src="/delete_btn.svg" alt="icon" />
                      </UnstyledButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="font-medium text-center align-middle"
                    scope="row"
                    colSpan={8}
                  >
                    <div className="flex justify-center gap-3 py-5">
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
                      No data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          className="flex items-center justify-center gap-2 py-5 text-sm custom-pagination"
          onPageChange={onchangePage}
          forcePage={page - 1 > 0 ? page - 1 : 0}
          pageRangeDisplayed={3}
          pageCount={totalPage}
          previousLabel="Previous"
        />
      </div>
    </div>
  );
};

export default ProductTable;
