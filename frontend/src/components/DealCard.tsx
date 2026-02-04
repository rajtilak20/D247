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

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return dealDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (layout === 'list') {
    return (
      <Link to={`/deals/${deal.slug}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
            {deal.productImageUrl ? (
              <img
                src={deal.productImageUrl}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Store */}
            {deal.store && (
              <div className="flex items-center gap-2 mb-1">
                {deal.store.logoUrl && (
                  <img src={deal.store.logoUrl} alt={deal.store.name} className="w-4 h-4 object-contain" />
                )}
                <span className="text-xs text-gray-500">{deal.store.name}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
              {deal.title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(deal.dealPrice)}</span>
              <span className="text-xs text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
              <Badge variant="discount">{deal.discountPercent}% OFF</Badge>
            </div>

            {/* Tags & Time */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {deal.dealTags?.[0] && (
                <Badge variant="hot">{deal.dealTags[0].tag.name}</Badge>
              )}
              <span>{getTimeAgo(deal.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout
  return (
    <Link to={`/deals/${deal.slug}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-40 bg-gray-100">
        {deal.productImageUrl ? (
          <img
            src={deal.productImageUrl}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {deal.isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge variant="featured">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="discount">{deal.discountPercent}% OFF</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Store */}
        {deal.store && (
          <div className="flex items-center gap-2 mb-2">
            {deal.store.logoUrl && (
              <img src={deal.store.logoUrl} alt={deal.store.name} className="w-5 h-5 object-contain" />
            )}
            <span className="text-xs text-gray-500 font-medium">{deal.store.name}</span>
            <span className="text-xs text-gray-400">• {getTimeAgo(deal.createdAt)}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {deal.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900">{formatPrice(deal.dealPrice)}</span>
          <span className="text-sm text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
        </div>

        {/* Tags */}
        {deal.dealTags && deal.dealTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.dealTags.slice(0, 2).map((dt) => (
              <Badge key={dt.tag.slug} variant="hot">{dt.tag.name}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
