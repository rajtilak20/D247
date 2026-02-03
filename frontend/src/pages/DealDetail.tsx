import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDealBySlug, recordDealClick, Deal } from '../services/api';
import './DealDetail.css';

export default function DealDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeal = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getDealBySlug(slug);
        setDeal(data);
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
      // Redirect to affiliate URL
      window.open(response.affiliateUrl || deal.affiliateUrl, '_blank');
    } catch (err) {
      console.error('Failed to record click:', err);
      // Still redirect even if tracking fails
      window.open(deal.affiliateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="deal-detail">
        <div className="container">
          <div className="loading">Loading deal...</div>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="deal-detail">
        <div className="container">
          <div className="error">{error || 'Deal not found'}</div>
          <button onClick={() => navigate('/deals')} className="back-button">
            ← Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const isExpired = deal.expiresAt && new Date(deal.expiresAt) < new Date();

  return (
    <div className="deal-detail">
      <div className="container">
        <button onClick={() => navigate('/deals')} className="back-button">
          ← Back to Deals
        </button>

        <div className="deal-content-wrapper">
          <div className="deal-image-section">
            {deal.productImageUrl ? (
              <img src={deal.productImageUrl} alt={deal.title} className="deal-image" />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          <div className="deal-info-section">
            <h1>{deal.title}</h1>

            {deal.store && (
              <div className="store-info">
                <span>Store: <strong>{deal.store.name}</strong></span>
              </div>
            )}

            <div className="price-section">
              <div className="prices">
                <span className="original-price">{deal.currency} {deal.originalPrice}</span>
                <span className="deal-price">{deal.currency} {deal.dealPrice}</span>
              </div>
              <span className="discount-badge">{deal.discountPercent}% OFF</span>
            </div>

            {deal.couponCode && (
              <div className="coupon-section">
                <label>Coupon Code:</label>
                <div className="coupon-code">{deal.couponCode}</div>
              </div>
            )}

            <div className="description">
              <h3>Description</h3>
              <p>{deal.shortDescription}</p>
              {deal.longDescription && (
                <div dangerouslySetInnerHTML={{ __html: deal.longDescription }} />
              )}
            </div>

            {isExpired ? (
              <div className="expired-notice">This deal has expired</div>
            ) : (
              <button onClick={handleGetDeal} className="get-deal-button">
                Get This Deal →
              </button>
            )}

            {deal.expiresAt && (
              <div className="expiry-info">
                {isExpired ? 'Expired on' : 'Expires on'}: {new Date(deal.expiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
