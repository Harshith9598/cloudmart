import { Link } from '@/components/Link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Browse our products and find something you love.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-400"
        >
          Browse Products
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const tax = cart.subtotal * 0.08;
  const shipping = cart.subtotal > 50 ? 0 : 9.99;
  const total = cart.subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              >
                <Link to={`/products/${item.productSlug}`} className="shrink-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100">
                      <ShoppingBag size={28} className="text-gray-300" />
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.productSlug}`}
                        className="font-medium text-gray-900 hover:text-sky-600"
                      >
                        {item.productName}
                      </Link>
                      <div className="mt-0.5 text-sm text-gray-500">
                        by {item.sellerName}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="p-2 text-gray-600 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span className="font-medium text-gray-900">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 font-semibold text-white transition-colors hover:bg-sky-400"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>
              {shipping > 0 && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Add {formatPrice(50 - cart.subtotal)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
