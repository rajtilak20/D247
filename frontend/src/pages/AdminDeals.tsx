import './AdminDeals.css';

export default function AdminDeals() {
  // TODO: Implement full admin deals management
  // For now, this is a placeholder

  return (
    <div className="admin-deals">
      <div className="container">
        <div className="admin-header">
          <h1>Manage Deals</h1>
          <button className="create-button">+ Create New Deal</button>
        </div>

        <div className="admin-notice">
          <h2>Admin Panel - Coming Soon</h2>
          <p>Full CRUD functionality for deals management will be implemented in the next phase.</p>
          <p>This will include:</p>
          <ul>
            <li>Create new deals</li>
            <li>Edit existing deals</li>
            <li>Delete/Archive deals</li>
            <li>Manage stores, categories, and tags</li>
            <li>View deal analytics and clicks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
