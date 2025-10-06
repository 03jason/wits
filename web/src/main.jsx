import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


// garde UN seul import CSS qui existe réellement
import './styles.css'; // supprime l'autre import s'il n'existe pas
import './siteWits/assets/styles.css'

console.log('[WITS] PRODUCTS_API =', import.meta.env.VITE_PRODUCTS_API_URL);
console.log('[WITS] MOVEMENTS_API =', import.meta.env.VITE_MOVEMENTS_API_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
