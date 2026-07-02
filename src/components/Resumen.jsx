export default function Resumen() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">01 — Informe A</div>
        <h1 className="page-title">Resumen Ejecutivo</h1>
        <p className="page-desc">
          Auditoría de seguridad web sobre DVWA en ambiente académico.
          Tres vulnerabilidades críticas identificadas, explotadas y documentadas
          con evidencia propia, CVSS y controles propuestos.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label: 'Hallazgos críticos', value: '2', sub: 'CVSS ≥ 9.0' },
          { label: 'Hallazgos altos',    value: '1', sub: 'CVSS 6–8.9' },
          { label: 'CVSS promedio',       value: '8.3', sub: 'de 3 vulnerabilidades' },
          { label: 'Riesgo residual',     value: 'Bajo', sub: 'tras controles' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={k.value==='Bajo'?{color:'var(--ok)',fontSize:'22px'}:{}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc reveal">
        <h2>Alcance</h2>
        <p>
          La auditoría cubre los módulos vulnerables de <strong>DVWA (Damn Vulnerable Web Application)</strong>
          desplegada en entorno académico, con un frontend React + Vite publicado en Vercel.
          Se evaluaron: SQL Injection, XSS Reflected y OS Command Injection en nivel Low/Medium,
          además de configuración de cabeceras HTTP, CSP y cookies de sesión.
        </p>

        <h2>Metodología</h2>
        <p>Se siguió una variante académica de <strong>OWASP Testing Guide v4.2</strong>:</p>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          {['Reconocimiento y mapeo de activos',
            'Análisis estático (SAST) del frontend',
            'Análisis dinámico (DAST): sqlmap, XSStrike, Burp Suite Community',
            'Pruebas manuales en DVWA nivel Low/Medium',
            'Modelado de amenazas y matriz de riesgo',
            'Propuesta de controles referenciados en OWASP / NIST SP 800-53',
            'Plan de recuperación ante incidentes (DR)',
          ].map((s,i) => <li key={i} style={{marginBottom:'4px',fontSize:'14px'}}>{s}</li>)}
        </ol>

        <h2>Hallazgos principales</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead>
              <tr>
                <th>ID</th><th>Hallazgo</th><th>CVSS</th><th>Severidad</th><th>Activo afectado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id:'H-01', name:'SQL Injection (DVWA)',             cvss:'9.1', sev:'crit', sevLabel:'Crítico',  asset:'BD DVWA' },
                { id:'H-02', name:'OS Command Injection (DVWA)',      cvss:'9.8', sev:'crit', sevLabel:'Crítico',  asset:'Servidor App' },
                { id:'H-03', name:'XSS Reflected (DVWA)',             cvss:'6.1', sev:'high', sevLabel:'Alto',     asset:'Navegador / Sesión' },
                { id:'H-04', name:'Falta de Content-Security-Policy', cvss:'5.4', sev:'med',  sevLabel:'Medio',    asset:'Frontend' },
                { id:'H-05', name:'Cookies sin HttpOnly / Secure',    cvss:'5.3', sev:'med',  sevLabel:'Medio',    asset:'Cookies de sesión' },
              ].map(r => (
                <tr key={r.id}>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{r.id}</td>
                  <td>{r.name}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontWeight:700}}>{r.cvss}</td>
                  <td><span className={`badge ${r.sev}`}>{r.sevLabel}</span></td>
                  <td style={{color:'var(--muted)',fontSize:'12px'}}>{r.asset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Conclusión</h2>
        <p>
          El riesgo residual tras aplicar los controles propuestos desciende de <strong>Crítico</strong> a <strong>Bajo</strong>,
          condicionado a implementar: prepared statements en todas las consultas, sanitización de salida
          con CSP estricta, rate limiting + WAF en el borde, y hardening de cookies y cabeceras HTTP.
        </p>
      </div>
    </div>
  );
}
