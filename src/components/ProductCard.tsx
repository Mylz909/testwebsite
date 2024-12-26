import React, { useState } from 'react';
import ImageSlider from './ImageSlider';
import { Product, Size } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const availableStock = product.stock[selectedSize];
    
    try {
      if (availableStock <= 0) {
        setStockError(`Size ${selectedSize} is out of stock`);
        return;
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: { product, size: selectedSize }
      });
      
      setSelectedSize(null);
      setStockError(null);
      toast.success('Added to cart');
    } catch (error) {
      if (error instanceof Error) {
        setStockError(error.message);
      } else {
        setStockError('An error occurred while adding to cart');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <ImageSlider images={product.images} productName={product.name} />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-1">{product.description}</p>
        
        <div className="flex items-center gap-2 mt-2">
          {product.discountPrice ? (
            <>
              <p className="text-sm font-bold text-red-400 line-through">
                {product.price} EGP
              </p>
              <p className="text-sm font-bold">
                {product.discountPrice} EGP
              </p>
              <p className="text-xs font-bold text-green-500">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </p>
            </>
          ) : (
            <p className="text-sm font-bold">{product.price} EGP</p>
          )}
        </div>

        {stockError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {stockError}
          </div>
        )}

        <div className="mt-3">
          <p className="text-sm font-medium">Available Sizes:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setStockError(null);
                }}
                disabled={product.stock[size] === 0}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  selectedSize === size
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-900 text-white border-blue-600'
                    : product.stock[size] === 0
                    ? 'text-red-500 border-gray-200 cursor-not-allowed'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >
                {product.stock[size] === 0 ? `${size} - Sold Out` : size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`mt-4 w-full py-2 px-4 rounded-lg transition-all duration-200 ${
            selectedSize
              ? 'bg-gradient-to-r from-blue-600 to-indigo-900 text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedSize ? 'Add to Cart' : 'Select a Size'}
        </button>
      </div>
    </div>
  );
}