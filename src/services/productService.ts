import { Product, ProductWithStock } from '../types';
import { supabase } from '../lib/supabase';

// Hardcoded products without stock information
const products: Product[] = [
  {
    id: "1",
    name: "Classic Black Hoodie",
    description: "Premium cotton blend hoodie in classic black",
    price: 599,
    discountPrice: 499,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800"
    ],
    sizes: ["M", "L", "XL"],
    gender: "unisex",
    color: "black"
  }
  // Add more products here
];

export async function fetchProducts(): Promise<ProductWithStock[]> {
  try {
    // Fetch stock data from Supabase
    const { data: stockData, error } = await supabase
      .from('product_stock')
      .select('*');

    if (error) throw error;

    // Merge products with stock data
    return products.map(product => ({
      ...product,
      stock: {
        M: stockData?.find(s => s.product_id === product.id && s.size === 'M')?.quantity || 0,
        L: stockData?.find(s => s.product_id === product.id && s.size === 'L')?.quantity || 0,
        XL: stockData?.find(s => s.product_id === product.id && s.size === 'XL')?.quantity || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}