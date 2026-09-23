import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { mockOrders } from '@/services/mock-data';
import { User as UserIcon, Mail, Lock, Store, Shield, ShoppingBag, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const { user, updateProfile, becomeSeller } = useAuth();
  const [tab, setTab] = useState<'profile' | 'security' | 'seller'>('profile');
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const isSeller = user.roles.includes('SELLER');
  const userOrders = mockOrders.filter((o) => o.userId === user.id);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

  const handleSave = () => {
    updateProfile(firstName, lastName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBecomeSeller = async () => {
    if (storeName && description) {
      await becomeSeller(storeName, description);
      setTab('seller');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <ShoppingBag size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{userOrders.length}</div>
                <div className="text-xs text-gray-500">Orders placed</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent)}</div>
                <div className="text-xs text-gray-500">Total spent</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Shield size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.roles.join(', ')}</div>
                <div className="text-xs text-gray-500">Account type</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-gray-200">
          {(['profile', 'security', 'seller'] as const).map((t) => (
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

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          {tab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-bold text-white">
                  {user.firstName.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">Member since {formatDate(user.createdAt)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <div className="relative mt-1">
                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative mt-1">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={user.email} disabled className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-500" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                className={cn(
                  'rounded-xl px-6 py-2.5 font-semibold text-white transition-colors',
                  saved ? 'bg-emerald-500' : 'bg-sky-500 hover:bg-sky-400',
                )}
              >
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
                </div>
              </div>
              <button className="rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-white hover:bg-sky-400">
                Update Password
              </button>
            </div>
          )}

          {tab === 'seller' && (
            <div>
              {isSeller && user.sellerProfile ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-bold text-white">
                      {user.sellerProfile.storeName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{user.sellerProfile.storeName}</h2>
                        {user.sellerProfile.verified && (
                          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.sellerProfile.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{user.sellerProfile.rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{user.sellerProfile.totalSales}</div>
                      <div className="text-xs text-gray-500">Total Sales</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{user.sellerProfile.verified ? 'Yes' : 'No'}</div>
                      <div className="text-xs text-gray-500">Verified</div>
                    </div>
                  </div>
                  <a href="#/seller/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-white hover:bg-sky-400">
                    <Store size={18} />
                    Go to Seller Dashboard
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl bg-sky-50 p-4">
                    <h2 className="font-semibold text-sky-900">Become a Seller</h2>
                    <p className="mt-1 text-sm text-sky-700">Start selling on CloudMart and reach customers worldwide.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Store Name</label>
                    <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="My Awesome Store" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell customers about your store..." rows={4} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <button
                    onClick={handleBecomeSeller}
                    disabled={!storeName || !description}
                    className="rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-white hover:bg-sky-400 disabled:bg-gray-200"
                  >
                    Create Seller Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
