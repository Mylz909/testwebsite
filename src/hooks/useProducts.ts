import { useEffect, useState } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';
import { supabase } from '../lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load products'));
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    // Subscribe to stock changes
    const stockSubscription = supabase
      .channel('product_stock_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_stock' },
        async () => {
          // Reload products when stock changes
          const updatedProducts = await fetchProducts();
          setProducts(updatedProducts);
        }
      )
      .subscribe();

    return () => {
      stockSubscription.unsubscribe();
    };
  }, []);

  return { products, loading, error };
}