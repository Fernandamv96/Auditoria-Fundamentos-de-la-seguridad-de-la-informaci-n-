# 07 - Controles de Seguridad Propuestos

## Marco de referencia

Los controles se mapean contra **OWASP Top 10 (2021)** y **NIST SP 800-53**.

## Catalogo de controles

### C-01 - Prepared Statements (mitiga A03 - Injection)

- Codigo:
  ```js
  await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  ```
- Cobertura: SQLi, NoSQLi, LDAP injection.
- Responsable: Backend lead.

### C-02 - Escape de salida (mitiga A03 - XSS)

- React ya escapa por defecto; auditar uso de `dangerouslySetInnerHTML`.
- Sanitizar markdown/HTML con DOMPurify antes de renderizarlo.

### C-03 - CSP estricta (mitiga A05 - Security Misconfiguration)

```html
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
```

### C-04 - Cookies endurecidas

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/
```

### C-05 - Rate limiting (mitiga A04 - Insecure Design)

- 100 req / 15 min / IP en `/login`.
- Implementar con middleware `express-rate-limit` o Vercel Edge config.

### C-06 - Logging y monitoreo (mitiga A09 - Logging Failures)

- Centralizar logs en Datadog/Sentry.
- Alertar sobre >= 5 errores 500/min.
- Retener logs por minimo 90 dias.

### C-07 - Dependencias actualizadas (mitiga A06 - Vulnerable Components)

```bash
npm audit --omit=dev
npm audit fix
```

- Configurar Dependabot en GitHub.
- Pin de versiones en `package-lock.json`.

### C-08 - Cabeceras HTTP seguras (mitiga A05)

```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=()
```

## Trazabilidad

| Control | CWE         | Amenaza(s) mitigada(s)        |
|---------|-------------|-------------------------------|
| C-01    | CWE-89      | H-01 SQLi                     |
| C-02    | CWE-79      | H-02 XSS                      |
| C-03    | CWE-1021    | H-02 XSS, H-04 falta CSP      |
| C-04    | CWE-1004    | H-05 cookies                  |
| C-05    | CWE-307     | Brute force login             |
| C-06    | CWE-778     | Persistencia del atacante     |
| C-07    | CWE-1104    | Dependencias vulnerables      |
| C-08    | CWE-693     | Diversas                      |