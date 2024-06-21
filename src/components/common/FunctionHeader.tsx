import { Select, Space, TextInput, Title } from '@mantine/core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CustomSelectMultiple } from '../CustomSelectMultiple';

interface FuntionHeaderProps {
  onCreateNew: () => void;
  title: string;
  onSelectSubCategories: (v: string[]) => void;
  onSelectSubSubCategories?: (v: string[]) => void;
  onSelectStatus: (v: string) => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  subCategory: { value: string; label: string }[];
  subSubCategory: { value: string; label: string }[];
  subCategorySelected?: string[];
  subSubCategorySelected?: string[];
  handleSearch: () => void;
  searchValue: string;
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
          <Select
            data={[
              { value: 'all', label: 'All' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Stockout', label: 'Stockout' },
            ]}
            onChange={props.onSelectStatus}
            rightSection={<img alt="icon" src="/down_arrow.svg" />}
            variant="unstyled"
            label="Status"
            placeholder="Select an element"
            bg={'#FFE7EF'}
            w={'200px'}
            h={'3.625rem'}
            sx={{
              borderRadius: '5px',
              marginRight: '20px',
              whiteSpace: 'normal',
              '.mantine-bkyer9': {
                fontWeight: 500,
                height: 20,
                paddingLeft: 16,
                minHeight: 0,
              },
              '.mantine-1fzet7j': {
                fontSize: 12,
                color: '#858585',
                paddingLeft: 12,
                paddingTop: 8,
              },
              '.mantine-hclwis': {
                height: 14,
              },
            }}
          />
        </div>

        <div>
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
