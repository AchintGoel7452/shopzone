import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerProducts } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getSellerProducts().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
  const totalStock = products.reduce((s, p) => s + (p.stockQuantity || 0), 0);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2">
          <div className="seller-sidebar rounded p-0">
            <div className="p-3 border-bottom border-secondary">
              <h6 className="text-warning fw-bold mb-0">🏪 Seller Panel</h6>
              <small className="text-muted">{user?.fullName}</small>
            </div>
            <nav className="nav flex-column">
              <Link className="nav-link active" to="/seller">📊 Dashboard</Link>
              <Link className="nav-link" to="/seller/products">📦 My Products</Link>
              <Link className="nav-link" to="/seller/products/add">➕ Add Product</Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Welcome back, {user?.fullName?.split(' ')[0]}!</h3>
            <Link to="/seller/products/add" className="btn btn-primary">➕ Add New Product</Link>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Products', value: products.length, icon: '📦', color: 'primary' },
              { label: 'Active Listings', value: activeProducts, icon: '✅', color: 'success' },
              { label: 'Total Stock', value: totalStock, icon: '🏭', color: 'info' },
              { label: 'Pending Orders', value: 0, icon: '🛒', color: 'warning' },
            ].map((s, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className={`card shadow-sm border-0 border-start border-4 border-${s.color}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-0">{s.label}</p>
                        <h3 className="fw-bold mb-0">{s.value}</h3>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>{s.icon}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Products */}
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between">
              <strong>Recent Products</strong>
              <Link to="/seller/products" className="btn btn-outline-primary btn-sm">View All</Link>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No products yet.</p>
                  <Link to="/seller/products/add" className="btn btn-primary">Add Your First Product</Link>
                </div>
              ) : (
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td className="fw-semibold">{p.name}</td>
                        <td>${p.price?.toFixed(2)}</td>
                        <td><span className={`badge ${p.stockQuantity < 5 ? 'bg-danger' : 'bg-success'}`}>{p.stockQuantity}</span></td>
                        <td><span className={`badge ${p.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>{p.status}</span></td>
                        <td>
                          <Link to={`/seller/products/edit/${p.id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
