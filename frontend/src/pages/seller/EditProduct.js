import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProduct, updateProduct, getCategories } from '../../services/api';
import { toast } from 'react-toastify';

export default function EditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getProduct(id), getCategories()])
      .then(([pRes, cRes]) => {
        const p = pRes.data;
        setForm({
          name: p.name || '', description: p.description || '',
          price: p.price || '', originalPrice: p.originalPrice || '',
          stockQuantity: p.stockQuantity || '', brand: p.brand || '',
          model: p.model || '', color: p.color || '', size: p.size || '',
          weight: p.weight || '', dimensions: p.dimensions || '',
          specifications: p.specifications || '', warrantyPeriod: p.warrantyPeriod || '',
          guaranteeDetails: p.guaranteeDetails || '', warrantyTerms: p.warrantyTerms || '',
          categoryId: p.categoryId || ''
        });
        setCategories(cRes.data);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImages = e => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stockQuantity: parseInt(form.stockQuantity),
        categoryId: parseInt(form.categoryId)
      }));
      images.forEach(img => formData.append('images', img));
      await updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

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
            <h3 className="fw-bold">✏️ Edit Product</h3>
            <Link to="/seller/products" className="btn btn-outline-secondary">← Back</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3">📝 Basic Information</h5>
                  <div className="mb-3"><label className="form-label fw-semibold">Product Name *</label><input className="form-control" name="name" value={form.name} onChange={handleChange} required /></div>
                  <div className="mb-3"><label className="form-label fw-semibold">Description</label><textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} /></div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Stock *</label><input type="number" className="form-control" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Price ($) *</label><input type="number" step="0.01" className="form-control" name="price" value={form.price} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Original Price ($)</label><input type="number" step="0.01" className="form-control" name="originalPrice" value={form.originalPrice} onChange={handleChange} /></div>
                  </div>
                </div>

                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3">⚙️ Specifications</h5>
                  <div className="row g-3">
                    {['brand','model','color','size','weight','dimensions'].map(field => (
                      <div key={field} className="col-md-6">
                        <label className="form-label fw-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input className="form-control" name={field} value={form[field]} onChange={handleChange} />
                      </div>
                    ))}
                    <div className="col-12"><label className="form-label fw-semibold">Additional Specs</label><textarea className="form-control" name="specifications" value={form.specifications} onChange={handleChange} rows={3} /></div>
                  </div>
                </div>

                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3">🛡️ Warranty & Guarantee</h5>
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label fw-semibold">Warranty Period</label><input className="form-control" name="warrantyPeriod" value={form.warrantyPeriod} onChange={handleChange} /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Guarantee Details</label><input className="form-control" name="guaranteeDetails" value={form.guaranteeDetails} onChange={handleChange} /></div>
                    <div className="col-12"><label className="form-label fw-semibold">Warranty Terms</label><textarea className="form-control" name="warrantyTerms" value={form.warrantyTerms} onChange={handleChange} rows={3} /></div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3">📸 Update Images</h5>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={handleImages} />
                  <small className="text-muted d-block mt-1">Upload new images to replace existing ones</small>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mb-5">
              <button type="submit" className="btn btn-success btn-lg px-5" disabled={saving}>
                {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                💾 Save Changes
              </button>
              <Link to="/seller/products" className="btn btn-outline-secondary btn-lg">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
