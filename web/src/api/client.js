// Logs dev
if (import.meta.env.DEV) {
    console.log('[WITS] PRODUCTS_API =', import.meta.env.VITE_PRODUCTS_API_URL);
    console.log('[WITS] MOVEMENTS_API =', import.meta.env.VITE_MOVEMENTS_API_URL);
}

// Fallback same-origin si non définies
const PRODUCTS_API = import.meta.env.VITE_PRODUCTS_API_URL ?? '';
const MOVEMENTS_API = import.meta.env.VITE_MOVEMENTS_API_URL ?? '';

async function http(base, path, options = {}) {
    const token = localStorage.getItem('wits_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const url = base ? `${base}${path}` : path; // fallback same-origin
    const response = await fetch(url, { ...options, headers, credentials: 'include' });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        if (response.status === 401) throw new Error('unauthorized');
        if (response.status === 422 && isJson) throw new Error(body.details || 'validation_failed');
        throw new Error(isJson ? (body.error || response.statusText) : response.statusText);
    }
    return body;
}

export const api = {
    auth: {
        login: (email, password) =>
            http(PRODUCTS_API, '/api/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    },
    products: {
        list: (page = 1, size = 10, q = '') =>
            http(PRODUCTS_API, `/api/products/enriched?page=${page}&size=${size}&q=${encodeURIComponent(q)}`),
        create: (payload) =>
            http(PRODUCTS_API, '/api/products', { method: 'POST', body: JSON.stringify(payload) }),
        update: (id, payload) =>
            http(PRODUCTS_API, `/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
        remove: (id) =>
            http(PRODUCTS_API, `/api/products/${id}`, { method: 'DELETE' }),
    },
    movements: {
        list: (productId, limit = 50) =>
            http(MOVEMENTS_API, `/api/movements?product_id=${productId ?? ''}&limit=${limit}`),
        create: (payload) =>
            http(MOVEMENTS_API, '/api/movements', { method: 'POST', body: JSON.stringify(payload) }),
    },
};

export { PRODUCTS_API, MOVEMENTS_API };
