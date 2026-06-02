import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import imgToporkovSergei from "figma:asset/abec5a835e37d56de6c7ff0c4746ec7251e93219.png";

export default function App() {
  useEffect(() => {
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = imgToporkovSergei;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return <HomePage />;
}