import { useMemo } from 'react';
import { Product, FilterOptions, Size, VALID_SIZES, isValidSize } from '../types';

export function useFilteredProducts(products: Product[], filters: FilterOptions) {
  return useMemo(() => {
    if (!products) return [];
    
    const searchLower = filters.searchQuery.toLowerCase();
    
    return products.filter(product => {
      if (searchLower) {
        const isSizeSearch = VALID_SIZES.map(s => s.toLowerCase()).includes(searchLower);
        
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description.toLowerCase().includes(searchLower);
        const matchesGender = product.gender.toLowerCase().includes(searchLower);
        const matchesColor = product.color.toLowerCase().includes(searchLower);
        
        const matchesSize = isSizeSearch 
          ? product.sizes.some(size => {
              const searchSize = searchLower.toUpperCase() as Size;
              return size === searchSize && product.stock[searchSize] > 0;
            })
          : product.sizes.some(size => size.toLowerCase().includes(searchLower));

        if (!(matchesName || matchesDescription || matchesGender || matchesColor || matchesSize)) {
          return false;
        }
      }

      const matchesGender = !filters.gender || product.gender === filters.gender;
      const matchesSize = !filters.size || (
        isValidSize(filters.size) && 
        product.sizes.includes(filters.size) && 
        product.stock[filters.size] > 0
      );
      const matchesColor = !filters.color || product.color === filters.color;

      return (!filters.gender || matchesGender) && 
             (!filters.size || matchesSize) && 
             (!filters.color || matchesColor);
    });
  }, [filters, products]);
}