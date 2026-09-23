import { useState } from 'react';
import { Link } from '@/components/Link';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/services/mock-data';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';

const statusConfig: Record<OrderStatus, { color: string; icon: typeof Clock; label: string }> = {
  PENDING: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pending' },
  PAID: { color: 'bg-sky-100 text-sky-700', icon: DollarSign, label: 'Paid' },
  PROCESSING: { color: 'bg-indigo-100 text-indigo-700', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'bg-blue-100 text-blue-700', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'bg-gray-100 text-gray-600', icon: XCircle, label: 'Cancelled' },
  REFUNDED: { color: 'bg-rose-100 text-rose-700', icon: DollarSign, label: 'Refunded' },
};

export function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const orders = mockOrders.filter((o) => o.userId === user?.id || user?.roles.includes('ADMIN'));

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50">
        <Package size={48} className="text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h1>
        <p className="mt-2 text-gray-500">Your order history will appear here.</p>
        <Link to="/products" className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">
          Start Shopping
        </Link>
      </div>
    );
  }

  const selected = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">{orders.length} orders</p>

        {selected ? (
          <div className="mt-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              ← Back to orders
            </button>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="text-sm text-gray-500">Order Number</div>
                  <div className="text-lg font-bold text-gray-900">{selected.orderNumber}</div>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', statusConfig[selected.status].color)}>
                  {statusConfig[selected.status].label}
                </span>
              </div>

              {/* Timeline */}
              <div className="mt-6 flex items-center gap-2">
                {(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'] as OrderStatus[]).map((s, i) => {
                  const statusIndex = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].indexOf(selected.status);
                  const isComplete = statusIndex >= i && selected.status !== 'CANCELLED';
                  return (
                    <div key={s} className="flex flex-1 items-center">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold', isComplete ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400')}>
                        {isComplete ? <CheckCircle size={16} /> : i + 1}
                      </div>
                      {i < 3 && <div className={cn('h-1 flex-1', isComplete ? 'bg-emerald-500' : 'bg-gray-200')} />}
                    </div>
                  );
                })}
              </div>

              {/* Items */}
              <div className="mt-6 space-y-3">
                {selected.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.productImage && (
                      <img src={item.productImage} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity} · {formatPrice(item.price)}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{selected.shippingCost === 0 ? 'Free' : formatPrice(selected.shippingCost)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(selected.tax)}</span></div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
              </div>

              {/* Shipping address */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selected.shippingAddress.fullName}<br />
                  {selected.shippingAddress.line1}{selected.shippingAddress.line2 && `, ${selected.shippingAddress.line2}`}<br />
                  {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}<br />
                  {selected.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className="block w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', statusConfig[order.status].color)}>
                        <StatusIcon size={22} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)} · {order.items.length} items</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', statusConfig[order.status].color)}>
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
