import { Tabs, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import CategoryTable from '../components/category/CategoryTable';
import HeaderCategory from '../components/category/HeaderCategory';
import ModalContent from '../components/category/ModalContent';
import { apiRoute } from '../utils/apiRoute';
import { GET } from '../utils/fetch';
import { CategoryType, itemSelectType } from '../utils/utilsInterface';

const listOption = [
  {
    value: 'category',
    label: 'Category',
  },
  {
    value: 'subcategory',
    label: 'Sub-category',
  },
  {
    value: 'sub-subcategory',
    label: 'Sub-sub-category',
  },
];

export type ModalType = 'ADD' | 'EDIT' | 'DELETE';

const CategoryPage = () => {
  const [categorySelected, setCategorySelected] = useState<string[] | []>([]);
  const [subCategorySelected, setSubCategorySelected] = useState<string[] | []>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listCategory, setListCategory] = useState<itemSelectType[] | []>([]);
  const [listSubCategory, setListSubCategory] = useState<itemSelectType[] | []>(
    [],
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [optionSelected, setOptionSelected] = useState<string | any>(
    listOption[0]?.value,
  );
  const [categoryData, setCategoryData] = useState<CategoryType[] | []>([]);
  const [typeModal, setTypeModal] = useState<ModalType | null>('ADD');
  const [itemSelected, setItemSelected] = useState<any | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  const getListData = async (
    value?: string,
    option?: {
      category: string[];
      subcategory: string[];
      search: string;
    },
    refreshSearch?: boolean,
  ) => {
    setIsLoading(true);
    try {
      const url =
        value === 'sub-subcategory'
          ? apiRoute.list_sub_subcategory
          : value === 'subcategory'
          ? apiRoute.list_subcategory
          : apiRoute.list_category;

      const queryParams = {
        page_size: 1000,
        ...((categorySelected || option?.category) && {
          category_ids: option?.category ? option?.category : categorySelected,
        }),
        ...((subCategorySelected || option?.subcategory) && {
          subcategory_ids: option?.subcategory
            ? option?.subcategory
            : subCategorySelected,
        }),
        ...((searchValue || option?.search) && {
          search: refreshSearch
            ? ''
            : option?.search
            ? option?.search
            : searchValue,
        }),
      };

      const queryString = new URLSearchParams(queryParams as any).toString();

      const res = await GET(url + '?' + queryString);
      if (res.status === 200) {
        setCategoryData(res.data?.results);
        if (value !== 'sub-subcategory' && value !== 'subcategory') {
          const newData = res.data?.results?.map((item: any) => ({
            label: item?.name,
            value: item?.id,
            category_id: item?.category?.id,
          }));

          if (newData?.length > 0) {
            setListCategory(newData);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getListOptions = async (category?: string[]) => {
    try {
      const res = await GET(
        apiRoute.list_subcategory +
          '?page_size=1000' +
          `&category_ids=${category && category?.length > 0 ? category : ''}`,
      );
      const newData = res.data?.results?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
        category_id: item?.category?.id,
      }));

      if (newData?.length > 0) {
        setListSubCategory(newData);
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const handleChange = (type: 'category' | 'sub', value: string[]) => {
    if (type === 'category') {
      if (value !== categorySelected) {
        if (optionSelected === 'sub-subcategory') {
          value.length > 0 ? getListOptions(value) : setListSubCategory([]);
        }
        setCategorySelected(value);
        getListData(optionSelected, {
          category: value,
          subcategory:
            optionSelected === 'subcategory' ? [] : subCategorySelected,
          search: searchValue,
        });
      }
      return;
    }

    if (value !== subCategorySelected) {
      setSubCategorySelected(value);
      getListData('sub-subcategory', {
        category: categorySelected,
        subcategory: value,
        search: searchValue,
      });
    }
  };

  const handleSearch = () => {
    getListData(optionSelected, {
      category: categorySelected,
      subcategory: subCategorySelected,
      search: searchValue,
    });
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      getListData(
        optionSelected,
        {
          category: categorySelected,
          subcategory: subCategorySelected,
          search: '',
        },
        true,
      );
    }
  };

  const handleOpenModal = (type: ModalType, value?: any) => {
    setTypeModal(type);
    open();
    if (value) setItemSelected(value);
  };

  const handleCloseModal = () => {
    close();
    if (itemSelected) setItemSelected(null);
  };

  const onSuccess = () => {
    setSearchValue('');
    setCategorySelected([]);
    setSubCategorySelected([]);
    getListData(
      optionSelected,
      {
        category: [],
        subcategory: [],
        search: '',
      },
      true,
    );
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className="w-[85%] mx-auto">
      <Tabs
        value={optionSelected}
        onTabChange={(tab: string) => {
          setOptionSelected(tab);
          setCategorySelected([]);
          setSubCategorySelected([]);
          setListSubCategory([]);
          setSearchValue('');
          getListData(
            tab,
            {
              category: [],
              subcategory: [],
              search: '',
            },
            true,
          );
        }}
        w={600}
      >
        <Tabs.List grow>
          {listOption?.map((item: itemSelectType) => (
            <Tabs.Tab key={item.value} value={item.value}>
              <Title
                c={'pink'}
                order={4}
                size={16}
                style={{
                  color:
                    item?.value && optionSelected === item?.value
                      ? '#B72C68'
                      : '#909090',
                }}
              >
                {item.label}
              </Title>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <HeaderCategory
        optionSelected={optionSelected}
        categorySelected={categorySelected}
        subCategorySelected={subCategorySelected}
        handleChange={handleChange}
        listSubCategory={listSubCategory as any}
        listCategory={listCategory as any}
        onSearch={onSearchChange}
        handleSearch={handleSearch}
        searchValue={searchValue}
        handleOpenModal={handleOpenModal}
      />

      {isLoading ? (
        <div
          style={{
            paddingTop: 150,
            textAlign: 'center',
          }}
        >
          <span className="loader" />
        </div>
      ) : (
        <CategoryTable
          categoryData={categoryData}
          optionSelected={optionSelected}
          handleOpenModal={handleOpenModal}
        />
      )}
      <ModalContent
        handleCloseModal={handleCloseModal}
        opened={opened}
        typeModal={typeModal}
        optionSelected={optionSelected}
        listCategory={listCategory}
        onSuccess={onSuccess}
        itemSelected={itemSelected}
      />
    </div>
  );
};

export default CategoryPage;
