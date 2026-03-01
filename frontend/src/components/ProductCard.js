import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  const firstImage = product.images && product.images.length > 0
    ? `http://localhost:8080${product.images[0]}`
    : null;

  const stars = Math.round(product.rating || 0);

  return (
    <div className="product-card h-100">
      <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
        {firstImage ? (
          <img src={firstImage} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder">🛍️</div>
        )}

        <div className="p-3">
          {discount > 0 && <span className="badge-discount mb-1 d-inline-block">{discount}% OFF</span>}
          <p className="text-muted small mb-1">{product.categoryName || 'General'}</p>
          <h6 className="fw-semibold mb-1" style={{ minHeight: '40px' }}>
            {product.name?.length > 45 ? product.name.slice(0, 45) + '...' : product.name}
          </h6>

          <div className="d-flex align-items-center gap-1 mb-2">
            <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
            <span className="text-muted small">({product.reviewCount || 0})</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fw-bold text-primary">${product.price?.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-muted small text-decoration-line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          {product.warrantyPeriod && (
            <p className="text-success small mb-1">✅ {product.warrantyPeriod} Warranty</p>
          )}
          {product.stockQuantity < 10 && product.stockQuantity > 0 && (
            <p className="text-warning small mb-1">⚠️ Only {product.stockQuantity} left!</p>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button className="btn btn-primary w-100 btn-sm" onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}>
          {product.stockQuantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}
