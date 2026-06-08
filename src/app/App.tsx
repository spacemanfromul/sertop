import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import RoutesPrototypePage from './pages/RoutesPrototypePage';

export default function App() {
  useEffect(() => {
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/favicon.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  if (window.location.pathname === '/routes-prototype' || window.location.hash === '#routes-prototype') {
    return <RoutesPrototypePage />;
  }

  return <HomePage />;
}
