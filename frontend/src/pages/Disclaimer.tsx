import './StaticPage.css';

export default function Disclaimer() {
  return (
    <div className="static-page">
      <div className="container">
        <h1>Disclaimer</h1>
        <div className="content">
          <h2>General Disclaimer</h2>
          <p>
            The information provided by Deals247 is for general informational purposes only.
            All information on the site is provided in good faith, however we make no
            representation or warranty of any kind regarding the accuracy, adequacy, validity,
            reliability, availability or completeness of any information on the site.
          </p>

          <h2>Affiliate Disclaimer</h2>
          <p>
            Deals247 is a participant in various affiliate programs designed to provide a means
            for sites to earn advertising fees by advertising and linking to retailer websites.
            As an affiliate, we may earn a commission from qualifying purchases made through
            links on our website.
          </p>

          <h2>Price and Availability</h2>
          <p>
            Prices and availability of products are subject to change without notice. We make
            every effort to provide accurate information, but errors may occur. Please verify
            prices and availability with the retailer before making a purchase.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We have no control over the
            content and practices of these sites and cannot accept responsibility or liability
            for their respective privacy policies.
          </p>

          <h2>No Responsibility</h2>
          <p>
            We are not responsible for any purchases made through affiliate links on our site.
            All transactions are between you and the merchant.
          </p>
        </div>
      </div>
    </div>
  );
}
