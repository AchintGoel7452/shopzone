import axios from 'axios';

const API_BASE = 'https://shopzone-production.up.railway.app/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const registerSeller = (data) => api.post('/auth/register/seller', data);
export const login = (data) => api.post('/auth/login', data);

// Products
export const getProducts = (page = 0, size = 12, sortBy = 'createdAt') =>
  api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}`);

export const getProduct = (id) => api.get(`/products/${id}`);

export const searchProducts = (keyword, categoryId, page = 0) =>
  api.get(`/products/search?keyword=${keyword || ''}&categoryId=${categoryId || ''}&page=${page}`);

// Seller
export const createProduct = (formData) =>
  api.post('/seller/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateProduct = (id, formData) =>
  api.put(`/seller/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getSellerProducts = () => api.get('/seller/products');
export const deleteProduct = (id) => api.delete(`/seller/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);

export default api;
