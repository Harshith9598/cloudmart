import { useState } from 'react';
import { Link } from '@/components/Link';
import { useAuth } from '@/context/AuthContext';
import { mockProducts, mockSellers, mockOrders, mockUsers } from '@/services/mock-data';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import type { OrderStatus, Product } from '@/types';
import { Users, Store, Package, DollarSign, ShoppingBag, TrendingUp, CheckCircle, XCircle, BadgeCheck, Eye } from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'users' | 'sellers' | 'products' | 'orders'>('overview');

  if (!user?.roles.includes('ADMIN')) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
        <p className="mt-2 text-gray-500">You need admin privileges to view this page.</p>
        <Link to="/" className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">Back to Home</Link>
      </div>
    );
  }

  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = mockOrders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;

  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'bg-sky-50 text-sky-600' },
    { label: 'Sellers', value: mockSellers.length, icon: Store, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Products', value: mockProducts.length, icon: Package, color: 'bg-amber-50 text-amber-600' },
    { label: 'Orders', value: mockOrders.length, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-rose-50 text-rose-600' },
    { label: 'Pending Orders', value: pendingOrders, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage the CloudMart marketplace</p>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-gray-200">
          {(['overview', 'users', 'sellers', 'products', 'orders'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors whitespace-nowrap',
                tab === t ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', s.color)}>
                      <s.icon size={22} />
                    </div>
                    <div className="mt-3 text-xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                  <div className="mt-4 space-y-3">
                    {mockOrders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                        <div>
                          <div className="font-medium text-gray-900">{o.orderNumber}</div>
                          <div className="text-xs text-gray-500">{formatDate(o.createdAt)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(o.total)}</div>
                          <span className="text-xs text-gray-500">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                  <div className="mt-4 space-y-3">
                    {[...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0">
                        {p.images[0] && <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.reviewCount} reviews · {p.rating}★</div>
                        </div>
                        <div className="text-sm font-semibold">{formatPrice(p.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                            {u.firstName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.roles.map((r) => (
                          <span key={r} className="mr-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">{r}</span>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'sellers' && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Store</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Sales</th>
                    <th className="px-4 py-3">Verified</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockSellers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/sellers/${s.slug}`} className="font-medium text-sky-600 hover:underline">{s.storeName}</Link>
                      </td>
                      <td className="px-4 py-3">{s.rating.toFixed(1)}★</td>
                      <td className="px-4 py-3">{s.totalSales}</td>
                      <td className="px-4 py-3">
                        {s.verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600"><BadgeCheck size={16} /> Verified</span>
                        ) : (
                          <span className="text-gray-400">Unverified</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!s.verified && (
                          <button className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100">Verify</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'products' && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockProducts.map((p: Product) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] && <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
                          <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.sellerName}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link to={`/products/${p.slug}`} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Eye size={16} /></Link>
                          <button className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"><CheckCircle size={16} /></button>
                          <button className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><XCircle size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'orders' && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-600">{o.items.length}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
