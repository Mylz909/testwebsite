import React, { useState } from 'react';
import { Menu, X, Ruler, RotateCcw } from 'lucide-react';
import { FilterOptions } from '../../types';
import FilterDropdown from './FilterDropdown';

interface MobileMenuProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  onSizeChartClick: () => void;
}

export default function MobileMenu({ filters, setFilters, onSizeChartClick }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const resetFilters = () => {
    setFilters({
      gender: '',
      size: '',
      color: '',
      searchQuery: ''
    });
  };

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-lg text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <FilterDropdown
            label="Gender"
            value={filters.gender}
            options={[
              { value: '', label: 'All Genders' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'unisex', label: 'Unisex' }
            ]}
            onChange={(value) => setFilters({ ...filters, gender: value })}
            isMobile
          />

          <FilterDropdown
            label="Size"
            value={filters.size}
            options={[
              { value: '', label: 'All Sizes' },
              { value: 'M', label: 'M' },
              { value: 'L', label: 'L' },
              { value: 'XL', label: 'XL' }
            ]}
            onChange={(value) => setFilters({ ...filters, size: value })}
            isMobile
          />

          <FilterDropdown
            label="Color"
            value={filters.color}
            options={[
              { value: '', label: 'All Colors' },
              { value: 'black', label: 'Black' },
              { value: 'offwhite', label: 'Off White' },
              { value: 'beige', label: 'Beige' }
            ]}
            onChange={(value) => setFilters({ ...filters, color: value })}
            isMobile
          />

          <button
            onClick={() => {
              resetFilters();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center justify-between bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <span>Reset Filters</span>
            <RotateCcw size={20} />
          </button>

          <button
            onClick={() => {
              onSizeChartClick();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 rounded-lg transition-colors"
          >
            <span>Size Chart</span>
            <Ruler size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}