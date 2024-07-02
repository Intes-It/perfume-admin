import { Space, TextInput, Title } from '@mantine/core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { listStatus } from '../../utils/mockData';
import { CustomSelectMultiple } from '../CustomSelectMultiple';

interface FuntionHeaderProps {
  onCreateNew: () => void;
  title: string;
  onSelectSubCategories: (v: string[]) => void;
  onSelectSubSubCategories?: (v: string[]) => void;
  onSelectStatus: (v: string[]) => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  subCategory: { value: string; label: string }[];
  subSubCategory: { value: string; label: string }[];
  subCategorySelected?: string[];
  subSubCategorySelected?: string[];
  handleSearch: () => void;
  searchValue: string;
  statusValue: string[] | [];
}
const FunctionHeader = (props: FuntionHeaderProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      <Space h="md" />
      <Title c="pink" order={3} mb={4}>
        {props.title}
      </Title>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="gap-10 "
      >
        <div style={{ display: 'flex', gap: 20 }}>
          {currentPath !== '/voucher_manager' && (
            <>
              <CustomSelectMultiple
                data={props.subCategory}
                label="Sub-category"
                onChange={props.onSelectSubCategories}
                value={props?.subCategorySelected as string[]}
              />
              {props.onSelectSubSubCategories && (
                <CustomSelectMultiple
                  data={props.subSubCategory}
                  label="Sub-sub-category"
                  onChange={props.onSelectSubSubCategories}
                  value={props?.subSubCategorySelected as string[]}
                />
              )}
            </>
          )}
          <CustomSelectMultiple
            data={listStatus as any}
            onChange={props.onSelectStatus}
            label="Status"
            value={props.statusValue}
            className="w-[200px]"
          />
        </div>

        <div className="flex-1 xl:max-w-[327px]">
          <span style={{ color: '#B82C67', marginBottom: '4px', fontSize: 12 }}>
            Search
          </span>

          <TextInput
            rightSection={
              <img
                src="/search.svg"
                alt="icon"
                style={{ zIndex: 100, cursor: 'pointer' }}
                onClick={props.handleSearch}
              />
            }
            variant="unstyled"
            className="w-full xl:w-full"
            sx={{
              border: '1px solid #B82C67',
              padding: '0 5px',
              borderRadius: '5px',
              width: '347px',
            }}
            height={32}
            onKeyDown={(e) => {
              if (e.key === 'Enter') props.handleSearch();
            }}
            value={props.searchValue}
            onChange={props.onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionHeader;
