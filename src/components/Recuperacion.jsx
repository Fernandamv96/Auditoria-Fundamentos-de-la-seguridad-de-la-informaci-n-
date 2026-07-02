export default function Recuperacion() {
  const steps = [
    { title:'1. Detección', time:'< 15 min', color:'var(--accent)',
      desc:'Alertas automáticas en Sentry/Datadog disparan notificación al CSIRT. Fuentes: logs WAF (Cloudflare), reportes de usuarios, anomalías en queries.' },
    { title:'2. Contención', time:'< 1 hora', color:'var(--warn)',
      desc:'Bloqueo de IPs atacantes en WAF. Desactivación de credenciales comprometidas. Rollback al último commit limpio: vercel rollback --yes.' },
    { title:'3. Erradicación', time:'< 24 horas', color:'#fb923c',
      desc:'Patch de la vulnerabilidad con commit fix(security): descripción. Rotación de secretos (Vercel env vars, GitHub PAT). Escaneo con trivy/grype de la imagen Docker.' },
    { title:'4. Recuperación', time:'< 4 horas', color:'var(--accent-2)',
      desc:'Despliegue del fix en rama main → Vercel production automático. Smoke test contra /api/health. Monitoreo reforzado 24 h post-deploy.' },
    { title:'5. Post-mortem', time:'< 7 días', color:'var(--ok)',
      desc:'Documento sin culpa con: timeline UTC, root cause, acciones correctivas con responsable y fecha, lessons learned publicados internamente.' },
  ];

  const mejoras = [
    { title:'WAF (Cloudflare)', cat:'Tecnología', desc:'Bloquea SQLi, XSS y Cmdi antes de que lleguen al servidor. Reglas OWASP Managed Ruleset activadas.', icon:'🛡️' },
    { title:'Segmentación de red', cat:'Infraestructura', desc:'BD en subred privada, sin exposición pública. Frontend ↔ API ↔ BD con reglas de firewall granulares.', icon:'🔒' },
    { title:'Backups cifrados', cat:'Recuperación', desc:'Snapshot diario de BD con AES-256, retención 7 días. Prueba de restore mensual documentada.', icon:'💾' },
    { title:'IaC con Terraform', cat:'DR Automatizado', desc:'Infraestructura reproducible: en < 30 min se levanta un entorno limpio desde cero.', icon:'⚡' },
    { title:'SIEM (Datadog/Sentry)', cat:'Monitoreo', desc:'Centraliza logs, correlaciona eventos y alerta sobre patrones anómalos en tiempo real.', icon:'📊' },
    { title:'Dependabot + GitHub Actions', cat:'Supply Chain', desc:'Actualización automática de deps con CI que bloquea merge si npm audit falla.', icon:'🤖' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">08 — Informe B · 3.1.6</div>
        <h1 className="page-title">Recuperación ante Incidentes</h1>
        <p className="page-desc">
          Plan DR con 5 fases basado en NIST SP 800-61 Rev.2.
          Mejoras tecnológicas propuestas: WAF, segmentación, backups, IaC y SIEM.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'Tiempo detección',    value:'15 min', sub:'Alertas automáticas' },
          { label:'Tiempo contención',   value:'1 hora', sub:'WAF + rollback' },
          { label:'Tiempo recuperación', value:'4 horas',sub:'Deploy fix en Vercel' },
          { label:'RTO objetivo',        value:'4 h',    sub:'Recovery Time Obj.' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize:'20px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc">
        <h2>Plan de respuesta — 5 fases (NIST SP 800-61)</h2>
        <div className="timeline reveal">
          {steps.map(s => (
            <div key={s.title} className="timeline-item" style={{'--dot-color':s.color}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                <h3 style={{color:s.color}}>{s.title}</h3>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',background:'var(--panel)',border:'1px solid var(--line)',padding:'2px 8px',borderRadius:'999px',color:'var(--muted)'}}>{s.time}</span>
              </div>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2>Mejoras tecnológicas propuestas — Criterio 3.1.6</h2>
        <div className="control-grid reveal">
          {mejoras.map(m => (
            <div key={m.title} className="control-card">
              <div className="ctrl-id">{m.cat}</div>
              <h3>{m.icon} {m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>

        <h2>Roles del CSIRT</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Rol</th><th>Responsable</th><th>Responsabilidades clave</th></tr></thead>
            <tbody>
              {[
                ['Incident Commander','DevOps Lead','Coordina respuesta, comunica estado, toma decisiones de contención'],
                ['Tech Lead','Backend Lead','Implementa parches, hace rollback, maneja secretos'],
                ['Communications','PM / Soporte','Notifica a usuarios afectados, gestiona PR y reporte a autoridades'],
                ['Legal & Compliance','Asesor jurídico','Evalúa obligaciones de notificación (Ley 19.628)'],
                ['Forensics','Equipo seguridad','Preserva evidencia, analiza logs, determina alcance del incidente'],
              ].map(([r,res,resp]) => (
                <tr key={r}><td style={{fontWeight:600}}>{r}</td><td style={{color:'var(--muted)'}}>{res}</td><td style={{fontSize:'12px',color:'var(--muted)'}}>{resp}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Backups y estrategia de restore</h2>
        <ul style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'6px'}}>Snapshot diario de BD DVWA con retención de 7 días (cifrado AES-256).</li>
          <li style={{marginBottom:'6px'}}>Repositorio GitHub es la fuente de verdad del código; cada deploy genera un artefacto versionado en Vercel.</li>
          <li style={{marginBottom:'6px'}}>Prueba de restore mensual documentada con tiempo medido y firmado por el Tech Lead.</li>
          <li>Procedimiento: <code>vercel rollback [deployment-id] --yes</code> para vuelta instantánea al último deploy limpio.</li>
        </ul>
      </div>
    </div>
  );
}
