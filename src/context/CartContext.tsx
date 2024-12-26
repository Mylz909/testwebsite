import React, { createContext, useContext, useReducer } from 'react';
import { Product, Size } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: Size;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: Size } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: Size } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: Size; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // If the item already exists in the cart, update the quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        const newTotal = updatedItems.reduce((total, item) => {
          const price = item.product.discountPrice || item.product.price;
          return total + price * item.quantity;
        }, 0);

        return {
          ...state,
          items: updatedItems,
          total: newTotal
        };
      }

      // If the item does not exist, add it to the cart
      const price = product.discountPrice || product.price;
      return {
        ...state,
        items: [...state.items, { product, quantity: 1, selectedSize: size }],
        total: state.total + price
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId, size } = action.payload;
      const itemToRemove = state.items.find(
        item => item.product.id === productId && item.selectedSize === size
      );

      if (!itemToRemove) return state;

      const updatedItems = state.items.filter(
        item => !(item.product.id === productId && item.selectedSize === size)
      );
      const newTotal = updatedItems.reduce((total, item) => {
        const price = item.product.discountPrice || item.product.price;
        return total + price * item.quantity;
      }, 0);

      return {
        ...state,
        items: updatedItems,
        total: newTotal
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload;
      const updatedItems = state.items.map(item => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      });

      const newTotal = updatedItems.reduce((total, item) => {
        const price = item.product.discountPrice || item.product.price;
        return total + price * item.quantity;
      }, 0);

      return {
        ...state,
        items: updatedItems,
        total: newTotal
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
