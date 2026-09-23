import type {
  Product,
  Category,
  User,
  SellerProfile,
  Review,
  Cart,
  CartItemDto,
  Order,
  OrderItem,
  Payment,
} from '@/types';

// ============ Categories ============
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech', parentId: null, iconUrl: null, productCount: 0, children: [
    { id: 'cat-5', name: 'Headphones', slug: 'headphones', description: 'Audio gear', parentId: 'cat-1', iconUrl: null, productCount: 0 },
    { id: 'cat-6', name: 'Laptops', slug: 'laptops', description: 'Portable computing', parentId: 'cat-1', iconUrl: null, productCount: 0 },
    { id: 'cat-7', name: 'Smartphones', slug: 'smartphones', description: 'Mobile devices', parentId: 'cat-1', iconUrl: null, productCount: 0 },
  ]},
  { id: 'cat-2', name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home', parentId: null, iconUrl: null, productCount: 0, children: [
    { id: 'cat-8', name: 'Furniture', slug: 'furniture', description: 'Furnish your space', parentId: 'cat-2', iconUrl: null, productCount: 0 },
    { id: 'cat-9', name: 'Kitchen', slug: 'kitchen', description: 'Cookware and accessories', parentId: 'cat-2', iconUrl: null, productCount: 0 },
  ]},
  { id: 'cat-3', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', parentId: null, iconUrl: null, productCount: 0, children: [
    { id: 'cat-10', name: 'Watches', slug: 'watches', description: 'Timepieces', parentId: 'cat-3', iconUrl: null, productCount: 0 },
    { id: 'cat-11', name: 'Bags', slug: 'bags', description: 'Backpacks and more', parentId: 'cat-3', iconUrl: null, productCount: 0 },
  ]},
  { id: 'cat-4', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for active lifestyles', parentId: null, iconUrl: null, productCount: 0, children: [
    { id: 'cat-12', name: 'Cycling', slug: 'cycling', description: 'Bikes and accessories', parentId: 'cat-4', iconUrl: null, productCount: 0 },
    { id: 'cat-13', name: 'Fitness', slug: 'fitness', description: 'Workout equipment', parentId: 'cat-4', iconUrl: null, productCount: 0 },
  ]},
];

// ============ Sellers ============
export const mockSellers: SellerProfile[] = [
  { id: 'seller-1', userId: 'user-2', storeName: 'TechNest', slug: 'technest', description: 'Premium electronics for modern living', logoUrl: null, verified: true, rating: 4.8, totalSales: 3420, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'seller-2', userId: 'user-3', storeName: 'HomeHarbor', slug: 'homeharbor', description: 'Your home, perfected', logoUrl: null, verified: true, rating: 4.6, totalSales: 1890, createdAt: '2024-02-20T10:00:00Z' },
  { id: 'seller-3', userId: 'user-4', storeName: 'StyleForge', slug: 'styleforge', description: 'Fashion that defines you', logoUrl: null, verified: false, rating: 4.3, totalSales: 720, createdAt: '2024-03-10T10:00:00Z' },
  { id: 'seller-4', userId: 'user-5', storeName: 'ActiveEdge', slug: 'activeedge', description: 'Gear for the bold', logoUrl: null, verified: true, rating: 4.7, totalSales: 2150, createdAt: '2024-01-28T10:00:00Z' },
];

const IMG = {
  headphones: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
  headphones2: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  laptop2: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
  phone: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
  phone2: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
  watch: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
  watch2: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
  sofa: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
  lamp: 'https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=800',
  kitchen: 'https://images.pexels.com/photos/263901/pexels-photo-263901.jpeg?auto=compress&cs=tinysrgb&w=800',
  bag: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
  bike: 'https://images.pexels.com/photos/100382/pexels-photo-100382.jpeg?auto=compress&cs=tinysrgb&w=800',
  fitness: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
  speaker: 'https://images.pexels.com/photos/1705325/pexels-photo-1705325.jpeg?auto=compress&cs=tinysrgb&w=800',
  camera: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
  keyboard: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800',
  desk: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800',
};

// ============ Products ============
export const mockProducts: Product[] = [
  {
    id: 'prod-1', sellerId: 'seller-1', sellerName: 'TechNest', sellerSlug: 'technest', sellerVerified: true,
    categoryId: 'cat-5', categoryName: 'Headphones',
    name: 'Aurora Wireless Noise-Cancelling Headphones', slug: 'aurora-wireless-headphones',
    description: 'Immerse yourself in studio-quality sound with adaptive noise cancellation. 40-hour battery life, plush memory-foam earcups, and Bluetooth 5.3 multipoint pairing.',
    price: 299.99, compareAtPrice: 399.99, sku: 'TN-AWH-001', stock: 45, rating: 4.8, reviewCount: 128,
    images: [
      { id: 'img-1a', url: IMG.headphones, altText: 'Aurora headphones front', isPrimary: true, displayOrder: 0 },
      { id: 'img-1b', url: IMG.headphones2, altText: 'Aurora headphones side', isPrimary: false, displayOrder: 1 },
    ],
    active: true, featured: true, createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'prod-2', sellerId: 'seller-1', sellerName: 'TechNest', sellerSlug: 'technest', sellerVerified: true,
    categoryId: 'cat-6', categoryName: 'Laptops',
    name: 'Nimbus Pro 14" Ultrabook', slug: 'nimbus-pro-14-ultrabook',
    description: 'Featherlight at 1.2kg with a stunning 14-inch OLED display, 32GB RAM, 1TB SSD, and 18-hour battery. The ultimate creator companion.',
    price: 1499.00, compareAtPrice: null, sku: 'TN-NP-014', stock: 12, rating: 4.9, reviewCount: 67,
    images: [
      { id: 'img-2a', url: IMG.laptop, altText: 'Nimbus Pro open', isPrimary: true, displayOrder: 0 },
      { id: 'img-2b', url: IMG.laptop2, altText: 'Nimbus Pro closed', isPrimary: false, displayOrder: 1 },
    ],
    active: true, featured: true, createdAt: '2024-07-15T10:00:00Z', updatedAt: '2024-09-10T10:00:00Z',
  },
  {
    id: 'prod-3', sellerId: 'seller-1', sellerName: 'TechNest', sellerSlug: 'technest', sellerVerified: true,
    categoryId: 'cat-7', categoryName: 'Smartphones',
    name: 'Pulse 5G Smartphone 256GB', slug: 'pulse-5g-smartphone',
    description: '6.7-inch AMOLED display, triple-lens 108MP camera system, 5G connectivity, and a titanium frame. IP68 water resistant.',
    price: 899.00, compareAtPrice: 999.00, sku: 'TN-P5G-256', stock: 30, rating: 4.6, reviewCount: 203,
    images: [
      { id: 'img-3a', url: IMG.phone, altText: 'Pulse 5G front', isPrimary: true, displayOrder: 0 },
      { id: 'img-3b', url: IMG.phone2, altText: 'Pulse 5G back', isPrimary: false, displayOrder: 1 },
    ],
    active: true, featured: false, createdAt: '2024-06-20T10:00:00Z', updatedAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'prod-4', sellerId: 'seller-1', sellerName: 'TechNest', sellerSlug: 'technest', sellerVerified: true,
    categoryId: 'cat-5', categoryName: 'Headphones',
    name: 'EchoBuds Pro True Wireless Earbuds', slug: 'echobuds-pro',
    description: 'Compact earbuds with active noise cancellation, wireless charging case, and IPX5 sweat resistance. 8 hours per charge, 32 total with case.',
    price: 149.99, compareAtPrice: 179.99, sku: 'TN-EBP-001', stock: 80, rating: 4.5, reviewCount: 342,
    images: [
      { id: 'img-4a', url: IMG.speaker, altText: 'EchoBuds Pro', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: false, createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-09-12T10:00:00Z',
  },
  {
    id: 'prod-5', sellerId: 'seller-1', sellerName: 'TechNest', sellerSlug: 'technest', sellerVerified: true,
    categoryId: 'cat-5', categoryName: 'Headphones',
    name: 'Mechanical Keyboard K7 RGB', slug: 'mechanical-keyboard-k7',
    description: 'Hot-swappable mechanical keyboard with PBT keycaps, per-key RGB, USB-C, and a sturdy aluminum frame. Available in tactile or linear switches.',
    price: 119.99, compareAtPrice: null, sku: 'TN-K7-RGB', stock: 55, rating: 4.7, reviewCount: 89,
    images: [
      { id: 'img-5a', url: IMG.keyboard, altText: 'K7 RGB Keyboard', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: true, createdAt: '2024-07-25T10:00:00Z', updatedAt: '2024-09-08T10:00:00Z',
  },
  {
    id: 'prod-6', sellerId: 'seller-2', sellerName: 'HomeHarbor', sellerSlug: 'homeharbor', sellerVerified: true,
    categoryId: 'cat-8', categoryName: 'Furniture',
    name: 'Scandinavian Lounge Chair', slug: 'scandinavian-lounge-chair',
    description: 'Handcrafted lounge chair with solid oak frame and premium wool upholstery. A timeless centerpiece for any living space.',
    price: 449.00, compareAtPrice: 599.00, sku: 'HH-SLC-001', stock: 18, rating: 4.7, reviewCount: 54,
    images: [
      { id: 'img-6a', url: IMG.sofa, altText: 'Scandinavian chair', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: true, createdAt: '2024-06-10T10:00:00Z', updatedAt: '2024-09-05T10:00:00Z',
  },
  {
    id: 'prod-7', sellerId: 'seller-2', sellerName: 'HomeHarbor', sellerSlug: 'homeharbor', sellerVerified: true,
    categoryId: 'cat-9', categoryName: 'Kitchen',
    name: 'Artisan Ceramic Dinnerware Set 12pc', slug: 'artisan-ceramic-dinnerware',
    description: 'A complete 12-piece set for four: dinner plates, salad plates, and bowls. Hand-glazed stoneware, dishwasher and microwave safe.',
    price: 89.99, compareAtPrice: 129.99, sku: 'HH-ACD-012', stock: 40, rating: 4.4, reviewCount: 78,
    images: [
      { id: 'img-7a', url: IMG.kitchen, altText: 'Ceramic dinnerware', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: false, createdAt: '2024-07-05T10:00:00Z', updatedAt: '2024-08-28T10:00:00Z',
  },
  {
    id: 'prod-8', sellerId: 'seller-2', sellerName: 'HomeHarbor', sellerSlug: 'homeharbor', sellerVerified: true,
    categoryId: 'cat-8', categoryName: 'Furniture',
    name: 'Arc Floor Lamp with Marble Base', slug: 'arc-floor-lamp',
    description: 'Elegant brass arc lamp with a solid marble base and adjustable dome shade. Warm 2700K LED included.',
    price: 179.00, compareAtPrice: null, sku: 'HH-AFL-001', stock: 22, rating: 4.6, reviewCount: 41,
    images: [
      { id: 'img-8a', url: IMG.lamp, altText: 'Arc floor lamp', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: false, createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-09-14T10:00:00Z',
  },
  {
    id: 'prod-9', sellerId: 'seller-3', sellerName: 'StyleForge', sellerSlug: 'styleforge', sellerVerified: false,
    categoryId: 'cat-10', categoryName: 'Watches',
    name: 'Meridian Automatic Watch 42mm', slug: 'meridian-automatic-watch',
    description: 'Self-winding automatic movement, sapphire crystal, and 100m water resistance. Stainless steel case with genuine leather strap.',
    price: 329.00, compareAtPrice: 449.00, sku: 'SF-MAW-042', stock: 35, rating: 4.5, reviewCount: 96,
    images: [
      { id: 'img-9a', url: IMG.watch, altText: 'Meridian watch front', isPrimary: true, displayOrder: 0 },
      { id: 'img-9b', url: IMG.watch2, altText: 'Meridian watch side', isPrimary: false, displayOrder: 1 },
    ],
    active: true, featured: true, createdAt: '2024-07-18T10:00:00Z', updatedAt: '2024-09-11T10:00:00Z',
  },
  {
    id: 'prod-10', sellerId: 'seller-3', sellerName: 'StyleForge', sellerSlug: 'styleforge', sellerVerified: false,
    categoryId: 'cat-11', categoryName: 'Bags',
    name: 'Voyager Leather Backpack 28L', slug: 'voyager-leather-backpack',
    description: 'Full-grain leather backpack with padded 16" laptop compartment, hidden anti-theft pocket, and lifetime warranty.',
    price: 199.00, compareAtPrice: 279.00, sku: 'SF-VLB-028', stock: 28, rating: 4.6, reviewCount: 112,
    images: [
      { id: 'img-10a', url: IMG.bag, altText: 'Voyager backpack', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: false, createdAt: '2024-08-05T10:00:00Z', updatedAt: '2024-09-13T10:00:00Z',
  },
  {
    id: 'prod-11', sellerId: 'seller-4', sellerName: 'ActiveEdge', sellerSlug: 'activeedge', sellerVerified: true,
    categoryId: 'cat-12', categoryName: 'Cycling',
    name: 'TrailBlazer Mountain Bike 27.5"', slug: 'trailblazer-mountain-bike',
    description: 'Aluminum frame, hydraulic disc brakes, 21-speed Shimano drivetrain, and tubeless-ready wheels. Built for the trails.',
    price: 699.00, compareAtPrice: 899.00, sku: 'AE-TBM-275', stock: 8, rating: 4.7, reviewCount: 45,
    images: [
      { id: 'img-11a', url: IMG.bike, altText: 'TrailBlazer bike', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: true, createdAt: '2024-06-25T10:00:00Z', updatedAt: '2024-09-09T10:00:00Z',
  },
  {
    id: 'prod-12', sellerId: 'seller-4', sellerName: 'ActiveEdge', sellerSlug: 'activeedge', sellerVerified: true,
    categoryId: 'cat-13', categoryName: 'Fitness',
    name: 'PowerFlex Adjustable Dumbbells 24kg', slug: 'powerflex-adjustable-dumbbells',
    description: 'Space-saving adjustable dumbbells from 2.5kg to 24kg per hand. Quick-select dial and durable steel construction.',
    price: 249.00, compareAtPrice: 329.00, sku: 'AE-PAD-024', stock: 15, rating: 4.5, reviewCount: 67,
    images: [
      { id: 'img-12a', url: IMG.fitness, altText: 'PowerFlex dumbbells', isPrimary: true, displayOrder: 0 },
    ],
    active: true, featured: false, createdAt: '2024-07-30T10:00:00Z', updatedAt: '2024-09-07T10:00:00Z',
  },
];

// ============ Reviews ============
export const mockReviews: Review[] = [
  { id: 'rev-1', productId: 'prod-1', userId: 'user-6', userFirstName: 'James', rating: 5, title: 'Best headphones I have owned', comment: 'The noise cancellation is incredible. Battery lasts forever and they are super comfortable.', verifiedPurchase: true, createdAt: '2024-08-20T10:00:00Z', updatedAt: '2024-08-20T10:00:00Z' },
  { id: 'rev-2', productId: 'prod-1', userId: 'user-7', userFirstName: 'Sarah', rating: 4, title: 'Great sound, tight fit', comment: 'Sound quality is excellent but they get a bit warm after long sessions.', verifiedPurchase: true, sellerReply: 'Thanks for the feedback! We are working on a cooler ear cushion.', sellerReplyAt: '2024-08-22T10:00:00Z', createdAt: '2024-08-18T10:00:00Z', updatedAt: '2024-08-18T10:00:00Z' },
  { id: 'rev-3', productId: 'prod-2', userId: 'user-8', userFirstName: 'Michael', rating: 5, title: 'Perfect for creators', comment: 'The OLED screen is gorgeous and it handles video editing effortlessly.', verifiedPurchase: true, createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-08-10T10:00:00Z' },
  { id: 'rev-4', productId: 'prod-9', userId: 'user-9', userFirstName: 'Elena', rating: 5, title: 'Stunning timepiece', comment: 'Looks far more expensive than it is. The automatic movement keeps great time.', verifiedPurchase: true, createdAt: '2024-08-15T10:00:00Z', updatedAt: '2024-08-15T10:00:00Z' },
  { id: 'rev-5', productId: 'prod-6', userId: 'user-10', userFirstName: 'David', rating: 4, title: 'Beautiful but heavy', comment: 'The craftsmanship is outstanding. It is heavier than expected but very sturdy.', verifiedPurchase: true, createdAt: '2024-08-25T10:00:00Z', updatedAt: '2024-08-25T10:00:00Z' },
];

// ============ Mock Users ============
export const mockUsers: User[] = [
  { id: 'user-1', email: 'admin@cloudmart.com', firstName: 'Admin', lastName: 'User', roles: ['ADMIN'], sellerProfile: null, createdAt: '2024-01-01T10:00:00Z' },
  { id: 'user-2', email: 'seller@technest.com', firstName: 'Tech', lastName: 'Nest', roles: ['SELLER'], sellerProfile: mockSellers[0], createdAt: '2024-01-15T10:00:00Z' },
  { id: 'user-3', email: 'seller@homeharbor.com', firstName: 'Home', lastName: 'Harbor', roles: ['SELLER'], sellerProfile: mockSellers[1], createdAt: '2024-02-20T10:00:00Z' },
  { id: 'user-6', email: 'customer@example.com', firstName: 'John', lastName: 'Customer', roles: ['CUSTOMER'], sellerProfile: null, createdAt: '2024-05-10T10:00:00Z' },
];

// Update category product counts
mockCategories.forEach((cat) => {
  if (cat.children) {
    cat.children.forEach((child) => {
      child.productCount = mockProducts.filter((p) => p.categoryId === child.id).length;
    });
  }
  cat.productCount = mockProducts.filter((p) => p.categoryId === cat.id).length;
});

// ============ Helper to build cart ============
export function buildCart(items: CartItemDto[]): Cart {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return {
    id: 'cart-mock',
    userId: 'mock-user',
    items,
    subtotal,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    updatedAt: new Date().toISOString(),
  };
}

export function productToCartItem(product: Product, quantity: number): CartItemDto {
  return {
    id: `cart-item-${product.id}`,
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    productImage: product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? null,
    price: product.price,
    quantity,
    stock: product.stock,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
  };
}

// ============ Mock Orders ============
export const mockOrders: Order[] = [
  {
    id: 'order-1', orderNumber: 'CM-2024-0001', userId: 'user-6',
    items: [
      { id: 'oi-1', productId: 'prod-1', productName: 'Aurora Wireless Noise-Cancelling Headphones', productImage: IMG.headphones, price: 299.99, quantity: 1, subtotal: 299.99 },
      { id: 'oi-2', productId: 'prod-4', productName: 'EchoBuds Pro True Wireless Earbuds', productImage: IMG.speaker, price: 149.99, quantity: 1, subtotal: 149.99 },
    ],
    subtotal: 449.98, shippingCost: 0, tax: 35.99, total: 485.97,
    status: 'DELIVERED', shippingAddress: { fullName: 'John Customer', line1: '123 Main St', city: 'Portland', state: 'OR', postalCode: '97201', country: 'USA', phone: '555-0100' },
    paymentId: 'pay-1', paidAt: '2024-08-22T10:00:00Z', shippedAt: '2024-08-23T10:00:00Z', deliveredAt: '2024-08-26T10:00:00Z',
    createdAt: '2024-08-21T10:00:00Z', updatedAt: '2024-08-26T10:00:00Z',
  },
  {
    id: 'order-2', orderNumber: 'CM-2024-0002', userId: 'user-6',
    items: [
      { id: 'oi-3', productId: 'prod-9', productName: 'Meridian Automatic Watch 42mm', productImage: IMG.watch, price: 329.00, quantity: 1, subtotal: 329.00 },
    ],
    subtotal: 329.00, shippingCost: 12.99, tax: 26.32, total: 368.31,
    status: 'SHIPPED', shippingAddress: { fullName: 'John Customer', line1: '123 Main St', city: 'Portland', state: 'OR', postalCode: '97201', country: 'USA', phone: '555-0100' },
    paymentId: 'pay-2', paidAt: '2024-09-18T10:00:00Z', shippedAt: '2024-09-19T10:00:00Z', deliveredAt: null,
    createdAt: '2024-09-17T10:00:00Z', updatedAt: '2024-09-19T10:00:00Z',
  },
];

export const mockPayments: Payment[] = [
  { id: 'pay-1', orderId: 'order-1', orderNumber: 'CM-2024-0001', amount: 485.97, currency: 'USD', status: 'SUCCEEDED', provider: 'stripe', providerPaymentId: 'pi_mock_001', createdAt: '2024-08-21T10:00:00Z', processedAt: '2024-08-21T10:01:00Z' },
  { id: 'pay-2', orderId: 'order-2', orderNumber: 'CM-2024-0002', amount: 368.31, currency: 'USD', status: 'SUCCEEDED', provider: 'stripe', providerPaymentId: 'pi_mock_002', createdAt: '2024-09-17T10:00:00Z', processedAt: '2024-09-17T10:01:00Z' },
];

export type { CartItemDto, OrderItem };
