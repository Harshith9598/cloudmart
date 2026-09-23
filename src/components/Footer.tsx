import { Link } from '@/components/Link';
import { Store, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Store size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">CloudMart</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              A cloud-native marketplace connecting buyers and sellers worldwide.
              Built with React, Spring Boot, and AWS.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-gray-400 hover:text-sky-500"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-sky-500"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-sky-500"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/products" className="hover:text-sky-600">All Products</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-sky-600">Featured</Link></li>
              <li><Link to="/sellers" className="hover:text-sky-600">Sellers</Link></li>
              <li><Link to="/categories" className="hover:text-sky-600">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/login" className="hover:text-sky-600">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-sky-600">Register</Link></li>
              <li><Link to="/orders" className="hover:text-sky-600">My Orders</Link></li>
              <li><Link to="/become-seller" className="hover:text-sky-600">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/architecture" className="hover:text-sky-600">Architecture</Link></li>
              <li><a href="#" className="hover:text-sky-600">API Documentation</a></li>
              <li><a href="#" className="hover:text-sky-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sky-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            (c) 2024 CloudMart. Built with React, Spring Boot, PostgreSQL, Redis, Docker, and AWS.
          </p>
          <p className="text-xs text-gray-500">
            Frontend demo mode - Spring Boot backend included in /backend
          </p>
        </div>
      </div>
    </footer>
  );
}
