import React, { useState } from 'react';
import Header from './components/Header/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { FilterOptions, Size, isValidSize, VALID_SIZES } from './types';
import { useProducts } from './hooks/useProducts';
import { useFilteredProducts } from './hooks/useFilteredProducts';

export default function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    gender: '',
    size: '',
    color: '',
    searchQuery: ''
  });

  const { products, loading, error } = useProducts();
  const filteredProducts = useFilteredProducts(products, filters);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">
      Error loading products: {error.message}
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header filters={filters} setFilters={setFilters} />
      
      <main className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}