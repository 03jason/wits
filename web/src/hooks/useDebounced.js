// src/hooks/useDebounced.js
import { useEffect, useState } from "react";
export function useDebounced(value, delay=300) {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(()=>setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
    return v;
}
