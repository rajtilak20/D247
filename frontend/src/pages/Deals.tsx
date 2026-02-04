import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeals, getCategories, getStores } from '../services/api';
import type { Deal, Category, Store } from '../services/api';
import './Deals.css';

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, storesData] = await Promise.all([
          getCategories(),
          getStores(),
        ]);
        setCategories(categoriesData);
        setStores(storesData);
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          limit: 12,
          q: searchQuery || undefined,
          category: selectedCategory || undefined,
          store: selectedStore || undefined,
        };

        const response = await getDeals(params);
        setDeals(response.deals);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [currentPage, searchQuery, selectedCategory, selectedStore, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="deals-page">
      <div className="container">
        <h1>All Deals</h1>

        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>

          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStore}
              onChange={(e) => {
                setSelectedStore(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.slug}>
                  {store.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="discount-high">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading deals...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : deals.length === 0 ? (
          <div className="no-results">No deals found. Try adjusting your filters.</div>
        ) : (
          <>
            <div className="results-info">
              Showing {deals.length} of {total} deals
            </div>

            <div className="deals-grid">
              {deals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link to={`/deals/${deal.slug}`} className="deal-card">
      {deal.productImageUrl && (
        <img src={deal.productImageUrl} alt={deal.title} />
      )}
      <div className="deal-content">
        <h3>{deal.title}</h3>
        <p className="deal-description">{deal.shortDescription}</p>
        <div className="deal-prices">
          <span className="original-price">{deal.currency} {deal.originalPrice}</span>
          <span className="deal-price">{deal.currency} {deal.dealPrice}</span>
          <span className="discount">{deal.discountPercent}% OFF</span>
        </div>
        {deal.couponCode && (
          <div className="coupon-code">
            Code: <strong>{deal.couponCode}</strong>
          </div>
        )}
      </div>
    </Link>
  );
}
