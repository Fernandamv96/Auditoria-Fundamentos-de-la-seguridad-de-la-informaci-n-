export default function Activos() {
  const activos = [
    { activo:'Base de datos DVWA',        tipo:'Datos',    ubi:'DVWA container', prop:'Dev team', c:'Alta', i:'Alta', a:'Media', vuls:['H-01 SQLi','H-02 Cmdi'] },
    { activo:'Servidor de aplicación',    tipo:'Software', ubi:'Host DVWA',      prop:'DevOps',   c:'Alta', i:'Alta', a:'Alta',  vuls:['H-02 Cmdi'] },
    { activo:'Sesión del usuario (cookie)',tipo:'Datos',   ubi:'Navegador',      prop:'Usuario',  c:'Alta', i:'Alta', a:'Media', vuls:['H-03 XSS','H-05 Cookies'] },
    { activo:'Código fuente (repositorio)',tipo:'Software',ubi:'GitHub',          prop:'Dev team', c:'Media',i:'Alta', a:'Alta',  vuls:['H-04 CSP'] },
    { activo:'Variables de entorno (.env)',tipo:'Datos',   ubi:'Vercel',          prop:'DevOps',   c:'Alta', i:'Alta', a:'Media', vuls:[] },
    { activo:'Logs de acceso',            tipo:'Datos',   ubi:'Vercel Logs',     prop:'DevOps',   c:'Media',i:'Alta', a:'Alta',  vuls:[] },
    { activo:'Build artifact (dist/)',    tipo:'Software', ubi:'Vercel CDN',      prop:'DevOps',   c:'Baja', i:'Alta', a:'Alta',  vuls:['H-04 CSP'] },
  ];

  const ciaClass = v => v === 'Alta' ? 'cia-h' : v === 'Media' ? 'cia-m' : 'cia-l';

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">05 — Informe B · 3.1.2</div>
        <h1 className="page-title">Inventario de Activos</h1>
        <p className="page-desc">
          Identificación y clasificación de activos de información vinculados a DVWA
          y el frontend React/Vercel, con valoración CIA y asociación a vulnerabilidades.
          Criterio 3.1.2 — ≥ 4 activos vinculados al rubro con vulnerabilidad asociada.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'Activos identificados', value:'7', sub:'Datos + Software + Servicios' },
          { label:'Activos con CIA Alta-C', value:'4', sub:'Confidencialidad crítica' },
          { label:'Activos vinculados a vuln.', value:'5', sub:'Con hallazgo asociado' },
          { label:'Rubro analizado', value:'Ed-Tech', sub:'INACAP / académico' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value" style={{fontSize:k.value.length>5?'15px':'28px'}}>{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="doc">
        <h2>Contexto de industria — Sector Educativo (Ed-Tech)</h2>
        <p>
          DVWA se despliega en infraestructura académica gestionada por <strong>INACAP</strong>.
          En el sector Ed-Tech los activos más críticos son los <strong>datos de estudiantes</strong>
          (credenciales, historial académico) y la <strong>disponibilidad de la plataforma</strong>
          durante períodos de evaluación. Un compromiso impacta directamente en la reputación
          institucional y puede derivar en sanciones regulatorias (Ley 19.628 Chile).
        </p>

        <h2>Matriz de activos — CIA</h2>
        <div style={{overflowX:'auto',marginTop:'16px'}}>
          <table className="asset-table reveal">
            <thead>
              <tr>
                <th>Activo</th><th>Tipo</th><th>Ubicación</th><th>Propietario</th>
                <th>C</th><th>I</th><th>A</th><th>Vulnerabilidades asociadas</th>
              </tr>
            </thead>
            <tbody>
              {activos.map(a => (
                <tr key={a.activo}>
                  <td style={{fontWeight:600}}>{a.activo}</td>
                  <td style={{color:'var(--muted)',fontSize:'12px'}}>{a.tipo}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--dim)'}}>{a.ubi}</td>
                  <td style={{fontSize:'12px',color:'var(--muted)'}}>{a.prop}</td>
                  <td><span className={`cia-badge ${ciaClass(a.c)}`}>{a.c}</span></td>
                  <td><span className={`cia-badge ${ciaClass(a.i)}`}>{a.i}</span></td>
                  <td><span className={`cia-badge ${ciaClass(a.a)}`}>{a.a}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                      {a.vuls.length > 0
                        ? a.vuls.map(v => <span key={v} className="pill">{v}</span>)
                        : <span style={{color:'var(--dim)',fontSize:'11px'}}>—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Recomendaciones de gestión</h2>
        <ol style={{marginLeft:'18px',marginTop:'8px'}}>
          <li style={{marginBottom:'6px'}}>Mantener el inventario actualizado en cada <em>release</em>.</li>
          <li style={{marginBottom:'6px'}}>Etiquetar los datos personales según <strong>Ley 19.628</strong> y futura Ley de Protección de Datos de Chile.</li>
          <li style={{marginBottom:'6px'}}>Aplicar <em>least privilege</em> en accesos a GitHub y Vercel.</li>
          <li style={{marginBottom:'6px'}}>Cifrar en reposo (BD) y en tránsito (HTTPS + HSTS).</li>
          <li>Backups diarios cifrados con prueba de restore mensual.</li>
        </ol>
      </div>
    </div>
  );
}
