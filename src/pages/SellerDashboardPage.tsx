import { useState } from 'react';
import { Link } from '@/components/Link';
import { useAuth } from '@/context/AuthContext';
import { mockProducts, mockOrders } from '@/services/mock-data';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { Store, Package, DollarSign, TrendingUp, Plus, Edit2, Trash2, Eye, ArrowRight } from 'lucide-react';

export function SellerDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'products' | 'orders'>('overview');

  if (!user?.sellerProfile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50">
        <Store size={48} className="text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">No seller account</h1>
        <p className="mt-2 text-gray-500">You need a seller account to access this page.</p>
        <Link to="/become-seller" className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">
          Become a Seller
        </Link>
      </div>
    );
  }

  // Use mock data for demo, or actual seller products if matching
  const sellerProducts = mockProducts.filter((p) => p.sellerId === user.sellerProfile?.id);
  const displayProducts = sellerProducts.length > 0 ? sellerProducts : mockProducts.slice(0, 5);
  const totalRevenue = displayProducts.reduce((sum, p) => sum + p.price * (p.reviewCount / 10), 0);
  const totalOrders = Math.floor(user.sellerProfile.totalSales / 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">{user.sellerProfile.storeName}</p>
          </div>
          <Link
            to="/seller/products/new"
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { label: 'Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Orders', value: totalOrders, icon: Package, color: 'bg-sky-50 text-sky-600' },
            { label: 'Products', value: displayProducts.length, icon: Store, color: 'bg-amber-50 text-amber-600' },
            { label: 'Rating', value: user.sellerProfile.rating.toFixed(1), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', stat.color)}>
                  <stat.icon size={22} />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-gray-200">
          {(['overview', 'products', 'orders'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors',
                tab === t ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Products</h2>
                <div className="mt-4 space-y-3">
                  {displayProducts.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      {p.images[0] && <img src={p.images[0].url} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</div>
                        <div className="text-xs text-gray-500">{formatPrice(p.price)} · {p.stock} in stock</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Store Performance</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Sales this month</span><span className="font-semibold">{formatPrice(totalRevenue * 0.3)}</span></div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: '72%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Product views</span><span className="font-semibold">{(displayProducts.reduce((s, p) => s + p.reviewCount * 5, 0)).toLocaleString()}</span></div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-sky-500" style={{ width: '85%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Conversion rate</span><span className="font-semibold">3.2%</span></div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: '32%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] && <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
                          <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3">{p.rating.toFixed(1)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link to={`/products/${p.slug}`} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Eye size={16} /></Link>
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Edit2 size={16} /></button>
                          <button className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
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
                  {mockOrders.slice(0, 5).map((o) => (
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

export function BecomeSellerPage() {
  const { user, becomeSeller } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 text-center">
        <Store size={48} className="text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Sign in to become a seller</h1>
        <Link to="/login" className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">Sign In</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Store size={40} className="text-emerald-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Seller account created!</h1>
        <p className="mt-2 text-gray-500">Your store is now live on CloudMart.</p>
        <Link to="/seller/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await becomeSeller(storeName, description);
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Become a Seller</h1>
              <p className="text-sm text-gray-500">Start selling on CloudMart today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Store Name</label>
              <input
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="My Awesome Store"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Store Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers what makes your store special..."
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div className="rounded-xl bg-sky-50 p-4">
              <h3 className="text-sm font-semibold text-sky-900">What you get as a seller:</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-sky-700">
                <li>• Reach thousands of customers worldwide</li>
                <li>• Manage your products and inventory</li>
                <li>• Track orders and revenue</li>
                <li>• Respond to customer reviews</li>
                <li>• Secure payments via Stripe</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3.5 font-semibold text-white transition-colors hover:bg-sky-400 disabled:bg-gray-300"
            >
              {loading ? 'Creating...' : 'Create My Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
