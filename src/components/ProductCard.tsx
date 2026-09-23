import { Link } from '@/components/Link';
import type { Product } from '@/types';
import { StarRating } from './StarRating';
import { formatPrice } from '@/lib/utils';
import { BadgeCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const primaryImage = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ShoppingCart size={48} />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white">Out of stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
          <span>{product.categoryName}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            {product.sellerName}
            {product.sellerVerified && <BadgeCheck size={12} className="text-sky-500" />}
          </span>
        </div>

        <Link to={`/products/${product.slug}`} className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 hover:text-sky-600">
          {product.name}
        </Link>

        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} />
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</div>
            {product.compareAtPrice && (
              <div className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
            disabled={product.stock === 0}
            className="rounded-xl bg-gray-900 p-2.5 text-white transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-200"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
