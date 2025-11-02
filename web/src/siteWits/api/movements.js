// web/src/siteWits/api/movements.js
export async function fetchMovements() {
    try {
        const res = await fetch("http://localhost:8082/api/movements");
        if (!res.ok) {
            throw new Error(`Erreur API ${res.status}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Erreur fetchMovements:", err);
        return [];
    }
}
