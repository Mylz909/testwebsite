import React, { useState } from 'react';
import { Ruler, RotateCcw } from 'lucide-react';
import { FilterOptions } from '../../types';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import MobileMenu from './MobileMenu';
import SizeChartModal from '../SizeChartModal';
import CartIcon from '../Cart/CartIcon';
import CartModal from '../Cart/CartModal';

interface HeaderProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

export default function Header({ filters, setFilters }: HeaderProps) {
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const resetFilters = () => {
    setFilters({
      gender: '',
      size: '',
      color: '',
      searchQuery: ''
    });
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-950 via-blue-400 to-blue-950 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative w-20 h-35 sm:w-25 sm:h-30">
                <img 
                  src="/images/Logo.png" 
                  alt="Journey Logo" 
                  className="w-full h-full rounded-full"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white"></h1>
            </div>

            <SearchBar
              value={filters.searchQuery}
              onChange={(value) => setFilters({ ...filters, searchQuery: value })}
            />

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Ruler size={20} />
                <span>Size Chart</span>
              </button>

              <CartIcon onClick={() => setIsCartOpen(true)} />
            </div>

            <MobileMenu 
              filters={filters} 
              setFilters={setFilters}
              onSizeChartClick={() => setIsSizeChartOpen(true)}
            />
          </div>

          <div className="hidden sm:flex mt-4 gap-4 justify-center pr-20">
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
            />
            <button
              onClick={resetFilters}
              className="pl-2 pr-2 py-1 flex items-center justify-between bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <span>Reset Filters</span>
              <RotateCcw className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </header>

      <SizeChartModal 
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}