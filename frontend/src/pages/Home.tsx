import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeals, Deal } from '../services/api';
import './Home.css';

export default function Home() {
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [latestDeals, setLatestDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // In real implementation, we'd have separate endpoints or filters
        // For now, we'll fetch deals and filter featured ones
        const response = await getDeals({ limit: 20 });
        const featured = response.deals.filter(deal => deal.isFeatured).slice(0, 4);
        const latest = response.deals.slice(0, 8);
        
        setFeaturedDeals(featured);
        setLatestDeals(latest);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <div className="container">
          <div className="loading">Loading deals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <h1>Welcome to Deals247</h1>
          <p>Discover the best deals and save money every day!</p>
          <Link to="/deals" className="cta-button">Browse All Deals</Link>
        </section>

        {featuredDeals.length > 0 && (
          <section className="deals-section">
            <h2>Featured Deals</h2>
            <div className="deals-grid">
              {featuredDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}

        <section className="deals-section">
          <h2>Latest Deals</h2>
          <div className="deals-grid">
            {latestDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/deals">View All Deals →</Link>
          </div>
        </section>
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
      </div>
    </Link>
  );
}
