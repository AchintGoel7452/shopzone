import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(0, 8, 'createdAt'), getCategories()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.content || []);
        setCategories(cRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Shop Everything You Love
              </h1>
              <p className="lead mb-4 text-light opacity-75">
                Millions of products from verified sellers. Fast shipping, easy returns, and guaranteed satisfaction.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/products" className="btn btn-warning btn-lg px-5">
                  Shop Now →
                </Link>
                <Link to="/register/seller" className="btn btn-outline-light btn-lg px-4">
                  Sell on ShopZone
                </Link>
              </div>
              <div className="mt-4 d-flex justify-content-center gap-4 text-light">
                <span>✅ Free Shipping</span>
                <span>🔒 Secure Payments</span>
                <span>↩️ Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="section-subtitle text-center">Explore our wide range of categories</p>
          <div className="row g-3 justify-content-center">
            {categories.slice(0, 8).map(cat => (
              <div key={cat.id} className="col-6 col-md-3 col-lg-2">
                <Link to={`/products?categoryId=${cat.id}`} className="text-decoration-none">
                  <div className="card text-center p-3 h-100 border-0 shadow-sm category-card"
                    style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <div style={{ fontSize: '2rem' }}>{cat.icon || '📦'}</div>
                    <p className="small fw-semibold mt-1 mb-0 text-dark">{cat.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-muted">Handpicked products just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary">View All →</Link>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No products yet. <Link to="/register/seller">Become a seller!</Link></p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map(p => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sell Banner */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h2 className="fw-bold">Start Selling on ShopZone Today</h2>
              <p className="text-muted mb-0">
                Join thousands of sellers. List your products, set your prices, and reach millions of customers.
              </p>
            </div>
            <div className="col-md-5 text-md-end mt-3 mt-md-0">
              <Link to="/register/seller" className="btn btn-warning btn-lg px-5">
                Open Your Store →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-4 bg-white border-top">
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $50' },
              { icon: '🔒', title: 'Secure Payment', sub: 'SSL encrypted transactions' },
              { icon: '↩️', title: 'Easy Returns', sub: '30-day hassle-free returns' },
              { icon: '🎧', title: '24/7 Support', sub: 'Dedicated customer service' },
            ].map((b, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ fontSize: '2rem' }}>{b.icon}</div>
                <p className="fw-semibold mb-0">{b.title}</p>
                <p className="text-muted small">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
