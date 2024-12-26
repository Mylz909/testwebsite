import React from 'react';
import { X } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const sizeChartImageUrl = '/images/size-chart.png'; // Path to your size chart image

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close size chart"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Size Chart</h2>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={sizeChartImageUrl} 
              alt="Hoodie Size Chart" 
              className="w-full h-auto max-w-lg mx-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Size+Chart+Coming+Soon';
              }}
            />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Note: This size chart applies to all our hoodies. For specific measurements, please refer to the chart above.
          </p>
        </div>
      </div>
    </div>
  );
}
