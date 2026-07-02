# 01 - Resumen Ejecutivo

## Alcance

Auditoria de seguridad web de la aplicacion **DVWA (Damn Vulnerable Web Application)**
desplegada en entorno academico, complementada con un frontend React + Vite
publicado en Vercel. El alcance cubre:

- Modulos vulnerables de DVWA: SQL Injection, XSS y OS Command Injection.
- Cabeceras HTTP, CSP, cookies y superficie del frontend.
- Configuracion de despliegue en Vercel y secretos en GitHub.

## Metodologia

Se siguio una variante academica de **OWASP Testing Guide v4.2**:

1. Reconocimiento y mapeo de activos.
2. Analisis estatico (SAST) sobre el frontend.
3. Analisis dinamico (DAST) con `sqlmap`, `XSStrike` y `Burp Suite Community`.
4. Pruebas manuales contra DVWA en niveles Low/Medium.
5. Modelado de amenazas y matriz de riesgo.
6. Propuesta de controles.
7. Plan de recuperacion ante incidentes.

## Hallazgos principales

| ID  | Hallazgo                          | CVSS | Riesgo |
|-----|-----------------------------------|------|--------|
| H-01| SQL Injection (DVWA)              | 9.1  | Critico|
| H-02| OS Command Injection (DVWA)       | 9.8  | Critico|
| H-03| XSS Reflected (DVWA)              | 6.1  | Alto   |
| H-04| Falta de Content-Security-Policy  | 5.4  | Medio  |
| H-05| Cookies de sesion sin HttpOnly    | 5.3  | Medio  |

## Conclusion

El riesgo residual tras aplicar los controles propuestos baja de **Critico**
a **Bajo**, siempre que se implemente:

- Prepared statements en toda consulta a BD.
- Sanitizacion + CSP estricta.
- Rate limiting + WAF en el borde.
- Hardening de cookies y cabeceras HTTP.

## KPIs del informe

- Hallazgos criticos: 2
- Hallazgos altos: 1
- CVSS promedio: **7.1**
- Tiempo estimado de remediacion: **2 semanas (1 dev)**.