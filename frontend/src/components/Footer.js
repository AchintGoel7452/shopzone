import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">🛒 ShopZone</h5>
            <p className="text-muted small">Your trusted marketplace for quality products from verified sellers worldwide.</p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled small text-muted">
              <li><Link to="/products" className="text-muted text-decoration-none">All Products</Link></li>
              <li><Link to="/products?categoryId=1" className="text-muted text-decoration-none">Electronics</Link></li>
              <li><Link to="/products?categoryId=2" className="text-muted text-decoration-none">Fashion</Link></li>
              <li><Link to="/products?categoryId=3" className="text-muted text-decoration-none">Home & Kitchen</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled small text-muted">
              <li><Link to="/login" className="text-muted text-decoration-none">Sign In</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Create Account</Link></li>
              <li><Link to="/register/seller" className="text-muted text-decoration-none">Sell on ShopZone</Link></li>
              <li><Link to="/orders" className="text-muted text-decoration-none">Track Orders</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled small text-muted">
              <li>📧 support@shopzone.com</li>
              <li>📞 1-800-SHOPZONE</li>
              <li className="mt-2">
                <span className="badge bg-success me-1">Free Shipping</span>
                <span className="badge bg-info">Easy Returns</span>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary mt-4"/>
        <div className="row align-items-center">
          <div className="col-md-6 small text-muted">© 2026 ShopZone. All rights reserved.</div>
          <div className="col-md-6 text-end small text-muted">
            Secure payments by 🔒 SSL | Powered by Spring Boot & React
          </div>
        </div>
      </div>
    </footer>
  );
}
