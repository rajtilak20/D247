import { useState } from 'react';
import Button from './ui/Button';

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
  onClear: () => void;
}

export interface FilterValues {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  stores?: string[];
  categories?: string[];
}

export default function FilterPanel({ onFilterChange, onClear }: FilterPanelProps) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const stores = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Croma'];
  const categories = ['Electronics', 'Mobiles', 'Fashion', 'Laptops', 'Grocery', 'Home', 'Beauty'];
  const discountRanges = [20, 40, 60, 80];

  const handleApplyFilters = () => {
    const filters: FilterValues = {};
    
    if (search) filters.search = search;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (selectedDiscount) filters.minDiscount = selectedDiscount;
    if (selectedStores.length > 0) filters.stores = selectedStores;
    if (selectedCategories.length > 0) filters.categories = selectedCategories;

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedDiscount(null);
    setSelectedStores([]);
    setSelectedCategories([]);
    onClear();
  };

  const toggleStore = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search deals..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Discount
        </label>
        <div className="space-y-2">
          {discountRanges.map((discount) => (
            <label key={discount} className="flex items-center">
              <input
                type="radio"
                name="discount"
                checked={selectedDiscount === discount}
                onChange={() => setSelectedDiscount(discount)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">≥ {discount}% OFF</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stores */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stores
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {stores.map((store) => (
            <label key={store} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => toggleStore(store)}
                className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{store}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <Button variant="primary" fullWidth onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" fullWidth onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>
    </div>
  );
}
