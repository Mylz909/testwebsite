import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CheckoutForm from './CheckoutForm';
import { Size } from '../../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { state, dispatch } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  if (!isOpen) return null;

  const updateQuantity = (productId: string, size: Size, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { productId, size }
      });
      return;
    }

    // Get current item
    const item = state.items.find(
      i => i.product.id === productId && i.selectedSize === size
    );

    if (!item) return;

    // Check available stock
    const availableStock = item.product.stock[size];
    if (newQuantity > availableStock) {
      setStockError(`Only ${availableStock} items available in size ${size}`);
      return;
    }

    setStockError(null);
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, size, quantity: newQuantity }
    });
  };

  const removeItem = (productId: string, size: Size) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { productId, size }
    });
  };

  // Calculate total with shipping fees
  const shippingFee = 50;
  const total = state.items.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);
  const finalTotal = total + shippingFee;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2" /> Shopping Cart
          </h2>
          <button onClick={onClose} className="p-1 hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              {!showCheckout ? (
                <>
                  {stockError && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      {stockError}
                    </div>
                  )}
                  
                  {state.items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-4 py-4 border-b">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>

                        <div className="flex items-center gap-2 mt-2">
                          {item.product.discountPrice ? (
                            <>
                              <p className="text-sm font-bold text-red-400 line-through">
                                {item.product.price} EGP
                              </p>
                              <p className="text-sm font-bold">
                                {item.product.discountPrice} EGP
                              </p>
                            </>
                          ) : (
                            <p className="text-sm font-bold">{item.product.price} EGP</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.quantity - 1
                            )}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.quantity + 1
                            )}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedSize)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 text-right">
                    <p className="text-lg font-semibold">Total: {total} EGP</p>
                    <div className="mt-2 text-lg font-semibold">
                      Shipping Fee: {shippingFee} EGP
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      Final Total: {finalTotal} EGP
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-900 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              ) : (
                <CheckoutForm
                  onBack={() => setShowCheckout(false)}
                  onClose={onClose}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}