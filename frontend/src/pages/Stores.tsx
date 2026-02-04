import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStores } from '../services/api';

interface Store {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  _count?: {
    deals: number;
  };
}

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await getStores();
        setStores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Stores</h1>
          <p className="text-gray-600">Browse deals from your favorite stores</p>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new stores.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stores.map(store => (
              <Link
                key={store.id}
                to={`/deals?store=${store.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center justify-center group"
              >
                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-white">
                      {store.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">
                  {store.name}
                </h3>
                {store._count && (
                  <p className="text-xs text-gray-500">
                    {store._count.deals} {store._count.deals === 1 ? 'deal' : 'deals'}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
