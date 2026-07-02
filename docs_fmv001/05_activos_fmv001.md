# 05 - Inventario de Activos

## Objetivo

Identificar y clasificar los activos de informacion que soportan la aplicacion
auditada (DVWA desplegado en Vercel + frontend React). Esto permite priorizar
los riesgos segun su criticidad.

## Tipos de activos

| Tipo              | Ejemplos                                                   |
|-------------------|------------------------------------------------------------|
| Datos             | Credenciales de usuarios, registros de auditoria, logs.    |
| Software          | Frontend React, API Node/Express, base de datos DVWA.       |
| Hardware          | Servidor de Vercel (edge functions), navegador del cliente.|
| Personas          | Desarrolladores, usuarios finales, equipo de seguridad.    |
| Servicios         | GitHub, Vercel, CDN, Sentry, correo transaccional.         |

## Matriz de activos

| Activo                          | Tipo    | Ubicacion       | Propietario | Confidencialidad | Integridad | Disponibilidad |
|---------------------------------|---------|-----------------|-------------|-------------------|------------|----------------|
| Codigo fuente                   | Software| Repositorio GH  | Dev team    | Media             | Alta       | Alta           |
| Base de datos DVWA              | Datos   | DVWA container  | Dev team    | Alta              | Alta       | Media          |
| Variables de entorno (.env)     | Datos   | Vercel          | DevOps      | Alta              | Alta       | Media          |
| Build artefact (`dist/`)        | Software| Vercel CDN      | DevOps      | Baja              | Alta       | Alta           |
| Logs de acceso                  | Datos   | Vercel logs     | DevOps      | Media             | Alta       | Alta           |
| Cookies de sesion               | Datos   | Navegador       | Usuario     | Alta              | Alta       | Media          |

## Clasificacion CIA

- **C - Confidencialidad:** quien puede leerlo.
- **I - Integridad:** quien puede modificarlo.
- **A - Disponibilidad:** quien necesita que este disponible.

## Recomendaciones

1. Mantener el inventario actualizado en cada release.
2. Etiquetar los datos personales segun GDPR/LOPD.
3. Aplicar `least privilege` en accesos a GitHub y Vercel.
4. Cifrar en reposo (DB) y en transito (HTTPS + HSTS).
5. Backups diarios cifrados con prueba de restore mensual.