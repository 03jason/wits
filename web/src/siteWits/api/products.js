import { API_BASE_PRODUCTS } from './client';

export async function fetchAllProducts() {
    const resp = await fetch(`${API_BASE_PRODUCTS}/products`);
    if (!resp.ok) {
        throw new Error(`Erreur API produits (${resp.status})`);
    }
    return await resp.json();
}
