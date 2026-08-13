import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import HomePage from './pages/HomePage';
import RoutesPrototypePage from './pages/RoutesPrototypePage';
import CasePage from './pages/CasePage';
import OgPreviewPage from './pages/OgPreviewPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import TranscriptionPage from './pages/TranscriptionPage';

const OzonCustomerPortraitPage = lazy(() => import('./pages/OzonCustomerPortraitPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases/releases" element={<CasePage slug="releases" />} />
        <Route path="/cases/routes" element={<CasePage slug="routes" />} />
        <Route path="/cases/pushup-counter" element={<CasePage slug="pushup-counter" />} />
        <Route path="/cases/design-challenges" element={<CasePage slug="design-challenges" />} />
        <Route path="/cases/service-sprint" element={<CasePage slug="service-sprint" />} />
        <Route path="/og-preview" element={<OgPreviewPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transcribe" element={<TranscriptionPage />} />
        <Route path="/admin-panel" element={<Navigate to="/cases/releases" replace />} />
        <Route path="/routes" element={<Navigate to="/cases/routes" replace />} />
        <Route path="/routes-prototype" element={<RoutesPrototypePage />} />
        <Route
          path="/ozon-customer-portrait"
          element={<Suspense fallback={<div className="min-h-screen bg-white" />}><OzonCustomerPortraitPage /></Suspense>}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
