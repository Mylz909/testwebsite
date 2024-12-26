import React, { useState } from 'react';
import { X, ArrowRight, Truck, RotateCcw, Banknote } from 'lucide-react';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreInfoModal({ isOpen, onClose }: StoreInfoModalProps) {
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {!showReturnPolicy ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Store Info</h2>
            
            <div className="space-y-2"> {/*it was 6*/}
              <div className="flex items-start gap-4">
                <Truck className="flex-shrink-0 w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">Shipping Information</h3>
                  <p className="text-gray-600">Shipping fees calculated with order confirmation </p>
                  <p className="text-gray-600">Estimated delivery within 1-6 working days</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                {/* <RotateCcw className="flex-shrink-0 w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">Returns</h3>
                  <p className="text-gray-600">Returns allowed within 14 days</p>
                  <button
                    onClick={() => setShowReturnPolicy(true)}
                    className="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                  >
                    View full policy <ArrowRight size={16} />
                  </button>
                </div> */}
              </div>

              <div className="flex items-start gap-4">
                <Banknote className="flex-shrink-0 w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">Payment</h3>
                  <p className="text-gray-600">Cash on delivery available</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <button
              onClick={() => setShowReturnPolicy(false)}
              className="mb-4 text-blue-500 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <ArrowRight size={16} className="rotate-180" /> Back to store info
            </button>

            <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
            
            <div className="space-y-6 text-gray-700">
              <p>Items can be returned within 14 days of receipt of shipment in most cases.</p>
              
              <div>
                <h3 className="font-semibold mb-2">Returns will be processed only if:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The product is not damaged</li>
                  <li>The product is not different from what was shipped to you</li>
                  <li>The product is returned in the same condition as when it was received (brand new, not used, and with our packaging)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Return Process:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Contact us through WhatsApp within 14 days of receiving your order</li>
                  <li>Provide order details and reason for return</li>
                  <li>Ship the item back to us in its original condition</li>
                  <li>Refund will be processed after inspection (EGP 60 return shipping fee applies)</li>
                </ol>
              </div>

              <p className="text-sm bg-gray-50 p-4 rounded-lg">
                Note: In case of returning the product due to an issue in it (like a manufacturing defect), 
                the return shipping fee will be waived and a full refund or replacement will be provided.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}