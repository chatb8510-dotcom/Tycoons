import { useState } from 'react';
import { Page } from './types';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BusinessEnquiryForm from './components/forms/BusinessEnquiryForm';
import ProductEnquiryForm from './components/forms/ProductEnquiryForm';
import AdminPage from './pages/AdminPage';
import ContentManagementPage from './pages/ContentManagementPage';
import ProductDisplayPage from './pages/ProductDisplayPage';
import ProductManagementPage from './pages/ProductManagementPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CustomerRequirementPage from './pages/CustomerRequirementPage';
import ImageManagementPage from './pages/ImageManagementPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  function handleNavigate(page: Page, productId?: string) {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <CartProvider>
      <div style={{ background: '#080808', minHeight: '100vh' }}>
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'business-enquiry' && <BusinessEnquiryForm onNavigate={handleNavigate} />}
        {currentPage === 'product-enquiry' && <ProductEnquiryForm onNavigate={handleNavigate} />}
        {currentPage === 'products' && <ProductDisplayPage onNavigate={handleNavigate} />}
        {currentPage === 'product-detail' && (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'customer-requirement' && <CustomerRequirementPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
        {currentPage === 'content-management' && <ContentManagementPage onNavigate={handleNavigate} />}
        {currentPage === 'product-management' && <ProductManagementPage onNavigate={handleNavigate} />}
        {currentPage === 'image-management' && <ImageManagementPage onNavigate={handleNavigate} />}
      </div>
    </CartProvider>
  );
}
