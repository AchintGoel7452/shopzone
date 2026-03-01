import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');

  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    searchProducts(keyword, selectedCategory || null, page)
      .then(r => {
        setProducts(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, selectedCategory, page]);

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold">🗂️ Categories</div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(''); setPage(0); }}>
                  All Products
                </button>
                {categories.map(c => (
                  <button key={c.id}
                    className={`list-group-item list-group-item-action ${String(selectedCategory) === String(c.id) ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory(c.id); setPage(0); }}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              {keyword ? `Results for "${keyword}"` : 'All Products'}
            </h5>
            <span className="text-muted small">{products.length} products found</span>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h4>No products found</h4>
              <p className="text-muted">Try a different search or category.</p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map(p => (
                <div key={p.id} className="col-sm-6 col-lg-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
