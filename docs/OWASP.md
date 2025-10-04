# Note sécurité – WITS (OWASP)

## Contexte
SPA React (Vite) + 2 APIs Slim 4 (PHP 8.3, Eloquent), MySQL 8. Stock **dérivé** des mouvements. Auth **JWT** activable (flag). CI GitHub Actions.

---

## Principaux risques & contrôles (OWASP Top 10)

**A01 Broken Access Control**
- Règle: endpoints d’écriture protégés par middleware JWT quand `AUTH_ENABLED=1`.
- Backlog: rôles Admin/Employé, contrôle fin par route.
- Test démo: POST sans token ⇒ **401**, avec token ⇒ **200**.

**A02 Cryptographic Failures**
- Secret JWT fort (≥32 chars), HS256, TTL 30 min.
- Prod: HTTPS (TLS), **HSTS**.
- Rotation: prévoir régénération + invalidation (si nécessaire).

**A03 Injection**
- ORM Eloquent (pas de SQL concaténé).
- Validation serveur (422).
- DB: contraintes CHECK (type IN/OUT, qty>0), FK.
- Revues: si SQL brut dans migrations/seed ⇒ audit ciblé.

**A05 Security Misconfiguration**
- CORS dev strict: `http://localhost:5173` (multi-origine via `FRONT_ORIGINS`).
- Prod: même origine (front + API derrière Nginx) ⇒ CORS off.
- Adminer: **dev only**, non exposé en prod.

**A07 Identification & Auth**
- JWT côté serveur, signature/exp vérifiées.
- Stockage front: `localStorage` (XSS: voir A03/A06).
- Backlog: refresh tokens, rotation, revocation list si comptes multiples.

**A08 Software Integrity**
- CI: build PHP + tests; build web déterministe (VITE_* injectés).
- Backlog: scan vulnérabilités (Trivy), signature images.

**A09 Logging & Monitoring**
- Logs JSON côté PHP/Nginx.
- Backlog: audit log mouvements sensibles, agrégation/alerting.

**A10 SSRF**
- N/A (APIs n’appellent pas des URLs externes).

---

## En-têtes HTTP recommandés (prod)
Exemple (Nginx) :
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer" always;
add_header Permissions-Policy "geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;