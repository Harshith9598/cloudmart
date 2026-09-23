import { Link } from '@/components/Link';
import { ProductCard } from '@/components/ProductCard';
import { StarRating } from '@/components/StarRating';
import { mockProducts, mockSellers, mockReviews } from '@/services/mock-data';
import { formatPrice } from '@/lib/utils';
import { Store, BadgeCheck, ArrowRight, Package, Star } from 'lucide-react';

export function SellersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
        <p className="mt-1 text-sm text-gray-500">Discover trusted stores on CloudMart</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockSellers.map((seller) => {
            const sellerProducts = mockProducts.filter((p) => p.sellerId === seller.id);
            return (
              <Link
                key={seller.id}
                to={`/sellers/${seller.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-sky-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-bold text-white">
                    {seller.storeName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600">{seller.storeName}</h3>
                      {seller.verified && <BadgeCheck size={18} className="text-sky-500" />}
                    </div>
                    <StarRating rating={seller.rating} size={14} showNumber />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{seller.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Package size={16} /> {sellerProducts.length} products
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Star size={16} className="text-amber-400" /> {seller.totalSales} sales
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SellerDetailPage({ slug }: { slug: string }) {
  const seller = mockSellers.find((s) => s.slug === slug || s.id === slug);
  if (!seller) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Seller not found</h1>
        <Link to="/sellers" className="mt-4 text-sky-600 hover:underline">View all sellers</Link>
      </div>
    );
  }

  const products = mockProducts.filter((p) => p.sellerId === seller.id);
  const sellerReviews = mockReviews.filter((r) =>
    products.some((p) => p.id === r.productId),
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-br from-slate-900 to-sky-800" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-3xl font-bold text-white ring-4 ring-white">
            {seller.storeName.charAt(0)}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                  <BadgeCheck size={16} /> Verified Seller
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <StarRating rating={seller.rating} size={14} showNumber />
              <span>{seller.totalSales} sales</span>
              <span>Joined {new Date(seller.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-gray-700">{seller.description}</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            <div className="text-xs text-gray-500">Products</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{seller.rating.toFixed(1)}</div>
            <div className="text-xs text-gray-500">Avg Rating</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{sellerReviews.length}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div>

        {/* Products */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Products from {seller.storeName}</h2>
          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
