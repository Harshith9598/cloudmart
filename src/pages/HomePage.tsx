import { Link } from '@/components/Link';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts, mockCategories, mockSellers } from '@/services/mock-data';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Store, BadgeCheck } from 'lucide-react';

export function HomePage() {
  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 8);
  const newArrivals = [...mockProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-sky-500/20 px-4 py-1.5 text-sm font-medium text-sky-300 ring-1 ring-sky-500/30">
              Cloud-Native Marketplace
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shop the future,
              <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                built for scale
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Discover thousands of products from verified sellers worldwide.
              Fast shipping, secure payments, and a platform engineered with
              Spring Boot, Redis, and AWS.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400"
              >
                Browse Products
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/become-seller"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: ShieldCheck, title: 'Secure Payments', desc: 'Stripe & PayPal' },
            { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free policy' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
          ].map((badge) => (
            <div key={badge.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <badge.icon size={22} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{badge.title}</div>
                <div className="text-xs text-gray-500">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-1 text-sm text-gray-500">Find exactly what you need</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-sky-600 hover:text-sky-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 transition-all hover:border-sky-300 hover:shadow-md"
            >
              <div className="text-sm font-medium text-sky-600">{cat.children?.length ?? 0} subcategories</div>
              <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-sky-600">{cat.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
              <ArrowRight size={18} className="mt-3 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-1 text-sm text-gray-500">Hand-picked items from top sellers</p>
            </div>
            <Link to="/products?featured=true" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              See more →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <p className="mt-1 text-sm text-gray-500">Just landed in the marketplace</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Top sellers */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Top Sellers</h2>
            <p className="mt-1 text-sm text-slate-300">Trusted by thousands of customers</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mockSellers.map((seller) => (
              <Link
                key={seller.id}
                to={`/sellers/${seller.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-sky-400/30 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-xl font-bold text-white">
                    {seller.storeName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white">{seller.storeName}</h3>
                      {seller.verified && <BadgeCheck size={16} className="text-sky-400" />}
                    </div>
                    <div className="text-sm text-slate-300">★ {seller.rating.toFixed(1)} · {seller.totalSales} sales</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300 line-clamp-2">{seller.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm text-sky-400">
                  <Store size={14} />
                  Visit store
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-white">Ready to start selling?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sky-50">
            Join thousands of sellers on CloudMart. Set up your store in minutes and reach customers worldwide.
          </p>
          <Link
            to="/become-seller"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-sky-600 shadow-lg transition-all hover:bg-sky-50"
          >
            Become a Seller
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
