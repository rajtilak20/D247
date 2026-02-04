import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import type { Deal } from '../services/api';

interface DealCardProps {
  deal: Deal;
  layout?: 'grid' | 'list';
}

export default function DealCard({ deal, layout = 'grid' }: DealCardProps) {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const dealDate = new Date(date);
    const diffMs = now.getTime() - dealDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '🔥 Just now';
    if (diffHours < 6) return `⚡ ${diffHours}h ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return dealDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getExpiryInfo = () => {
    if (!deal.expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(deal.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return { text: 'Expired', color: 'text-red-600', urgent: true };
    if (diffHours < 6) return { text: `⏰ ${diffHours}h left`, color: 'text-red-600', urgent: true };
    if (diffHours < 24) return { text: `${diffHours}h left`, color: 'text-orange-600', urgent: true };
    if (diffDays < 3) return { text: `${diffDays}d left`, color: 'text-orange-500', urgent: false };
    return null;
  };

  const expiryInfo = getExpiryInfo();

  if (layout === 'list') {
    return (
      <Link to={`/deals/${deal.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-200">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {deal.productImageUrl ? (
              <img
                src={deal.productImageUrl}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Discount badge */}
            <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
              {deal.discountPercent}%
            </div>
            {/* Urgency badge */}
            {expiryInfo && expiryInfo.urgent && (
              <div className={`absolute bottom-1 left-1 ${expiryInfo.color} bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md`}>
                {expiryInfo.text}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Store */}
            {deal.store && (
              <div className="flex items-center gap-2 mb-1">
                {deal.store.logoUrl && (
                  <img src={deal.store.logoUrl} alt={deal.store.name} className="w-5 h-5 object-contain" />
                )}
                <span className="text-xs text-gray-600 font-medium">{deal.store.name}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
              {deal.title}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(deal.dealPrice)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
            </div>

            {/* Savings */}
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold text-sm">
                💰 Save {formatPrice(deal.originalPrice - deal.dealPrice)}
              </span>
              <span className="text-gray-500 text-xs">{getTimeAgo(deal.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout
  return (
    <Link to={`/deals/${deal.slug}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200 overflow-hidden transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative w-full h-52 bg-gradient-to-br from-gray-50 to-gray-100">
        {deal.productImageUrl ? (
          <img
            src={deal.productImageUrl}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Discount badge - top right */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
          {deal.discountPercent}% OFF
        </div>
        
        {/* Urgency indicator */}
        {expiryInfo && expiryInfo.urgent && (
          <div className={`absolute bottom-2 right-2 ${expiryInfo.color} bg-white px-3 py-1 rounded-full font-bold text-xs shadow-md animate-pulse`}>
            {expiryInfo.text}
          </div>
        )}
        
        {/* Store logo - top left */}
        {deal.store?.logoUrl && (
          <div className="absolute top-2 left-2 bg-white p-1.5 rounded-lg shadow-md">
            <img src={deal.store.logoUrl} alt={deal.store.name} className="w-6 h-6 object-contain" />
          </div>
        )}
        
        {/* Featured badge */}
        {deal.isFeatured && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="featured">⭐ Featured</Badge>
          </div>
        )}
      </div>
{getTimeAgo(deal.createdAt)}</span>
          </div>
        )}

        {/* Expiry warning */}
        {expiryInfo && !expiryInfo.urgent && (
          <div className={`text-xs ${expiryInfo.color} font-medium mb-2`}>
            {expiryInfo.text}
      {/* Content */}
      <div className="p-4">
        {/* Store name & time */}
        {deal.store && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-semibold">{deal.store.name}</span>
            <span className="text-xs text-gray-500">⏰ {getTimeAgo(deal.createdAt)}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
          {deal.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(deal.dealPrice)}</span>
          <span className="text-sm text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
        </div>

        {/* Savings highlight */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-green-700 font-bold text-sm">
            💰 Save {formatPrice(deal.originalPrice - deal.dealPrice)}
          </span>
          {deal.dealTags?.[0] && (
            <Badge variant="hot">{deal.dealTags[0].tag.name}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
