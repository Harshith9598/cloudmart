// ============ Auth Types ============
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  sellerProfile?: SellerProfile | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============ Seller Types ============
export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  verified: boolean;
  rating: number;
  totalSales: number;
  createdAt: string;
}

export interface CreateSellerRequest {
  storeName: string;
  description: string;
  logoUrl?: string;
}

// ============ Category Types ============
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  iconUrl: string | null;
  productCount: number;
  children?: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

// ============ Product Types ============
export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  sellerVerified: boolean;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  page?: number;
  size?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  featured?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images?: { url: string; altText?: string; isPrimary?: boolean }[];
  featured?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  active?: boolean;
}

// ============ Cart Types ============
export interface CartItemDto {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  price: number;
  quantity: number;
  stock: number;
  sellerId: string;
  sellerName: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItemDto[];
  subtotal: number;
  totalItems: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ============ Order Types ============
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentId: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
}

// ============ Payment Types ============
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerPaymentId: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface CreatePaymentRequest {
  orderId: string;
  provider: 'stripe' | 'paypal';
}

// ============ Review Types ============
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userFirstName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  sellerReply?: string | null;
  sellerReplyAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ReplyReviewRequest {
  reply: string;
}

// ============ Admin Types ============
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  active: boolean;
  sellerProfile: SellerProfile | null;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}
