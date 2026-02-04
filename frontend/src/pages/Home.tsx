import { useState, useEffect } from 'react';
import { getDeals } from '../services/api';
import type { Deal } from '../services/api';
import DealCard from '../components/DealCard';
import Chip from '../components/ui/Chip';
import Tabs from '../components/ui/Tabs';

const categories = [
  'All', 'Electronics', 'Mobiles', 'Fashion', 'Laptops', 'Grocery', 'Home', 'Beauty'
];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Latest');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchDeals();
  }, [activeTab, activeCategory]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 12 };
      
      if (activeTab === 'Hot') {
        params.featured = true;
      } else if (activeTab === 'Popular') {
        params.sort = 'popular';
      }
      
      if (activeCategory !== 'All') {
        params.category = activeCategory.toLowerCase();
      }

      const response = await getDeals(params);
      setDeals(response.deals);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Today's Best Deals from Amazon, Flipkart & More
          </h1>
          <p className="text-blue-100">
            Save big on electronics, fashion, groceries and more!
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                variant="category"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={['Latest', 'Hot', 'Popular']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Deal Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
            <p className="mt-1 text-sm text-gray-500">Try changing the category or tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} layout="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
