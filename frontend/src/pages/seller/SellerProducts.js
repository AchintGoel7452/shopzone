import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerProducts, deleteProduct } from '../../services/api';
import { toast } from 'react-toastify';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    getSellerProducts().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from listings?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product removed');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to remove product');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-2">
          <div className="seller-sidebar rounded p-0">
            <div className="p-3 border-bottom border-secondary"><h6 className="text-warning fw-bold mb-0">🏪 Seller Panel</h6></div>
            <nav className="nav flex-column">
              <Link className="nav-link" to="/seller">📊 Dashboard</Link>
              <Link className="nav-link active" to="/seller/products">📦 My Products</Link>
              <Link className="nav-link" to="/seller/products/add">➕ Add Product</Link>
            </nav>
          </div>
        </div>
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">📦 My Products</h3>
            <Link to="/seller/products/add" className="btn btn-primary">➕ Add New Product</Link>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>📭</div>
              <h4>No products listed yet</h4>
              <Link to="/seller/products/add" className="btn btn-primary mt-2">Add Your First Product</Link>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th><th>Image</th><th>Product</th><th>Category</th>
                      <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>
                          {p.images && p.images.length > 0
                            ? <img src={`http://localhost:8080${p.images[0]}`} alt="" style={{ width:50, height:50, objectFit:'cover', borderRadius:4 }} />
                            : <div style={{ width:50, height:50, background:'#f0f4ff', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' }}>🛍️</div>}
                        </td>
                        <td>
                          <div className="fw-semibold">{p.name}</div>
                          <small className="text-muted">{p.brand} {p.model}</small>
                        </td>
                        <td><span className="badge bg-light text-dark border">{p.categoryName}</span></td>
                        <td>
                          <div className="fw-bold text-primary">${p.price?.toFixed(2)}</div>
                          {p.originalPrice > p.price && <small className="text-muted text-decoration-line-through">${p.originalPrice?.toFixed(2)}</small>}
                        </td>
                        <td><span className={`badge ${p.stockQuantity < 5 ? 'bg-danger' : p.stockQuantity < 20 ? 'bg-warning text-dark' : 'bg-success'}`}>{p.stockQuantity}</span></td>
                        <td><span className={`badge ${p.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>{p.status}</span></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link to={`/products/${p.id}`} className="btn btn-outline-info" title="View">👁️</Link>
                            <Link to={`/seller/products/edit/${p.id}`} className="btn btn-outline-primary" title="Edit">✏️</Link>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(p.id, p.name)} title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
