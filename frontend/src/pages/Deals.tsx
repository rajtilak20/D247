import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDeals, getCategories, getStores } from '../services/api';
import type { Deal, Category, Store } from '../services/api';
import DealCard from '../components/DealCard';
import FilterPanel, { FilterValues } from '../components/FilterPanel';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';

export default function Deals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDeals();
  }, [searchParams, activeTab, currentPage]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 12,
        q: searchParams.get('q') || undefined,
        category: searchParams.get('category') || undefined,
        store: searchParams.get('store') || undefined,
        minDiscount: searchParams.get('minDiscount') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
      };

      if (activeTab === 'Hot') {
        params.featured = true;
      } else if (activeTab === 'Popular') {
        params.sort = 'popular';
      }

      const response = await getDeals(params);
      setDeals(response.deals);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterValues) => {
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set('q', filters.search);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.minDiscount) newParams.set('minDiscount', filters.minDiscount.toString());
    if (filters.stores?.length) newParams.set('store', filters.stores[0].toLowerCase());
    if (filters.categories?.length) newParams.set('category', filters.categories[0].toLowerCase());
    
    setSearchParams(newParams);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    const store = searchParams.get('store');
    const category = searchParams.get('category');
    
    if (store) return `${store.charAt(0).toUpperCase() + store.slice(1)} Deals`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Deals`;
    return 'All Deals';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600">
            Showing {deals.length} of {total} deals
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Panel */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button & View Toggle */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </Button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <div className="mb-4 lg:hidden">
                <FilterPanel
                  onFilterChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
              <Tabs
                tabs={['Latest', 'Hot', 'Popular']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Deal List/Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : deals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
                <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'
                  : 'space-y-4'
                }>
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} layout={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
