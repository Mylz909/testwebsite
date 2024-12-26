import { CartItem } from '../context/CartContext';

// Phone number validation
export function isValidPhoneNumber(phone: string): boolean {
  // Egyptian phone number format
  const phoneRegex = /^01[0125][0-9]{8}$/;
  return phoneRegex.test(phone);
}

// Order validation
export function validateOrder(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: CartItem[]
): string | null {
  // Name validation
  if (customerName.length < 3) {
    return 'Please enter a valid name (at least 3 characters)';
  }

  // Phone validation
  if (!isValidPhoneNumber(customerPhone)) {
    return 'Please enter a valid Egyptian phone number';
  }

  // Address validation
  if (customerAddress.length < 10) {
    return 'Please enter a detailed address';
  }

  // Order items validation
  if (items.length === 0) {
    return 'Cart is empty';
  }

  // Maximum order amount (optional)
  const totalAmount = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (totalAmount > 10000) {
    return 'Order amount exceeds maximum limit';
  }

  return null;
}