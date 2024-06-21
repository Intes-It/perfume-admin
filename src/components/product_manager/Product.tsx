import { Tabs } from '@mantine/core';

import useData from '../../hooks/useData';
import ProductContent from './ProductContent';
const Product = () => {
  const { categories, loading } = useData('/api/category/list_tree');

  if (loading) return null;
  return (
    <Tabs defaultValue={categories?.[0]?.id?.toString()}>
      <ProductContent listCategory={categories} />
    </Tabs>
  );
};

export default Product;
