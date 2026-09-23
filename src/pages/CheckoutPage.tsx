import { useState } from 'react';
import { Link } from '@/components/Link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Check, Lock, CreditCard, Truck } from 'lucide-react';
import { mockOrders } from '@/services/mock-data';
import type { Order } from '@/types';

export function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [completed, setCompleted] = useState<Order | null>(null);

  const [shipping, setShipping] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phone: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  if (cart.items.length === 0 && !completed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <Link to="/products" className="mt-4 text-sky-600 hover:underline">Browse products</Link>
      </div>
    );
  }

  const tax = cart.subtotal * 0.08;
  const shippingCost = cart.subtotal > 50 ? 0 : 9.99;
  const total = cart.subtotal + tax + shippingCost;

  const handleSubmit = () => {
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `CM-2024-${String(mockOrders.length + 1).padStart(4, '0')}`,
      userId: user?.id ?? 'guest',
      items: cart.items.map((i) => ({
        id: `oi-${i.id}`,
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
      subtotal: cart.subtotal,
      shippingCost,
      tax,
      total,
      status: 'PAID',
      shippingAddress: shipping,
      paymentId: `pay-${Date.now()}`,
      paidAt: new Date().toISOString(),
      shippedAt: null,
      deliveredAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCompleted(order);
    clearCart();
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Check size={48} className="text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="text-sm text-gray-500">Order Number</div>
                <div className="text-lg font-bold text-gray-900">{completed.orderNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-bold text-gray-900">{formatPrice(completed.total)}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {completed.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity} · {formatPrice(item.price)}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-700">
              <Truck size={16} className="mb-1 inline" /> Estimated delivery: 3-5 business days
            </div>
          </div>
          <div className="mt-6 flex gap-4 justify-center">
            <Link to="/orders" className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">
              View Orders
            </Link>
            <Link to="/products" className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

        {/* Steps */}
        <div className="mt-6 flex items-center gap-4">
          {(['shipping', 'payment', 'confirm'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step === s ? 'bg-sky-500 text-white' :
                ['shipping', 'payment', 'confirm'].indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {['shipping', 'payment', 'confirm'].indexOf(step) > i ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium capitalize ${step === s ? 'text-sky-600' : 'text-gray-500'}`}>{s}</span>
              {i < 2 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                    <input value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                    <input value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                    <input value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!shipping.fullName || !shipping.line1 || !shipping.city || !shipping.state || !shipping.postalCode}
                  className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-emerald-500" />
                  <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">Your payment information is encrypted and secure.</p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Card Number</label>
                    <div className="relative mt-1">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name on Card</label>
                    <input value={payment.nameOnCard} onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                      <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} placeholder="MM/YY" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">CVV</label>
                      <input value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} placeholder="123" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep('shipping')} className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                    Back
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!payment.cardNumber || !payment.nameOnCard}
                    className="flex-1 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-gray-200"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>
                <div className="mt-4 space-y-4">
                  {/* Items */}
                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="h-14 w-14 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-500">Qty: {item.quantity} · {formatPrice(item.price)}</div>
                        </div>
                        <div className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  {/* Shipping */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Shipping To</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {shipping.fullName}<br />
                      {shipping.line1}{shipping.line2 && `, ${shipping.line2}`}<br />
                      {shipping.city}, {shipping.state} {shipping.postalCode}<br />
                      {shipping.country}
                    </p>
                  </div>
                  {/* Payment */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Card ending in {payment.cardNumber.slice(-4) || '****'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep('payment')} className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-400"
                  >
                    Place Order - {formatPrice(total)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
