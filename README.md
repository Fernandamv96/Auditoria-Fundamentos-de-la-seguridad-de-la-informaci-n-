# Auditoria DVWA - fmv001

Aplicacion web SPA (React + Vite) que renderiza el informe tecnico de una
auditoria de seguridad sobre DVWA. Cada seccion del informe vive como un
archivo Markdown dentro de `docs_fmv001/` y se monta dinamicamente con
`react-markdown`. La matriz de riesgo es un mapa de calor **interactivo** con
logica real de clasificacion.

## 1. Estructura

```
auditoria_fmv001/
|-- docs_fmv001/
|   |-- 01_resumen_fmv001.md
|   |-- 02_sqli_fmv001.md
|   |-- 03_xss_fmv001.md
|   |-- 04_comandos_fmv001.md
|   |-- 05_activos_fmv001.md
|   |-- 06_matriz_fmv001.md
|   |-- 07_controles_fmv001.md
|   |-- 08_recuperacion_fmv001.md
|   |-- 09_prompts_fmv001.md
|   `-- img_fmv001/
|       |-- sqli_fmv001.png
|       |-- xss_fmv001.png
|       `-- comandos_fmv001.png
|-- src/
|   |-- components/
|   |   |-- MarkdownRenderer.jsx
|   |   |-- Resumen.jsx
|   |   |-- InyeccionSQL.jsx
|   |   |-- XSS.jsx
|   |   |-- Comandos.jsx
|   |   |-- Activos.jsx
|   |   |-- Matriz.jsx
|   |   |-- Controles.jsx
|   |   |-- Recuperacion.jsx
|   |   `-- Prompts.jsx
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- index.html
|-- package.json
|-- vite.config.js
`-- vercel.json
```

> Para personalizar el identificador (por defecto `fmv001`):
> 1. Renombra la carpeta `auditoria_fmv001` -> `auditoria_<aaa><nnn>`.
> 2. Renombra `docs_fmv001` -> `docs_<aaa><nnn>` (y `img_fmv001` dentro).
> 3. Renombra los archivos `01_resumen_fmv001.md`, `02_sqli_fmv001.md`, etc.
> 4. Actualiza los imports en cada componente y la constante `SECTIONS` en
>    `src/App.jsx` si anades nuevas rutas.

## 2. Instalacion y ejecucion local

Requisitos: Node.js >= 18.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ en local
```

## 3. Despliegue en GitHub + Vercel

### 3.1 Crear el repositorio

```bash
git init
git add .
git commit -m "feat: auditoria DVWA inicial"
git branch -M main
git remote add origin https://github.com/Fernandamv96/auditoria_fmv001
git push -u origin main
```

> Sustituye `auditoria_fmv001` por el nombre real del repo.

### 3.2 Conectar a Vercel

1. Entra en <https://vercel.com/new>.
2. Selecciona **Import Git Repository** y elige `Fernandamv96/auditoria_fmv001`.
3. En la pantalla de configuracion, Vercel detecta Vite automaticamente:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Pulsa **Deploy**.
5. Cada `git push` a `main` redespliega automaticamente.

## 4. Decisiones tecnicas

- **HashRouter** en `main.jsx` para que las rutas funcionen tanto en Vercel
  (que sirve `/index.html` ante cualquier path) como en previews.
- **`?raw` y `?url`** de Vite para importar los markdown como string y las
  imagenes como URL publica.
- **`react-markdown`** configurado para escapar HTML por defecto y mapear
  las rutas relativas de las imagenes a las URLs reales mediante un
  `imageMap` por componente.
- **Matriz de calor** con logica pura (`PxI`) y 4 bandas de color; permite
  filtrar por nivel y hacer hover para ver detalle.

## 5. Seguridad del propio frontend

- Cabeceras ya configuradas en `vercel.json` (X-Frame-Options, Referrer-Policy, etc).
- No se inyecta HTML sin sanitizar.
- No se exponen secretos en el cliente.

## 6. Como sacar nota 7+

Segun rubricas tipicas de una auditoria web academica:

1. **Estructura del informe** completa (resumen + hallazgos + activos +
   matriz + controles + recuperacion + prompts). Esta plantilla ya incluye
   las 9 secciones requeridas.
2. **Evidencia visual** (capturas en `img_fmv001/`). Aqui se entregan
   placeholders profesionales; sustituye por tus capturas reales de DVWA.
3. **CVSS calculado** (no inventado) con la calculadora oficial y razon
   vectorial documentada.
4. **Matriz interactiva** con logica real, no solo un PNG. Esto suma puntos
   de "valor anadido" tecnologico.
5. **Codigo limpio y comentado**, ESLint-friendly, sin `console.log`,
   sin dependencias innecesarias.
6. **Despliegue real** en Vercel con URL publica: incluirla en la portada.
7. **Trazabilidad** de prompts IA si la rubrica lo valora (seccion 09).