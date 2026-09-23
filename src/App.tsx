import { useRouter, matchRoute } from '@/router';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AuthPage } from '@/pages/AuthPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { SellerDashboardPage, BecomeSellerPage } from '@/pages/SellerDashboardPage';
import { SellersPage, SellerDetailPage } from '@/pages/SellerPages';
import { ArchitecturePage } from '@/pages/ArchitecturePage';

function Routes() {
  const { route } = useRouter();
  const { path, query } = route;

  // Auth pages (no header/footer)
  if (path === '/login' || path === '/register') {
    return <AuthPage mode={path === '/login' ? 'login' : 'register'} />;
  }

  let content: React.ReactNode;

  if (path === '/') {
    content = <HomePage />;
  } else if (path === '/products') {
    content = <ProductsPage query={query} />;
  } else if (matchRoute(path, '/products/:slug')) {
    const { slug } = matchRoute(path, '/products/:slug')!;
    content = <ProductDetailPage slug={slug} />;
  } else if (path === '/cart') {
    content = <CartPage />;
  } else if (path === '/checkout') {
    content = <CheckoutPage />;
  } else if (path === '/orders') {
    content = <OrdersPage />;
  } else if (path === '/profile') {
    content = <ProfilePage />;
  } else if (path === '/admin') {
    content = <AdminPage />;
  } else if (path === '/seller/dashboard') {
    content = <SellerDashboardPage />;
  } else if (path === '/become-seller') {
    content = <BecomeSellerPage />;
  } else if (path === '/sellers') {
    content = <SellersPage />;
  } else if (matchRoute(path, '/sellers/:slug')) {
    const { slug } = matchRoute(path, '/sellers/:slug')!;
    content = <SellerDetailPage slug={slug} />;
  } else if (path === '/architecture') {
    content = <ArchitecturePage />;
  } else if (path === '/seller/products/new') {
    content = <SellerDashboardPage />;
  } else {
    content = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-gray-500">Page not found</p>
        <a href="#/" className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
