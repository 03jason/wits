import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

console.log('VITE_PRODUCTS_API_URL =', import.meta.env.VITE_PRODUCTS_API_URL);
console.log('VITE_MOVEMENTS_API_URL =', import.meta.env.VITE_MOVEMENTS_API_URL);

createRoot(document.getElementById('root')).render(<App />);
