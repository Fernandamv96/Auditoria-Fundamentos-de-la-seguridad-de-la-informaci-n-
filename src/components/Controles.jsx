export default function Controles() {
  const controls = [
    { id:'C-01', title:'Prepared Statements', owasp:'A03',nist:'SI-10', cwe:'CWE-89',
      desc:'Elimina SQLi parametrizando valores en lugar de concatenar strings en consultas SQL.',
      mitigates:['H-01 SQLi'], tags:['OWASP A03','NIST SI-10','CWE-89'],
      code:`// Node.js + mysql2
await pool.execute(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);` },
    { id:'C-02', title:'Escape de Salida + DOMPurify', owasp:'A03',nist:'SI-10', cwe:'CWE-79',
      desc:'React escapa por defecto en JSX. Auditar dangerouslySetInnerHTML y sanitizar con DOMPurify.',
      mitigates:['H-03 XSS'], tags:['OWASP A03','React JSX','DOMPurify'],
      code:`// Nunca esto:
<div dangerouslySetInnerHTML={{__html: userInput}} />
// Siempre esto:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />` },
    { id:'C-03', title:'Content-Security-Policy estricta', owasp:'A05',nist:'SC-28', cwe:'CWE-1021',
      desc:'Cabecera HTTP que restringe los orígenes desde los que el navegador puede cargar recursos.',
      mitigates:['H-03 XSS','H-04 CSP'], tags:['OWASP A05','NIST SC-28','CWE-1021'],
      code:`Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';` },
    { id:'C-04', title:'Cookies endurecidas', owasp:'A05',nist:'SC-8', cwe:'CWE-1004',
      desc:'Atributos HttpOnly, Secure y SameSite=Strict evitan acceso JS y envío cross-site.',
      mitigates:['H-05 Cookies','H-03 XSS'], tags:['OWASP A05','NIST SC-8','CWE-1004'],
      code:`Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Strict; Path=/` },
    { id:'C-05', title:'Whitelist + spawn() (anti-Cmdi)', owasp:'A03',nist:'CM-7', cwe:'CWE-78',
      desc:'Validar input con regex IPv4/IPv6 y usar spawn() en lugar de exec() con strings.',
      mitigates:['H-02 Cmdi'], tags:['OWASP A03','NIST CM-7','CWE-78'],
      code:`const IPV4 = /^((25[0-5]|(2[0-4]|[01]?\\d)\\d)\\.){3}(25[0-5]|(2[0-4]|[01]?\\d)\\d)$/;
if (!IPV4.test(ip)) throw new Error('IP inválida');
// Argumentos como array, no string:
spawn('ping', ['-c', '4', ip], { stdio: 'pipe' });` },
    { id:'C-06', title:'Rate Limiting en login', owasp:'A04',nist:'AC-7', cwe:'CWE-307',
      desc:'Limitar intentos de login a 5/min/IP para bloquear fuerza bruta.',
      mitigates:['Brute force'], tags:['OWASP A04','NIST AC-7','express-rate-limit'],
      code:`import rateLimit from 'express-rate-limit';
app.use('/login', rateLimit({ windowMs:60000, max:5 }));` },
    { id:'C-07', title:'WAF + Cabeceras de seguridad', owasp:'A05',nist:'SC-5', cwe:'CWE-693',
      desc:'WAF (Cloudflare) + cabeceras HSTS, X-Content-Type-Options, Referrer-Policy.',
      mitigates:['H-01','H-02','H-03'], tags:['OWASP A05','NIST SC-5','Cloudflare WAF'],
      code:`Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=()` },
    { id:'C-08', title:'Logging y monitoreo centralizado', owasp:'A09',nist:'AU-2', cwe:'CWE-778',
      desc:'Centralizar logs en Sentry/Datadog, retener 90 días, alertar en ≥5 errores 500/min.',
      mitigates:['Detección tardía'], tags:['OWASP A09','NIST AU-2','Sentry'],
      code:`// Sentry — ejemplo Next.js / Vite
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });` },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">07 — Informe A+B · 3.1.4 · 3.1.5</div>
        <h1 className="page-title">Controles de Seguridad</h1>
        <p className="page-desc">
          8 controles concretos y viables mapeados a OWASP Top 10 (2021) y
          NIST SP 800-53. Distinguen prevención (causa raíz) de mitigación (reducción de impacto).
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'Controles propuestos', value:'8', sub:'preventivos + mitigadores' },
          { label:'Marco OWASP', value:'Top 10', sub:'2021 edition' },
          { label:'Marco NIST', value:'SP 800-53', sub:'Rev. 5' },
          { label:'CWEs cubiertos', value:'8', sub:'CWE-78,79,89,307…' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize:k.value.length>5?'16px':'28px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="control-grid reveal">
        {controls.map(c => (
          <div key={c.id} className="control-card">
            <div className="ctrl-id">{c.id} · {c.owasp} · {c.nist}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <div className="ctrl-tags">
              {c.tags.map(t => <span key={t} className="ctrl-tag">{t}</span>)}
            </div>
            {c.code && (
              <pre style={{marginTop:'12px',background:'#07091a',border:'1px solid var(--line)',borderRadius:'6px',padding:'10px 12px',overflowX:'auto'}}>
                <code style={{fontFamily:'var(--font-mono)',fontSize:'11.5px',color:'#c2f0e2',whiteSpace:'pre-wrap'}}>{c.code}</code>
              </pre>
            )}
            <div style={{marginTop:'10px',display:'flex',gap:'4px',flexWrap:'wrap'}}>
              {c.mitigates.map(m => <span key={m} className="pill">{m}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="doc" style={{marginTop:'32px'}}>
        <h2>Trazabilidad — Control ↔ Hallazgo</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Control</th><th>CWE</th><th>Hallazgo mitigado</th><th>Tipo</th></tr></thead>
            <tbody>
              {[
                ['C-01','CWE-89','H-01 SQLi','Prevención (causa raíz)'],
                ['C-02','CWE-79','H-03 XSS','Prevención (causa raíz)'],
                ['C-03','CWE-1021','H-03 XSS, H-04 CSP','Prevención + Mitigación'],
                ['C-04','CWE-1004','H-05 Cookies','Prevención'],
                ['C-05','CWE-78','H-02 Cmdi','Prevención (causa raíz)'],
                ['C-06','CWE-307','Brute force login','Mitigación'],
                ['C-07','CWE-693','H-01, H-02, H-03','Mitigación (capa extra)'],
                ['C-08','CWE-778','Detección tardía','Mitigación + Recuperación'],
              ].map(([ctrl,cwe,hall,tipo]) => (
                <tr key={ctrl}>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{ctrl}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--muted)'}}>{cwe}</td>
                  <td>{hall}</td>
                  <td style={{fontSize:'12px',color:'var(--muted)'}}>{tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
