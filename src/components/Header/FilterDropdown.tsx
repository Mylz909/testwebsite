import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  isMobile?: boolean;
}

export default function FilterDropdown({ label, value, options, onChange, isMobile }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition-all duration-200 w-full
          ${isMobile 
            ? 'bg-white text-gray-800 hover:bg-gray-50' 
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
      >
        <span className="flex items-center gap-2">
          {label}: <span className="font-medium">{selectedOption?.label || 'All'}</span>
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top
          ${isOpen 
            ? 'opacity-100 visible transform scale-100' 
            : 'opacity-0 invisible transform scale-95'
          }`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className={`w-full px-4 py-3 text-left transition-colors
              ${value === option.value 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-blue-50'
              }
              ${option.value === '' ? 'border-b border-gray-100' : ''}`}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}