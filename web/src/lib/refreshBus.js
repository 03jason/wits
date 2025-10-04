import * as React from 'react';

const EVT = 'wits:refresh';

/** Emet un signal de refresh ; topic = 'products' | 'movements' (info) */
export function emitRefresh(topic = 'products') {
    window.dispatchEvent(new CustomEvent(EVT, { detail: { topic, ts: Date.now() } }));
}

/** Abonne un callback au signal de refresh */
export function useRefreshListener(cb, deps = []) {
    React.useEffect(() => {
        const h = (e) => cb?.(e.detail);
        window.addEventListener(EVT, h);
        return () => window.removeEventListener(EVT, h);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
