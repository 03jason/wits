// web/src/siteWits/api/movements.js
// =============================================
// Requête API pour récupérer les mouvements
// =============================================

export async function fetchMovements() {
    try {
        const res = await fetch("http://localhost:8082/api/movements");
        if (!res.ok) {
            throw new Error(`Erreur API ${res.status}`);
        }

        const data = await res.json();

        // On s'assure de renvoyer un tableau propre, même si l'API plante partiellement
        if (!Array.isArray(data)) {
            console.warn("API mouvements: réponse inattendue", data);
            return [];
        }

        // Nettoyage léger pour uniformiser les champs côté front
        return data.map((m) => ({
            movement_id: m.movement_id,
            product_name: m.product_name,
            quantity: Number(m.quantity ?? 0),
            type_code: m.type_code || "",
            note: m.note || "",
            user_name: m.user_name || "—",
            created_at: m.created_at || m.date || null,
        }));
    } catch (err) {
        console.error("Erreur fetchMovements:", err);
        return [];
    }
}
