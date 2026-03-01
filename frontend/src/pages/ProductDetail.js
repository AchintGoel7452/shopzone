import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" style={{width:'3rem',height:'3rem'}}></div></div>;
  if (!product) return <div className="container py-5 text-center"><h4>Product not found</h4></div>;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const stars = Math.round(product.rating || 0);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container py-4">
      <nav className="mb-3"><ol className="breadcrumb"><li className="breadcrumb-item"><a href="/products">Products</a></li><li className="breadcrumb-item active">{product.name}</li></ol></nav>

      <div className="row g-4">
        {/* Images */}
        <div className="col-md-5">
          <div className="card shadow-sm mb-2" style={{ minHeight: 360 }}>
            {images.length > 0 ? (
              <img src={`http://localhost:8080${images[activeImg]}`} alt={product.name}
                className="card-img-top" style={{ height: 360, objectFit: 'contain', padding: 20 }} />
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: 360, background: '#f0f4ff', fontSize: '6rem' }}>🛍️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2">
              {images.map((img, i) => (
                <img key={i} src={`http://localhost:8080${img}`} alt=""
                  onClick={() => setActiveImg(i)}
                  className={`rounded cursor-pointer border ${activeImg === i ? 'border-primary border-2' : ''}`}
                  style={{ width: 72, height: 72, objectFit: 'cover', cursor: 'pointer' }} />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="col-md-7">
          <p className="text-muted small mb-1">{product.categoryName}</p>
          <h1 className="h3 fw-bold">{product.name}</h1>
          <p className="text-muted small mb-2">by <strong>{product.sellerName}</strong></p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="stars fs-5">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
            <span className="text-muted small">{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          <div className="mb-3">
            <span className="fs-2 fw-bold text-primary">${product.price?.toFixed(2)}</span>
            {discount > 0 && <>
              <span className="ms-2 text-muted text-decoration-line-through fs-5">${product.originalPrice?.toFixed(2)}</span>
              <span className="ms-2 badge bg-danger">{discount}% OFF</span>
            </>}
          </div>

          {/* Key Specs */}
          <div className="row g-2 mb-3">
            {product.brand && <div className="col-auto"><span className="badge bg-light text-dark border">Brand: {product.brand}</span></div>}
            {product.model && <div className="col-auto"><span className="badge bg-light text-dark border">Model: {product.model}</span></div>}
            {product.color && <div className="col-auto"><span className="badge bg-light text-dark border">Color: {product.color}</span></div>}
            {product.size && <div className="col-auto"><span className="badge bg-light text-dark border">Size: {product.size}</span></div>}
          </div>

          {/* Warranty & Guarantee */}
          {(product.warrantyPeriod || product.guaranteeDetails) && (
            <div className="alert alert-success p-2 mb-3">
              {product.warrantyPeriod && <div><strong>🛡️ Warranty:</strong> {product.warrantyPeriod}</div>}
              {product.guaranteeDetails && <div><strong>✅ Guarantee:</strong> {product.guaranteeDetails}</div>}
            </div>
          )}

          <div className="mb-3">
            {product.stockQuantity > 0
              ? <span className="text-success fw-semibold">✅ In Stock ({product.stockQuantity} available)</span>
              : <span className="text-danger fw-semibold">❌ Out of Stock</span>}
          </div>

          {/* Quantity & Cart */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="input-group" style={{ width: 120 }}>
              <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <input type="number" className="form-control text-center" value={qty} min={1} onChange={e => setQty(+e.target.value)} />
              <button className="btn btn-outline-secondary" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="btn btn-primary btn-lg flex-grow-1" onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}>
              🛒 Add to Cart
            </button>
          </div>

          <div className="row g-2 text-center">
            <div className="col-4"><div className="border rounded p-2 small">🚚 Free Shipping</div></div>
            <div className="col-4"><div className="border rounded p-2 small">↩️ 30-Day Returns</div></div>
            <div className="col-4"><div className="border rounded p-2 small">🔒 Secure Payment</div></div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Warranty */}
      <div className="mt-5">
        <ul className="nav nav-tabs mb-4">
          {['description','specifications','warranty','reviews'].map(tab => (
            <li key={tab} className="nav-item">
              <button className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {activeTab === 'description' && (
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Product Description</h5>
            <p style={{ whiteSpace: 'pre-line' }}>{product.description || 'No description available.'}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Technical Specifications</h5>
            <table className="table table-bordered">
              <tbody>
                {product.brand && <tr><th>Brand</th><td>{product.brand}</td></tr>}
                {product.model && <tr><th>Model</th><td>{product.model}</td></tr>}
                {product.color && <tr><th>Color</th><td>{product.color}</td></tr>}
                {product.size && <tr><th>Size</th><td>{product.size}</td></tr>}
                {product.weight && <tr><th>Weight</th><td>{product.weight}</td></tr>}
                {product.dimensions && <tr><th>Dimensions</th><td>{product.dimensions}</td></tr>}
              </tbody>
            </table>
            {product.specifications && (
              <>
                <h6 className="fw-bold mt-3">Additional Specifications</h6>
                <pre className="bg-light p-3 rounded small">{product.specifications}</pre>
              </>
            )}
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">🛡️ Warranty & Guarantee</h5>
            {product.warrantyPeriod && (
              <div className="alert alert-success">
                <h6 className="fw-bold">Warranty Period</h6>
                <p className="mb-0">{product.warrantyPeriod}</p>
              </div>
            )}
            {product.guaranteeDetails && (
              <div className="alert alert-info">
                <h6 className="fw-bold">Money-Back Guarantee</h6>
                <p className="mb-0">{product.guaranteeDetails}</p>
              </div>
            )}
            {product.warrantyTerms && (
              <div>
                <h6 className="fw-bold">Warranty Terms & Conditions</h6>
                <p style={{ whiteSpace: 'pre-line' }} className="text-muted">{product.warrantyTerms}</p>
              </div>
            )}
            {!product.warrantyPeriod && !product.guaranteeDetails && !product.warrantyTerms && (
              <p className="text-muted">No warranty information available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Customer Reviews ({product.reviewCount})</h5>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="text-center">
                <div className="display-4 fw-bold">{product.rating?.toFixed(1)}</div>
                <div className="stars fs-4">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
                <div className="text-muted small">{product.reviewCount} reviews</div>
              </div>
            </div>
            <p className="text-muted">Reviews will appear here after customers purchase and rate this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}
