// components/support/SearchBar.jsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
  const [localValue, setLocalValue] = useState(value || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onSearch('');
  };

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder || "Tìm kiếm..."}
          className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;