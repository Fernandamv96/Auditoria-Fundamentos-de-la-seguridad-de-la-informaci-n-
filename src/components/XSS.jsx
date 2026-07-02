export default function XSS() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">03 — Informe A · H-03</div>
        <h1 className="page-title">XSS Reflected</h1>
        <p className="page-desc">
          Cross-Site Scripting reflejado en DVWA nivel Low. CVSS 6.1 Alto.
          Requiere interacción de la víctima; alcance cambia (Scope Changed).
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'CVSS Base Score', value:'6.1',   sub:'Alto' },
          { label:'Scope',           value:'Changed',sub:'Afecta al usuario' },
          { label:'User Interaction',value:'Req.',  sub:'Víctima debe abrir URL' },
          { label:'Impacto CIA',     value:'C:L I:L A:N', sub:'Confidencialidad e Integridad' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize: k.value.length>5?'16px':'28px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc">
        <h2>Descripción técnica</h2>
        <p>
          XSS permite <strong>inyectar código JavaScript malicioso</strong> en páginas vistas por otros usuarios.
          En la variante <em>Reflected</em>, el payload viaja en la petición HTTP (parámetro GET/POST) y la aplicación
          lo devuelve sin escapar en la respuesta HTML, donde el navegador lo ejecuta.
        </p>

        <h2>Vector de ataque — DVWA nivel Low</h2>
        <div className="attack-demo reveal">
          <div className="attack-demo-header">
            <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
            <span className="attack-demo-title">dvwa/vulnerabilities/xss_r/?name=</span>
          </div>
          <div className="attack-demo-body">
            <div className="attack-flow">
              <div className="attack-step">
                <div className="attack-step-num">1</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Renderizado PHP vulnerable</div>
                  <div className="attack-step-code">{'<p>Hello <pre><?= $_GET["name"] ?></pre></p>'}</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">2</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Payload en parámetro name=</div>
                  <div className="attack-step-code">{'<script>alert(document.cookie)</script>'}</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">3</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">HTML devuelto por el servidor</div>
                  <div className="attack-step-code">{'<p>Hello <pre><script>alert(document.cookie)</script></pre></p>'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2>Evidencia de ejecución</h2>
        <img src="/docs_fmv001/img_fmv001/xss_fmv001.png" alt="Captura XSS en DVWA" />

        <h2>Clasificación CVSS 3.1</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Métrica</th><th>Valor</th><th>Justificación</th></tr></thead>
            <tbody>
              {[
                ['Attack Vector','Network (N)','URL maliciosa enviada por correo/chat'],
                ['Attack Complexity','Low (L)','Payload básico sin condiciones especiales'],
                ['Privileges Required','None (N)','No requiere cuenta en la aplicación'],
                ['User Interaction','Required (R)','La víctima debe abrir la URL trampa'],
                ['Scope','Changed (C)','El script puede operar fuera del origen DVWA'],
                ['Confidentiality','Low (L)','Roba cookies/tokens del usuario afectado'],
                ['Integrity','Low (L)','Puede modificar el DOM que ve la víctima'],
                ['Availability','None (N)','Sin impacto en disponibilidad del servicio'],
              ].map(([m,v,j]) => (
                <tr key={m}><td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{m}</td><td><strong>{v}</strong></td><td style={{color:'var(--muted)'}}>{j}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Políticas de prevención (3.1.4)</h2>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'8px'}}><strong>Escapar toda salida HTML</strong> — React lo hace por defecto en JSX; nunca usar <code>dangerouslySetInnerHTML</code> sin sanitizar.</li>
          <li style={{marginBottom:'8px'}}><strong>Content-Security-Policy estricta:</strong><pre><code>{`Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  object-src 'none';
  base-uri 'self';`}</code></pre></li>
          <li style={{marginBottom:'8px'}}><strong>Cookies HttpOnly + Secure + SameSite=Strict</strong> — impide que el script acceda a la cookie de sesión.</li>
          <li style={{marginBottom:'8px'}}><strong>DOMPurify</strong> para sanitizar cualquier contenido HTML enriquecido antes de renderizarlo.</li>
        </ol>

        <h2>Controles de mitigación — OWASP A03 / NIST SI-10</h2>
        <ul style={{marginLeft:'18px',marginTop:'8px'}}>
          <li>WAF con reglas anti-XSS (Cloudflare Managed Ruleset, ModSecurity CRS).</li>
          <li>Doble validación frontend + backend: nunca confiar solo en el cliente.</li>
          <li>Rotación de tokens CSRF/sesión tras un incidente confirmado.</li>
          <li>Monitoreo de DOM con <code>MutationObserver</code> para detectar inyecciones en runtime.</li>
        </ul>
      </div>
    </div>
  );
}
