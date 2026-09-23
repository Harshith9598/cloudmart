import { useState } from 'react';
import { Link } from '@/components/Link';
import { useAuth } from '@/context/AuthContext';
import { Store, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export function AuthPage({ mode }: AuthPageProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }
      window.location.hash = '/';
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'seller' | 'customer') => {
    const demos: Record<string, [string, string, string, string]> = {
      admin: ['admin@cloudmart.com', 'demo', '', ''],
      seller: ['seller@technest.com', 'demo', '', ''],
      customer: ['customer@example.com', 'demo', '', ''],
    };
    const [e, p] = demos[role];
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
      {/* Left side - branding */}
      <div className="hidden flex-1 flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
            <Store size={22} />
          </div>
          <span className="text-2xl font-bold text-white">CloudMart</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">
            {isLogin ? 'Welcome back to the future of commerce' : 'Join the cloud-native marketplace'}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Buy and sell with confidence. Powered by Spring Boot, PostgreSQL, and Redis.
          </p>
        </div>
        <p className="text-sm text-slate-400">© 2024 CloudMart. All rights reserved.</p>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Store size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">CloudMart</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link to={isLogin ? '/register' : '/login'} className="font-semibold text-sky-600 hover:text-sky-700">
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <div className="relative mt-1">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 font-semibold text-white transition-colors hover:bg-sky-400 disabled:bg-gray-300"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-600">Demo accounts (password: demo):</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => fillDemo('admin')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:border-sky-300">
                  Admin
                </button>
                <button onClick={() => fillDemo('seller')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:border-sky-300">
                  Seller
                </button>
                <button onClick={() => fillDemo('customer')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:border-sky-300">
                  Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
