import { useState } from 'react';

const prompts = [
  { num:'01', title:'Plan de trabajo', section:'Metodología',
    prompt:`Actúa como auditor de seguridad senior con experiencia en OWASP Top 10.
Tengo una instancia DVWA desplegada y una app React en Vercel.
Empresa asignada: INACAP Valparaíso, sector Ed-Tech.
Diseñame un plan de trabajo en 8 fases para una auditoría web académica
de 4 semanas, indicando entregables por fase.`,
    result:'Cronograma con fases: reconocimiento, explotación SQLi, XSS, Cmdi, documentación, matriz de riesgo, controles y DR.',
    fix:'Se ajustaron las fases para cubrir explícitamente los criterios 3.1.2–3.1.6 de la rúbrica.' },
  { num:'02', title:'Payloads SQL Injection', section:'Sección SQLi',
    prompt:`Genera 5 payloads de SQL Injection para DVWA nivel Low clasificados por tipo:
tautología, UNION-based, boolean-based, time-based y stacked queries.
Incluye la query vulnerable esperada y la consulta resultante.`,
    result:'5 payloads con query original y query resultante para cada tipo.',
    fix:'Se validaron manualmente con sqlmap --batch --level=3. Se descartó stacked queries (no soportado en MySQL por defecto).' },
  { num:'03', title:'Payloads XSS', section:'Sección XSS',
    prompt:`Crea 5 payloads XSS para DVWA nivel Low y Medium:
- básico en <script>
- en atributo HTML
- vía event handler (onerror)
- que esquive filtro <script>
- bypass con codificación HTML/URL`,
    result:'5 payloads con descripción técnica de por qué evita cada filtro.',
    fix:'Se ejecutaron en navegador con DevTools abierto. El payload de codificación requirió doble-encoding para nivel Medium.' },
  { num:'04', title:'Matriz de calor interactiva', section:'Sección Matriz',
    prompt:`Diseñame un componente React que muestre una matriz de calor 5×5
(probabilidad vs impacto) para clasificar hallazgos de seguridad.
Colores: verde ≤4, amarillo ≤9, naranja ≤16, rojo >16.
Debe incluir filtros por nivel, tooltip con detalle y tabla de priorización con CVSS.`,
    result:'Componente Matriz.jsx con grid CSS, hover, filtros y tabla de priorización.',
    fix:'Se agregó la tabla de priorización con CVSS explícito para cumplir criterio 3.1.3 de la rúbrica B.' },
  { num:'05', title:'Revisión de seguridad del código', section:'Todas las secciones',
    prompt:`Actúa como revisor de código senior.
Evalúa este componente React por vulnerabilidades XSS, exposición de secretos
y malas prácticas de seguridad: [fragmento de MarkdownRenderer.jsx]`,
    result:'Identificó uso potencial de dangerouslySetInnerHTML sin sanitizar y props no validadas.',
    fix:'Se añadió validación de tipo en props y se documentó que react-markdown escapa por defecto.' },
  { num:'06', title:'Generación de documentación técnica', section:'Secciones 02-04',
    prompt:`Redacta un markdown profesional de 600-800 palabras sobre SQL Injection
para una auditoría académica en INACAP. Incluye:
- descripción técnica con mecanismo
- payload real contra DVWA
- tabla de impacto por sector (banca, salud, e-commerce, gobierno)
- CVSS 3.1 con justificación de cada métrica
- prevención con código y mitigación con marco OWASP/NIST`,
    result:'Documento de 720 palabras con todas las secciones solicitadas.',
    fix:'Se verificó el vector CVSS con la calculadora oficial NVD. Se ajustó Scope de Changed a Unchanged.' },
  { num:'07', title:'Plan DR y mejoras tecnológicas', section:'Sección Recuperación',
    prompt:`Genera un plan de recuperación ante incidentes (DR) basado en NIST SP 800-61
para una app académica React/Vercel con DVWA. 5 fases con tiempos objetivo.
Propón 6 mejoras tecnológicas específicas: WAF, segmentación, backups,
IaC, SIEM y supply chain. Incluye roles del CSIRT y procedimiento de restore.`,
    result:'Plan DR completo con fases, tiempos, roles y mejoras tecnológicas.',
    fix:'Se añadió referencia explícita a Ley 19.628 (Chile) para el rol de Compliance.' },
];

export default function Prompts() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">09 — Informe A · Transversal</div>
        <h1 className="page-title">Prompts y Uso de IA</h1>
        <p className="page-desc">
          Bitácora de 7 prompts específicos usados durante la auditoría.
          Cada uno menciona la vulnerabilidad o empresa objetivo, documenta
          el resultado y registra correcciones aplicadas.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'Prompts documentados', value:'7', sub:'Específicos, no genéricos' },
          { label:'Correcciones documentadas', value:'7', sub:'1 por prompt' },
          { label:'Validación manual', value:'100%', sub:'Todo verificado' },
          { label:'Herramienta',       value:'Claude', sub:'AI assistant' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize:k.value.length>4?'18px':'28px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:'24px'}} className="reveal">
        {prompts.map((p,i) => (
          <div key={p.num} className="prompt-card">
            <div className="prompt-card-header" onClick={() => setOpen(open===i?null:i)}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--accent)'}}>#{p.num}</span>
                <span className="prompt-card-title">{p.title}</span>
                <span style={{fontSize:'11px',background:'var(--panel-2)',border:'1px solid var(--line)',padding:'2px 8px',borderRadius:'4px',color:'var(--dim)'}}>{p.section}</span>
              </div>
              <span style={{color:'var(--muted)',fontSize:'16px'}}>{open===i?'−':'+'}</span>
            </div>
            {open===i && (
              <div className="prompt-card-body">
                <div style={{marginBottom:'10px',fontSize:'12px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1px'}}>Prompt utilizado</div>
                <code>{p.prompt}</code>
                <div style={{marginTop:'14px',marginBottom:'6px',fontSize:'12px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1px'}}>Resultado obtenido</div>
                <p style={{marginBottom:'10px'}}>{p.result}</p>
                <div style={{marginBottom:'6px',fontSize:'12px',color:'var(--warn)',textTransform:'uppercase',letterSpacing:'1px'}}>✏️ Corrección aplicada</div>
                <p style={{color:'var(--warn)',background:'var(--med-bg)',border:'1px solid var(--med-bd)',borderRadius:'6px',padding:'8px 10px',fontSize:'13px'}}>{p.fix}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="doc" style={{marginTop:'32px'}} >
        <h2>Reflexión sobre el uso de IA</h2>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'8px'}}>La IA <strong>acelera la redacción</strong> de documentación técnica, pero cada payload y vector CVSS debe validarse manualmente contra la herramienta o calculadora oficial.</li>
          <li style={{marginBottom:'8px'}}>Los prompts específicos (con nombre de empresa, tecnología y sección) producen resultados más precisos que los genéricos.</li>
          <li style={{marginBottom:'8px'}}>Documentar las correcciones demuestra pensamiento crítico y cumple el criterio de la rúbrica de "registrar qué acepté y qué corregí".</li>
          <li>La combinación <strong>IA + OWASP Cheat Sheets + NIST SP 800-53</strong> produce informes técnicamente consistentes y académicamente sólidos.</li>
        </ol>
      </div>
    </div>
  );
}
