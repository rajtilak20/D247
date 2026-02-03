import './StaticPage.css';

export default function Terms() {
  return (
    <div className="static-page">
      <div className="container">
        <h1>Terms and Conditions</h1>
        <div className="content">
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
          
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Deals247, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>

          <h2>Use of Service</h2>
          <p>
            Our service provides information about deals and offers from various retailers.
            We are not responsible for the accuracy of prices or availability of products.
          </p>

          <h2>Affiliate Disclosure</h2>
          <p>
            Deals247 participates in affiliate marketing programs. When you click on certain
            links and make a purchase, we may receive a commission at no extra cost to you.
          </p>

          <h2>User Conduct</h2>
          <p>
            You agree not to misuse our services or help anyone else to do so. You may not
            attempt to gain unauthorized access to our systems or interfere with our services.
          </p>

          <h2>Disclaimer</h2>
          <p>
            We provide our services "as is" without any warranties. We do not guarantee that
            deals shown on our platform are accurate or currently available.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of our service after changes
            constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
