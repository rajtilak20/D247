import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDealBySlug, recordDealClick, getDeals } from '../services/api';
import type { Deal } from '../services/api';
import Breadcrumb from '../components/ui/Breadcrumb';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DealCard from '../components/DealCard';

export default function DealDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getDealBySlug(slug);
        setDeal(data);

        // Fetch related deals from same category or store
        if (data.category?.slug) {
          const related = await getDeals({ category: data.category.slug, limit: 4 });
          // Filter out current deal
          setRelatedDeals(related.deals.filter(d => d.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deal');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [slug]);

  const handleGetDeal = async () => {
    if (!deal) return;

    try {
      const response = await recordDealClick(deal.id);
      window.open(response.affiliateUrl || deal.affiliateUrl, '_blank');
    } catch (err) {
      console.error('Failed to record click:', err);
      window.open(deal.affiliateUrl, '_blank');
    }
  };

  const handleCopyCoupon = () => {
    if (deal?.couponCode) {
      navigator.clipboard.writeText(deal.couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">{error || 'Deal not found'}</div>
          <Button onClick={() => navigate('/deals')} variant="primary">
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = deal.expiresAt && new Date(deal.expiresAt) < new Date();
  const savingsAmount = deal.originalPrice - deal.dealPrice;
  
  const breadcrumbItems = [
    { label: 'Deals', href: '/deals' },
    ...(deal.category ? [{ label: deal.category.name, href: `/deals?category=${deal.category.slug}` }] : []),
    { label: deal.title, href: '' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left: Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
              {deal.productImageUrl ? (
                <img 
                  src={deal.productImageUrl} 
                  alt={deal.title} 
                  className="max-w-full max-h-96 object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Right: Deal Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{deal.title}</h1>

              {/* Store and Category */}
              <div className="flex flex-wrap gap-2 mb-4">
                {deal.store && (
                  <Link to={`/deals?store=${deal.store.slug}`}>
                    <Badge variant="default">{deal.store.name}</Badge>
                  </Link>
                )}
                {deal.category && (
                  <Link to={`/deals?category=${deal.category.slug}`}>
                    <Badge variant="default">{deal.category.name}</Badge>
                  </Link>
                )}
                {deal.isHot && <Badge variant="hot">HOT</Badge>}
                {deal.isFeatured && <Badge variant="featured">Featured</Badge>}
              </div>

              {/* Price Section */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{deal.dealPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{deal.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="discount">{deal.discountPercent}% OFF</Badge>
                </div>
                <p className="text-green-600 font-semibold">
                  You save ₹{savingsAmount.toLocaleString()}
                </p>
              </div>

              {/* Coupon Code */}
              {deal.couponCode && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Use Coupon Code:</p>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-white border border-dashed border-orange-400 rounded px-4 py-2 text-lg font-mono font-bold text-orange-600 text-center">
                      {deal.couponCode}
                    </code>
                    <Button 
                      onClick={handleCopyCoupon}
                      variant="outline"
                      size="md"
                    >
                      {copiedCoupon ? '✓ Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {isExpired ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600 font-semibold mb-4">
                  This deal has expired
                </div>
              ) : (
                <Button 
                  onClick={handleGetDeal}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mb-4"
                >
                  Go to Deal →
                </Button>
              )}

              {/* Expiry Info */}
              {deal.expiresAt && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  {isExpired ? 'Expired on' : 'Valid until'}: {new Date(deal.expiresAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}

              {/* Description */}
              {deal.shortDescription && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Deal Details</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{deal.shortDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Long Description */}
          {deal.longDescription && (
            <div className="border-t p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Offer Details</h3>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: deal.longDescription }} 
              />
            </div>
          )}
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Deals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedDeals.map(relatedDeal => (
                <DealCard key={relatedDeal.id} deal={relatedDeal} layout="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
