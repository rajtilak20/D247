import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/deals?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Deals247</span>
            <span className="text-xl group-hover:scale-110 transition-transform">🔥</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm text-gray-700 hover:text-orange-500 font-medium transition-colors">
              🆕 New
            </Link>
            <Link to="/deals?featured=true" className="text-sm text-gray-700 hover:text-red-500 font-medium transition-colors">
              🔥 Hot
            </Link>
            <Link to="/deals?sort=popular" className="text-sm text-gray-700 hover:text-orange-500 font-medium transition-colors">
              ⭐ Popular
            </Link>
            <Link to="/stores" className="text-sm text-gray-700 hover:text-orange-500 font-medium transition-colors">
              🏪 Stores
            </Link>
            <Link to="/deals" className="text-sm text-gray-700 hover:text-orange-500 font-medium transition-colors">
              📂 Categories
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                className="w-48 lg:w-64 px-4 py-1.5 pr-10 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            <Link to="/admin/login" className="text-gray-600 hover:text-orange-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                autoFocus
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                New Deals
              </Link>
              <Link
                to="/deals?featured=true"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Hot Deals
              </Link>
              <Link
                to="/deals?sort=popular"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Popular
              </Link>
              <Link
                to="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Stores
              </Link>
              <Link
                to="/deals"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Categories
              </Link>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-blue-600"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Admin Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

