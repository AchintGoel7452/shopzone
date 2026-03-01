import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../services/api';

const statusColors = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'danger', REFUNDED: 'secondary'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📦 My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>📭</div>
          <h4>No orders yet</h4>
          <p className="text-muted">Start shopping to see your orders here!</p>
          <a href="/products" className="btn btn-primary">Shop Now</a>
        </div>
      ) : orders.map(order => (
        <div key={order.id} className="card mb-3 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <strong>{order.orderNumber}</strong>
              <span className="text-muted ms-3 small">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>{order.status}</span>
          </div>
          <div className="card-body">
            {order.items?.map(item => (
              <div key={item.id} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                <span>{item.product?.name} × {item.quantity}</span>
                <span className="fw-semibold">${item.totalPrice?.toFixed(2)}</span>
              </div>
            ))}
            <div className="d-flex justify-content-between fw-bold mt-2">
              <span>Total</span>
              <span className="text-primary">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
