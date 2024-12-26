import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterOptions } from '../../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-full sm:max-w-2xl w-full">
      <input
        type="text"
        placeholder="Search by name, gender, size, or color..."
        className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-transparent focus:outline-none focus:border-white/30 bg-white/10 text-white placeholder-white/70"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-white/70" size={20} />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}