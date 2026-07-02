export default function Comandos() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">04 — Informe A · H-02</div>
        <h1 className="page-title">Command Injection</h1>
        <p className="page-desc">
          Inyección de comandos OS en DVWA nivel Low. CVSS 9.8 Crítico.
          Compromiso total del host: confidencialidad, integridad y disponibilidad.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'CVSS Base Score', value:'9.8',   sub:'Crítico — el más alto' },
          { label:'Impacto',         value:'C+I+A', sub:'Todos en High' },
          { label:'Autenticación',   value:'No',    sub:'Sin requisito previo' },
          { label:'Remediación',     value:'Urgente',sub:'Parche inmediato' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize: k.value.length>5?'16px':'28px', color: k.label==='CVSS Base Score'?'var(--crit-bd)':'var(--accent)'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc">
        <h2>Descripción técnica</h2>
        <p>
          Ocurre cuando la aplicación pasa datos del usuario <strong>directamente a una shell</strong>
          (<code>system()</code>, <code>exec()</code>, <code>shell_exec()</code>) sin validación.
          Un atacante puede encadenar comandos adicionales con <code>;</code>, <code>&&</code>,
          <code>||</code> o <code>|</code>.
        </p>

        <h2>Vector de ataque — DVWA nivel Low</h2>
        <div className="attack-demo reveal">
          <div className="attack-demo-header">
            <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
            <span className="attack-demo-title">dvwa/vulnerabilities/exec/ — campo ip=</span>
          </div>
          <div className="attack-demo-body">
            <div className="attack-flow">
              <div className="attack-step">
                <div className="attack-step-num">1</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Código PHP vulnerable</div>
                  <div className="attack-step-code">{`$cmd = shell_exec('ping -c 4 ' . $_REQUEST['ip']);`}</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">2</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Payload ingresado</div>
                  <div className="attack-step-code">127.0.0.1; cat /etc/passwd</div>
                </div>
              </div>
              <div className="attack-step">
                <div className="attack-step-num">3</div>
                <div className="attack-step-content">
                  <div className="attack-step-label">Comando ejecutado en el servidor</div>
                  <div className="attack-step-code">ping -c 4 127.0.0.1; cat /etc/passwd</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2>Evidencia de ejecución</h2>
        <img src="/docs_fmv001/img_fmv001/comandos_fmv001.png" alt="Captura Command Injection en DVWA" />

        <h2>Clasificación CVSS 3.1</h2>
        <div className="cvss-table-wrap">
          <table className="cvss-table">
            <thead><tr><th>Métrica</th><th>Valor</th><th>Justificación</th></tr></thead>
            <tbody>
              {[
                ['Attack Vector','Network (N)','Explotable de forma remota'],
                ['Attack Complexity','Low (L)','Separador ; disponible en bash estándar'],
                ['Privileges Required','None (N)','No requiere autenticación'],
                ['User Interaction','None (N)','El atacante actúa sin víctima'],
                ['Scope','Unchanged (U)','Opera en el contexto del servidor web'],
                ['Confidentiality','High (H)','Lectura de /etc/passwd, /etc/shadow, secrets'],
                ['Integrity','High (H)','Escritura en el sistema de archivos'],
                ['Availability','High (H)','Puede matar procesos o llenar disco'],
              ].map(([m,v,j]) => (
                <tr key={m}><td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{m}</td><td><strong>{v}</strong></td><td style={{color:'var(--muted)'}}>{j}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Políticas de prevención (3.1.4)</h2>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'8px'}}><strong>Evitar exec()/system()</strong> — usar APIs nativas de la plataforma:<pre><code>{`import { ping } from 'ping'; // librería JS, no llama a la shell`}</code></pre></li>
          <li style={{marginBottom:'8px'}}><strong>Validación estricta con whitelist</strong> — solo IPs IPv4/IPv6 válidas:<pre><code>{`const ipv4 = /^((25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$/;
if (!ipv4.test(ip)) throw new Error('IP inválida');`}</code></pre></li>
          <li style={{marginBottom:'8px'}}><strong>Parametrizar argumentos</strong> si se debe llamar al sistema: <code>spawn(['ping', '-c', '4', ip])</code>.</li>
          <li style={{marginBottom:'8px'}}><strong>Ejecutar proceso como usuario no-root</strong> (<code>nobody</code>, <code>www-data</code> sin sudo).</li>
          <li><strong>Contenedores con read-only rootfs</strong> y <code>cap_drop: ALL</code>.</li>
        </ol>

        <h2>Controles de mitigación — OWASP A03 / NIST CM-7</h2>
        <ul style={{marginLeft:'18px',marginTop:'8px'}}>
          <li>AppArmor / SELinux en modo enforcing en el host.</li>
          <li>Limitar comandos permitidos vía perfil <code>seccomp</code>.</li>
          <li>WAF con lista negra de metacaracteres: <code>;</code>, <code>|</code>, <code>&</code>, backticks.</li>
          <li>Alertas en SIEM por llamadas a <code>child_process.exec</code> con input externo.</li>
        </ul>
      </div>
    </div>
  );
}
