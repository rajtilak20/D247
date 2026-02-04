import { useState, useEffect } from 'react';
import { getDeals } from '../services/api';
import type { Deal } from '../services/api';
import DealCard from '../components/DealCard';
import Tabs from '../components/ui/Tabs';

const categories = [
  'All', 'Electronics', 'Mobiles', 'Fashion', 'Laptops', 'Grocery', 'Home', 'Beauty'
];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Latest');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchDeals();
  }, [activeTab, activeCategory]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page: 1, limit: 20 };
      
      if (activeTab === 'Hot') {
        params.featured = true;
      } else if (activeTab === 'Popular') {
        params.sort = 'clicks';
      }
      
      if (activeCategory !== 'All') {
        params.category = activeCategory.toLowerCase();
      }

      console.log('Fetching deals with params:', params);
      const response = await getDeals(params);
      console.log('API Response:', response);
      setDeals(response.deals || []);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deals');
      // On error, try fetching without filters as fallback
      try {
        const fallbackResponse = await getDeals({ page: 1, limit: 20 });
        setDeals(fallbackResponse.deals || []);
        setError(null);
      } catch (fallbackErr) {
        console.error('Fallback fetch also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1 flex items-center gap-2">
            🔥 Today's Hottest Deals
          </h1>
          <p className="text-white/90 text-sm">
            Save up to 80% on 1000+ products from Amazon, Flipkart & More
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category}
              </button>
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

        {/* Error Message */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Deal Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500 mb-4">Try selecting a different category or check back later for new deals.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveTab('Latest');
              }}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              View All Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} layout="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
