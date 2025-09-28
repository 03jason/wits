// Debug (optionnel)
if (import.meta.env.DEV) {
    console.log('[WITS] PRODUCTS_API =', import.meta.env.VITE_PRODUCTS_API_URL);
    console.log('[WITS] MOVEMENTS_API =', import.meta.env.VITE_MOVEMENTS_API_URL);
}

const PRODUCTS_API = import.meta.env.VITE_PRODUCTS_API_URL;
const MOVEMENTS_API = import.meta.env.VITE_MOVEMENTS_API_URL;

// Client HTTP : lit le token à CHAQUE requête
async function http(base, path, options = {}) {
    const token = localStorage.getItem('wits_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const res = await fetch(`${base}${path}`, {
        headers,
        credentials: 'include',
        ...options
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
        const msg = isJson ? (body.error || JSON.stringify(body)) : res.statusText;
        throw new Error(msg || `HTTP ${res.status}`);
    }
    return body;
}

export const api = {
    auth: {
        login: (email, password) =>
            http(PRODUCTS_API, '/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    },
    products: {
        list: (page=1, size=10, q='') =>
            http(PRODUCTS_API, `/api/products/enriched?page=${page}&size=${size}&q=${encodeURIComponent(q)}`),
        create: (payload) =>
            http(PRODUCTS_API, `/api/products`, { method:'POST', body: JSON.stringify(payload) })
    },
    movements: {
        list: (productId, limit=50) =>
            http(MOVEMENTS_API, `/api/movements?product_id=${productId ?? ''}&limit=${limit}`),
        create: (payload) =>
            http(MOVEMENTS_API, `/api/movements`, { method:'POST', body: JSON.stringify(payload) })
    }
};

export { PRODUCTS_API, MOVEMENTS_API };

if (!res.ok) {
    if (res.status === 401) throw new Error('unauthorized');
    if (res.status === 422 && isJson) throw new Error(body.details || 'validation_failed');
    throw new Error(isJson ? (body.error || res.statusText) : res.statusText);
}
