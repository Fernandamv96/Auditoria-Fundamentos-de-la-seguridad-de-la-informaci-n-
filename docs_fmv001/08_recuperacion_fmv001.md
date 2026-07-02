# 08 - Plan de Recuperacion ante Incidentes

## Objetivos

1. **Detectar** el incidente en menos de 15 minutos (alertas automatizadas).
2. **Contener** el daño en menos de 1 hora.
3. **Erradicar** la causa raiz en menos de 24 horas.
4. **Recuperar** el servicio en menos de 4 horas.
5. **Aprender** publicando post-mortem en menos de 7 dias.

## Roles (CSIRT)

| Rol                  | Responsable           |
|----------------------|-----------------------|
| Incident Commander   | DevOps Lead           |
| Tech Lead            | Backend Lead          |
| Communications       | PM / Soporte          |
| Legal & Compliance   | Asesor juridico       |
| Forensics            | Equipo seguridad      |

## Procedimiento

### 1. Deteccion

- Alertas Sentry/Datadog.
- Reporte de usuarios.
- WAF logs (Cloudflare).

### 2. Contencion

- Bloquear IP atacantes en WAF.
- Desactivar credenciales comprometidas.
- Rollback al ultimo commit limpio (`vercel rollback`).

### 3. Erradicacion

- Patch de la vulnerabilidad.
- Rotacion de secretos (Vercel env vars, GitHub PAT).
- Escanear con `trivy` / `grype` la imagen Docker.

### 4. Recuperacion

- Despliegue del fix en `main` -> Vercel production.
- Smoke test manual contra `/api/health`.
- Monitorizacion reforzada 24h.

### 5. Post-mortem

Documento sin culpa, con:

- Timeline (UTC).
- Root cause.
- Acciones correctivas con responsable y fecha.
- Lessons learned.

## Contactos

| Servicio  | Email                       | Telefono       |
|-----------|-----------------------------|----------------|
| Vercel    | support@vercel.com          | -              |
| GitHub    | support@github.com          | -              |
| CERT      | cert@incibe.es              | 017              |
| Interno   | seguridad@empresa.com       | +34 xxx xxx xxx |

## Backups

- Snapshot diario de base de datos DVWA (retain 7).
- Repositorio GitHub es la fuente de verdad del codigo.
- Practicar restore mensualmente.