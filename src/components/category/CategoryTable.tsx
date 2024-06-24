import { UnstyledButton } from '@mantine/core';
import { ModalType } from '../../pages/CategoryPage';
import { CategoryType } from '../../utils/utilsInterface';

type CategoryTableProps = {
  handleOpenModal: (type: ModalType, value: any | null) => void;
  total?: number;
  categoryData: CategoryType[];
  optionSelected: string | any;
};

const CategoryTable = ({
  categoryData,
  handleOpenModal,
  optionSelected,
}: CategoryTableProps) => {
  return (
    <div className="mt-10 border border-[#B82C67] rounded-lg overflow-hidden">
      <div className=" max-h-[500px] overflow-auto thin-scroll">
        <table className="w-full ">
          <thead className="sticky top-0">
            <tr
              style={{
                textAlign: 'center',
                color: '#B82C67',
                backgroundColor: '#FFE2EC',
                height: '60px',
                fontWeight: 600,
              }}
            >
              <td style={{ width: 100 }}>Order</td>
              {optionSelected === 'category' && <td>Image</td>}
              {optionSelected === 'sub-subcategory' && (
                <td className="text-left">Sub-sub-category</td>
              )}
              {optionSelected !== 'category' && (
                <td className="text-left">Sub-category</td>
              )}
              <td className="text-left">Category</td>
              <td>Status</td>
              <td>Update</td>
              <td>Delete</td>
            </tr>
          </thead>

          <tbody>
            {categoryData?.length > 0 ? (
              categoryData?.map((item, index) => (
                <tr
                  style={{
                    background: index % 2 !== 0 ? '#FFE2EC80' : '',
                  }}
                  className="h-[60px] "
                  key={item.id}
                >
                  <td
                    style={{
                      textAlign: 'center',
                      width: 100,
                    }}
                  >
                    {index + 1}
                  </td>

                  {optionSelected === 'category' && (
                    <td>
                      <img
                        src={item.image?.url}
                        className="block mx-auto text-center"
                        width={40}
                        alt=""
                      />
                    </td>
                  )}
                  {optionSelected === 'sub-subcategory' && (
                    <td>Sub-sub-category</td>
                  )}
                  <td>{item.name}</td>

                  {optionSelected !== 'category' && (
                    <td>{item?.category?.name}</td>
                  )}
                  <td className="text-center">123</td>
                  <td className="text-center">
                    <UnstyledButton
                      onClick={() => handleOpenModal('EDIT', item || null)}
                    >
                      <img src="/pen.svg" alt="icon" />
                    </UnstyledButton>
                  </td>
                  <td className="text-center">
                    <UnstyledButton
                      onClick={() => handleOpenModal('DELETE', item || null)}
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
  );
};

export default CategoryTable;
