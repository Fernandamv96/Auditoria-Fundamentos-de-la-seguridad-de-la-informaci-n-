export default function InyeccionSQL() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">02 — Informe A · H-01</div>
        <h1 className="page-title">SQL Injection</h1>
        <p className="page-desc">
          Inyección SQL clásica sobre DVWA nivel Low. CVSS 9.1 Crítico.
          Explotable remotamente sin autenticación.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'CVSS Base Score', value:'9.1', sub:'Crítico' },
          { label:'Autenticación',   value:'No',  sub:'Sin req. previo' },
          { label:'Complejidad',     value:'Baja',sub:'Herramientas públicas' },
          { label:'Impacto CIA',     value:'C:H I:H A:N', sub:'Confidencialidad + Integridad' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize: k.value.length>4?'16px':'28px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc">
        <h2>Descripción técnica</h2>
        <p>
          La inyección SQL ocurre cuando la aplicación concatena entradas del usuario
          directamente en una consulta SQL sin parametrizar ni sanitizar. El atacante
          puede alterar la lógica de la consulta y ejecutar sentencias arbitrarias
          contra la base de datos.
        </p>

        <h2>Vector de ataque — DVWA nivel Low</h2>
        <div className="attack-demo reveal">
          <div className="attack-demo-header">
            <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
            <span className="attack-demo-title">dvwa/vulnerabilities/sqli/?id=</span>
          </div>
          <div className="attack-demo-body">
            <div className="attack-flow">
              <div className="attack-step">
                <div className="attack-step-num">1</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Query vulnerable original</div>
                  <div className="attack-step-code">SELECT first_name, last_name FROM users WHERE user_id = '$id';</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">2</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Payload ingresado</div>
                  <div className="attack-step-code">' OR '1'='1</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">3</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Query resultante (expone todas las filas)</div>
                  <div className="attack-step-code">SELECT first_name, last_name FROM users WHERE user_id = '' OR '1'='1';</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p>
          La condición <code>OR '1'='1'</code> es siempre verdadera, por lo que la consulta
          devuelve <strong>todas las filas</strong> de la tabla <code>users</code>,
          exponiendo credenciales y datos personales completos.
        </p>

        <h2>Evidencia de ejecución</h2>
        <img src="/docs_fmv001/img_fmv001/sqli_fmv001.png" alt="Captura SQL Injection en DVWA" />

        <h2>Clasificación CVSS 3.1</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Métrica</th><th>Valor</th><th>Justificación</th></tr></thead>
            <tbody>
              {[
                ['Attack Vector',       'Network (N)',    'Explotable de forma remota sin acceso local'],
                ['Attack Complexity',   'Low (L)',        'Herramientas públicas (sqlmap) lo automatizan'],
                ['Privileges Required', 'None (N)',       'No requiere usuario autenticado en la app'],
                ['User Interaction',    'None (N)',       'El atacante actúa sin participación de víctima'],
                ['Scope',               'Unchanged (U)',  'No cruza límite de privilegios adicional'],
                ['Confidentiality',     'High (H)',       'Exposición total de tabla users'],
                ['Integrity',           'High (H)',       'Posible INSERT/UPDATE/DROP arbitrario'],
                ['Availability',        'None (N)',       'Sin impacto directo en disponibilidad'],
              ].map(([m, v, j]) => (
                <tr key={m}><td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{m}</td><td><strong>{v}</strong></td><td style={{color:'var(--muted)'}}>{j}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Impacto en el negocio</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Sector</th><th>Consecuencia directa</th></tr></thead>
            <tbody>
              {[
                ['Banco',       'Extracción de saldos, historial crediticio y datos KYC.'],
                ['Clínica',     'Filtración de historias clínicas (PHI), violación de HIPAA.'],
                ['E-commerce',  'Robo de tarjetas, direcciones y credenciales; fraude.'],
                ['Gobierno',    'Exposición de padrón electoral, sanciones regulatorias.'],
              ].map(([s,c]) => (
                <tr key={s}><td style={{fontWeight:600}}>{s}</td><td style={{color:'var(--muted)'}}>{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Políticas de prevención (3.1.4)</h2>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'8px'}}><strong>Prepared Statements</strong> — elimina la causa raíz concatenando valores, no código:<pre><code>{`// Node.js + mysql2
const [rows] = await pool.execute(
  'SELECT first_name, last_name FROM users WHERE user_id = ?',
  [userId]
);`}</code></pre></li>
          <li style={{marginBottom:'8px'}}><strong>ORM con binding seguro</strong> (Sequelize, Prisma, TypeORM).</li>
          <li style={{marginBottom:'8px'}}><strong>Validación de entrada con whitelist</strong> — tipo de dato, longitud máxima.</li>
          <li style={{marginBottom:'8px'}}><strong>Principio de mínimo privilegio</strong> en la cuenta de BD (solo SELECT donde proceda).</li>
          <li style={{marginBottom:'8px'}}><strong>WAF</strong> (Cloudflare, ModSecurity) como capa adicional de defensa.</li>
        </ol>

        <h2>Controles de mitigación — OWASP A03 / NIST SI-10</h2>
        <ul style={{marginLeft:'18px',marginTop:'8px'}}>
          <li>WAF con reglas OWASP CRS activadas para payloads SQLi.</li>
          <li>Monitoreo de queries anómalas (slow query log, IDS de BD).</li>
          <li>Rotación inmediata de credenciales si hubo exposición confirmada.</li>
          <li>Auditorías periódicas con <code>sqlmap --batch --level=3</code> y revisión de código.</li>
        </ul>
      </div>
    </div>
  );
}
