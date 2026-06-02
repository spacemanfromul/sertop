import { useEffect } from 'react';
import HomePage from './pages/HomePage';

export default function App() {
  useEffect(() => {
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/favicon.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return <HomePage />;
}
