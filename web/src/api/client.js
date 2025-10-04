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
    // const response = await fetch(url, { ...options, headers, credentials: 'include' });

    const response = await fetch(url, {
        headers,
        credentials: 'include',
        cache: 'no-store',            // ⬅️ évite un GET servi depuis le cache
        ...options,
    });
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await response.json() : await response.text();

    /*
    if (!response.ok) {
        if (response.status === 401) throw new Error('unauthorized');
        if (response.status === 422 && isJson) throw new Error(body.details || 'validation_failed');
        throw new Error(isJson ? (body.error || response.statusText) : response.statusText);
    }
     */
    if (!response.ok) {
        if (response.status === 401) throw new Error('unauthorized');
        const code   = isJson && body.error ? body.error : `HTTP ${response.status}`;
        const detail = isJson && (body.details || body.message);
        const err = new Error(detail ? `${code}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : code);
        // facultatif: expose code/details si tu veux les tester ailleurs
        err.code = code; err.details = detail;
        throw err;
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

export const apiBase = import.meta.env.VITE_PRODUCTS_API_URL;

export async function fetchJSON(url, { signal } = {}) {
    const r = await fetch(url, { signal, credentials: "include" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

export { PRODUCTS_API, MOVEMENTS_API };
