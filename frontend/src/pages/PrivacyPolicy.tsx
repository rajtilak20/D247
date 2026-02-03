import './StaticPage.css';

export default function PrivacyPolicy() {
  return (
    <div className="static-page">
      <div className="container">
        <h1>Privacy Policy</h1>
        <div className="content">
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including when you use our
            services, create an account, or communicate with us.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services,
            to communicate with you, and to monitor and analyze trends and usage.
          </p>

          <h2>Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with service
            providers who perform services on our behalf.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@deals247.com
          </p>
        </div>
      </div>
    </div>
  );
}
