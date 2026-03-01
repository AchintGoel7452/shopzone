import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct, getCategories } from '../../services/api';
import { toast } from 'react-toastify';

const initialForm = {
  name: '', description: '', price: '', originalPrice: '',
  stockQuantity: '', brand: '', model: '', color: '', size: '',
  weight: '', dimensions: '', specifications: '',
  warrantyPeriod: '', guaranteeDetails: '', warrantyTerms: '', categoryId: ''
};

export default function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(console.error);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) { toast.error('Please select a category'); return; }
    setLoading(true);
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

      await createProduct(formData);
      toast.success('Product listed successfully!');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
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
              <Link className="nav-link" to="/seller/products">📦 My Products</Link>
              <Link className="nav-link active" to="/seller/products/add">➕ Add Product</Link>
            </nav>
          </div>
        </div>
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">➕ Add New Product</h3>
            <Link to="/seller/products" className="btn btn-outline-secondary">← Back to Products</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Basic Info */}
              <div className="col-lg-8">
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">📝 Basic Information</h5>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Product Name *</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. iPhone 15 Pro Max 256GB" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe your product in detail..." />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Stock Quantity *</label>
                      <input type="number" className="form-control" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required min={0} />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">💰 Pricing</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Selling Price ($) *</label>
                      <input type="number" step="0.01" className="form-control" name="price" value={form.price} onChange={handleChange} required min={0} placeholder="0.00" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Original / MRP Price ($)</label>
                      <input type="number" step="0.01" className="form-control" name="originalPrice" value={form.originalPrice} onChange={handleChange} min={0} placeholder="0.00" />
                      <small className="text-muted">Used to show discount percentage</small>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">⚙️ Product Specifications</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Brand</label>
                      <input className="form-control" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Apple, Samsung" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Model</label>
                      <input className="form-control" name="model" value={form.model} onChange={handleChange} placeholder="e.g. A2650" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Color</label>
                      <input className="form-control" name="color" value={form.color} onChange={handleChange} placeholder="e.g. Midnight Black" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Size / Variant</label>
                      <input className="form-control" name="size" value={form.size} onChange={handleChange} placeholder="e.g. XL, 256GB" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Weight</label>
                      <input className="form-control" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 1.2 kg" />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">Dimensions</label>
                      <input className="form-control" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g. 160 × 77 × 8mm" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Additional Specifications</label>
                      <textarea className="form-control" name="specifications" value={form.specifications} onChange={handleChange} rows={4} placeholder="Processor: A17 Pro&#10;RAM: 8GB&#10;Display: 6.7&quot; Super Retina XDR&#10;Battery: 4422 mAh" />
                    </div>
                  </div>
                </div>

                {/* Warranty & Guarantee */}
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">🛡️ Warranty & Guarantee</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Warranty Period</label>
                      <input className="form-control" name="warrantyPeriod" value={form.warrantyPeriod} onChange={handleChange} placeholder="e.g. 1 Year Manufacturer Warranty" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Guarantee / Return Policy</label>
                      <input className="form-control" name="guaranteeDetails" value={form.guaranteeDetails} onChange={handleChange} placeholder="e.g. 30-day money-back guarantee" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Warranty Terms & Conditions</label>
                      <textarea className="form-control" name="warrantyTerms" value={form.warrantyTerms} onChange={handleChange} rows={4} placeholder="Describe what the warranty covers, excludes, and how customers can claim it..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-lg-4">
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">📸 Product Images</h5>
                  <div className="border border-dashed rounded p-3 text-center mb-3" style={{ cursor: 'pointer' }}>
                    <input type="file" className="d-none" id="imageUpload" multiple accept="image/*" onChange={handleImages} />
                    <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: '3rem' }}>📁</div>
                      <p className="fw-semibold mb-1">Click to upload images</p>
                      <small className="text-muted">PNG, JPG, WEBP. Max 10MB each.</small>
                    </label>
                  </div>
                  {previews.length > 0 && (
                    <div className="row g-2">
                      {previews.map((p, i) => (
                        <div key={i} className="col-6">
                          <img src={p} alt="" className="img-fluid rounded" style={{ height: 100, width: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card border-warning shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-bold text-warning">💡 Listing Tips</h6>
                    <ul className="small text-muted ps-3">
                      <li>Use clear, high-resolution images</li>
                      <li>Add at least 3-5 product photos</li>
                      <li>Include dimensions & weight for shipping</li>
                      <li>Detailed descriptions rank better</li>
                      <li>Always mention warranty for electronics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-2 mb-5">
              <button type="submit" className="btn btn-primary btn-lg px-5" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                🚀 Publish Product
              </button>
              <Link to="/seller/products" className="btn btn-outline-secondary btn-lg">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
