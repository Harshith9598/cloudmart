import { useState, useEffect } from 'react';
import { Link } from '@/components/Link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingCart, User, Store, LayoutDashboard, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { mockCategories } from '@/services/mock-data';
import { cn } from '@/lib/utils';

export function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const close = () => {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      setCategoriesOpen(false);
    };
    if (userMenuOpen || mobileMenuOpen || categoriesOpen) {
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
    }
  }, [userMenuOpen, mobileMenuOpen, categoriesOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      window.location.hash = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isAdmin = user?.roles.includes('ADMIN');
  const isSeller = user?.roles.includes('SELLER');

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
            <Store size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">CloudMart</span>
        </Link>

        {/* Categories dropdown */}
        <div className="relative hidden lg:block" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Categories
            <ChevronDown size={16} className={cn('transition-transform', categoriesOpen && 'rotate-180')} />
          </button>
          {categoriesOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              {mockCategories.map((cat) => (
                <div key={cat.id} className="group relative">
                  <Link
                    to={`/products?categoryId=${cat.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <span className="font-medium text-gray-800">{cat.name}</span>
                    <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                  </Link>
                  {cat.children && (
                    <div className="invisible absolute left-full top-0 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg group-hover:visible">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          to={`/products?categoryId=${child.id}`}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {isSeller && (
            <Link
              to="/seller/dashboard"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:flex"
            >
              <Store size={18} />
              Seller
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:flex"
            >
              <LayoutDashboard size={18} />
              Admin
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-lg p-2.5 text-gray-700 hover:bg-gray-100"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-500 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-semibold text-white">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                    My Orders
                  </Link>
                  {isSeller && (
                    <Link to="/seller/dashboard" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      Seller Dashboard
                    </Link>
                  )}
                  {!isSeller && (
                    <Link to="/become-seller" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      Become a Seller
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); window.location.hash = '/'; }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
            >
              <User size={18} />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="border-t border-gray-100 px-4 py-3 md:hidden">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white"
          />
        </div>
      </form>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          <Link to="/" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </Link>
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="block rounded-lg px-3 py-2 pl-6 text-sm text-gray-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          {isSeller && (
            <Link to="/seller/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
              Seller Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
