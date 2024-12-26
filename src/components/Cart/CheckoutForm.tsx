import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import { validateOrder } from '../../services/validationService';
import toast from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";

interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
}

export default function CheckoutForm({ onBack, onClose }: CheckoutFormProps) {
  const { state, dispatch: cartDispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    const validationError = validateOrder(
      formData.name,
      formData.phone,
      formData.address,
      state.items
    );

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        additionalInfo: formData.additionalInfo,
        items: state.items,
        totalAmount: state.total
      });

      cartDispatch({ type: 'CLEAR_CART' });
      onClose();
      toast.success('Order placed successfully! We will contact you shortly.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
      recaptchaRef.current?.reset();
      setIsVerified(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setIsVerified(!!token);
  };

  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-4 flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} className="mr-2" />
        Back to Cart
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="01xxxxxxxxx"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">Enter a valid Egyptian phone number</p>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">Additional Information</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center my-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lc8yaYqAAAAAG6jyWKKtBDhZZKcN_LIUqnkOF-E" // Replace with your actual site key
            onChange={onCaptchaChange}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isVerified}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            isSubmitting || !isVerified
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
}