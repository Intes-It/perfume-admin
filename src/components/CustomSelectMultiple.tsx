import {
  Checkbox,
  Group,
  MultiSelect,
  MultiSelectValueProps,
  Text,
} from '@mantine/core';
import { forwardRef } from 'react';
import '../styles/custom-select.css';

type CustomSelectMultiple = {
  data: { value: string; label: string }[];
  value: string[];
  label?: string;
  onChange: (v: string[]) => void;
  className?: string;
};

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
  selected: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, className, ...others }: ItemProps, ref) => {
    return (
      <div
        ref={ref}
        className="custom-select"
        {...others}
        style={{
          cursor: 'pointer',
          fontSize: 14,
          background: others.selected ? '#fff4f9 ' : '',
        }}
      >
        <Group
          noWrap
          style={{
            padding: '12px 16px',
          }}
        >
          <Checkbox checked={others?.selected} readOnly color="pink" />
          <Text>{label}</Text>
        </Group>
      </div>
    );
  },
);

export const CustomSelectMultiple = ({
  data,
  value,
  label,
  onChange,
  className,
}: CustomSelectMultiple) => {
  function Value({
    label,
    onRemove,
    classNames,
    ...others
  }: MultiSelectValueProps & { value: string; index: number }) {
    if (others?.index + 1 === value?.length)
      return (
        <div
          style={{
            fontWeight: 500,
          }}
        >
          {value?.length} {value?.length > 1 ? 'elements' : 'element'} selected
        </div>
      );
  }
  return (
    <MultiSelect
      itemComponent={SelectItem}
      valueComponent={Value}
      value={value}
      variant="unstyled"
      disableSelectedItemFiltering
      rightSection={<img alt="icon" src="/down_arrow.svg" />}
      data={data}
      label={label}
      className={className}
      placeholder="Select an element"
      maxDropdownHeight={400}
      onChange={(value) => onChange(value)}
      w={'320px'}
      bg={'#FFE7EF'}
      h={'58px'}
      sx={{
        borderRadius: '5px',
        whiteSpace: 'normal',
        '.mantine-bkyer9': {
          height: 20,
          minHeight: 0,
          fontWeight: 500,
          paddingLeft: 16,
        },
        '.mantine-1fzet7j': {
          fontSize: 12,
          color: '#858585',
          paddingLeft: 16,
          paddingTop: 8,
        },
        '.mantine-1n7zxp': {
          marginLeft: 16,
          paddingBottom: 6,
        },
        '.mantine-Input-rightSection': {
          top: -20,
        },
      }}
    />
  );
};
