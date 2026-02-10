import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ totalOrders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/orders/admin/dashboard').then((r) => setMetrics(r.data));
      api.get('/orders').then((r) => setOrders(r.data));
    }
  }, [user]);

  if (user?.role !== 'admin') return <div className="px-4 py-10">Admin access restricted.</div>;

  return (
    <div className="space-y-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-5">Total Orders: {metrics.totalOrders}</div>
        <div className="glass rounded-xl p-5">Revenue: €{metrics.revenue.toFixed(2)}</div>
      </div>
      <div className="glass rounded-xl p-5">
        <h2 className="mb-3 font-serif text-2xl">Order Management</h2>
        <ul className="space-y-2">{orders.map((o) => <li key={o._id} className="rounded border border-white/10 p-3">{o._id.slice(-8)} · {o.status} · €{o.total}</li>)}</ul>
      </div>
    </div>
  );
}
