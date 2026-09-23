import { useState, useMemo } from 'react';
import { Link } from '@/components/Link';
import { StarRating } from '@/components/StarRating';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { mockProducts, mockReviews, mockSellers } from '@/services/mock-data';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { BadgeCheck, Minus, Plus, ShoppingCart, Truck, ShieldCheck, RotateCcw, ChevronRight, Store, Check } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const product = mockProducts.find((p) => p.slug === slug || p.id === slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [added, setAdded] = useState(false);

  const reviews = useMemo(
    () => (product ? mockReviews.filter((r) => r.productId === product.id) : []),
    [product],
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link to="/products" className="mt-4 text-sky-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  const seller = mockSellers.find((s) => s.id === product.sellerId);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-gray-500 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-sky-600">Products</Link>
          <ChevronRight size={14} />
          <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-sky-600">{product.categoryName}</Link>
          <ChevronRight size={14} />
          <span className="truncate text-gray-700">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={product.images[activeImage]?.url}
                alt={product.images[activeImage]?.altText ?? product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'h-20 w-20 overflow-hidden rounded-xl border-2 transition-all',
                      activeImage === i ? 'border-sky-500 ring-2 ring-sky-100' : 'border-gray-200 hover:border-gray-300',
                    )}
                  >
                    <img src={img.url} alt={img.altText ?? product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <span>{product.categoryName}</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-3 flex items-center gap-4">
              <StarRating rating={product.rating} showNumber reviewCount={product.reviewCount} size={18} />
              <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
            </div>

            {/* Seller */}
            <Link
              to={`/sellers/${product.sellerSlug}`}
              className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 p-3 hover:border-sky-300 hover:bg-sky-50/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Store size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">{product.sellerName}</span>
                  {product.sellerVerified && <BadgeCheck size={16} className="text-sky-500" />}
                </div>
                <div className="text-xs text-gray-500">{seller?.totalSales ?? 0} total sales</div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-sm font-semibold text-rose-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mt-3 text-sm">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <Check size={16} /> In stock ({product.stock} available)
                </span>
              ) : (
                <span className="font-medium text-rose-600">Out of stock</span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-50"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-gray-600 hover:bg-gray-50"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:bg-gray-200',
                  added ? 'bg-emerald-500 shadow-emerald-500/25' : 'bg-sky-500 shadow-sky-500/25 hover:bg-sky-400',
                )}
              >
                {added ? (
                  <><Check size={20} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={20} /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              {[
                { icon: Truck, text: 'Free shipping over $50' },
                { icon: RotateCcw, text: '30-day returns' },
                { icon: ShieldCheck, text: 'Secure checkout' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center text-center">
                  <item.icon size={24} className="text-sky-500" />
                  <span className="mt-1.5 text-xs text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex gap-6 border-b border-gray-200">
            {(['description', 'reviews', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'border-b-2 pb-3 text-sm font-semibold capitalize transition-colors',
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-gray-200 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                              {review.userFirstName.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900">{review.userFirstName}</span>
                            {review.verifiedPurchase && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <StarRating rating={review.rating} size={14} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      <h4 className="mt-3 font-semibold text-gray-900">{review.title}</h4>
                      <p className="mt-1 text-gray-700">{review.comment}</p>
                      {review.sellerReply && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <div className="text-xs font-semibold text-gray-700">Seller reply:</div>
                          <p className="mt-1 text-sm text-gray-600">{review.sellerReply}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">Shipping</h4>
                  <p className="mt-1">Free standard shipping on orders over $50. Expedited shipping available at checkout. Most orders ship within 1-2 business days.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Returns</h4>
                  <p className="mt-1">30-day return policy. Items must be in original condition. Refunds processed within 5-7 business days of receipt.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Warranty</h4>
                  <p className="mt-1">All products come with a minimum 1-year manufacturer warranty. Extended warranty available for select items.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
