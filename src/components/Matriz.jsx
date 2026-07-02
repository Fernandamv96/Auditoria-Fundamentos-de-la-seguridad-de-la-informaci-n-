import { useMemo, useState } from 'react';

const LEVELS = [1,2,3,4,5];
const LABELS = { 1:'Muy baja',2:'Baja',3:'Media',4:'Alta',5:'Muy alta' };
const IMP_LABELS = { 1:'Insignif.',2:'Menor',3:'Moderado',4:'Mayor',5:'Catastrófico' };

const FINDINGS = [
  { id:'H-01', name:'SQL Injection',          prob:5, imp:5, cvss:9.1, area:'Backend',  cls:'crit' },
  { id:'H-02', name:'Command Injection',       prob:4, imp:5, cvss:9.8, area:'Backend',  cls:'crit' },
  { id:'H-03', name:'XSS Reflected',           prob:4, imp:3, cvss:6.1, area:'Frontend', cls:'high' },
  { id:'H-04', name:'Falta de CSP',            prob:3, imp:3, cvss:5.4, area:'Frontend', cls:'med'  },
  { id:'H-05', name:'Cookies sin HttpOnly',    prob:3, imp:3, cvss:5.3, area:'Backend',  cls:'med'  },
  { id:'H-06', name:'npm deps vulnerables',    prob:3, imp:2, cvss:4.7, area:'Supply',   cls:'med'  },
  { id:'H-07', name:'Logs sin cifrar',         prob:2, imp:3, cvss:4.3, area:'Ops',      cls:'med'  },
  { id:'H-08', name:'CORS permisivo (*)',      prob:2, imp:2, cvss:3.7, area:'Frontend', cls:'low'  },
];

function classify(risk) {
  if (risk <= 4)  return { level:'Bajo',    cls:'low',  color:'#16a34a', bg:'#052e16', label:'Bajo' };
  if (risk <= 9)  return { level:'Medio',   cls:'med',  color:'#ca8a04', bg:'#1c1500', label:'Medio' };
  if (risk <= 16) return { level:'Alto',    cls:'high', color:'#ea580c', bg:'#1c0a00', label:'Alto' };
  return               { level:'Crítico', cls:'crit', color:'#dc2626', bg:'#1c0202', label:'Crítico' };
}

// Cell background interpolated by risk score
function cellBg(p, i) {
  const r = p * i;
  if (r <= 4)  return '#052e16';
  if (r <= 9)  return '#1c1500';
  if (r <= 16) return '#1c0a00';
  return '#2d0505';
}
function cellColor(p, i) {
  const r = p * i;
  if (r <= 4)  return '#4ade80';
  if (r <= 9)  return '#fbbf24';
  if (r <= 16) return '#fb923c';
  return '#f87171';
}

export default function Matriz() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const filtered = activeFilter
    ? FINDINGS.filter(f => classify(f.prob * f.imp).level === activeFilter)
    : FINDINGS;

  const grid = useMemo(() => {
    const g = {};
    for (const f of filtered) {
      const k = `${f.prob}-${f.imp}`;
      g[k] = g[k] || [];
      g[k].push(f);
    }
    return g;
  }, [filtered]);

  const yAxis = [...LEVELS].reverse();

  const counts = { 'Crítico':0,'Alto':0,'Medio':0,'Bajo':0 };
  FINDINGS.forEach(f => { counts[classify(f.prob * f.imp).level]++; });

  const sortedFindings = [...FINDINGS].sort((a,b) => (b.prob*b.imp) - (a.prob*a.imp));

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">06 — Informe B · 3.1.2 · 3.1.3</div>
        <h1 className="page-title">Matriz de Riesgo</h1>
        <p className="page-desc">
          Mapa de calor 5×5 Probabilidad × Impacto con 8 hallazgos priorizados
          por score CVSS. Criterios 3.1.2 y 3.1.3 de la rúbrica B.
        </p>
      </div>

      <div className="kpi-grid reveal">
        {[
          { label:'Riesgo Crítico',  value:counts['Crítico'], cls:'crit' },
          { label:'Riesgo Alto',     value:counts['Alto'],    cls:'high' },
          { label:'Riesgo Medio',    value:counts['Medio'],   cls:'med'  },
          { label:'Riesgo Bajo',     value:counts['Bajo'],    cls:'low'  },
        ].map(k => (
          <div key={k.label} className={`kpi`} style={{cursor:'pointer',borderColor: activeFilter===k.label.replace('Riesgo ','') ? 'var(--accent)':'var(--line)'}}
            onClick={() => setActiveFilter(activeFilter === k.label.replace('Riesgo ','') ? null : k.label.replace('Riesgo ',''))}>
            <div className="label">{k.label}</div>
            <div className="value" style={{color: k.cls==='crit'?'var(--crit-bd)':k.cls==='high'?'#ff9900':k.cls==='med'?'var(--warn)':'var(--ok)'}}>{k.value}</div>
            <div className="sub">hallazgos{activeFilter===k.label.replace('Riesgo ','')?' · activo':''}</div>
          </div>
        ))}
      </div>

      <div className="matrix-wrap reveal">
        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'16px',fontSize:'13px',color:'var(--muted)'}}>
          <span>Filtrar por nivel:</span>
          {['Crítico','Alto','Medio','Bajo'].map(lvl => (
            <button key={lvl} className={`filter-btn ${lvl==='Crítico'?'crit':lvl==='Alto'?'high':lvl==='Medio'?'med':'low'} ${activeFilter===lvl?'active':activeFilter?'inactive':''}`}
              onClick={() => setActiveFilter(activeFilter===lvl?null:lvl)}>
              {lvl}
            </button>
          ))}
          {activeFilter && <button onClick={()=>setActiveFilter(null)} style={{padding:'4px 10px',borderRadius:'6px',background:'var(--panel-2)',border:'1px solid var(--line)',color:'var(--muted)',cursor:'pointer',fontSize:'11px'}}>× Limpiar</button>}
        </div>

        {/* Matriz 5x5 */}
        <div style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
          {/* Etiqueta eje Y */}
          <div style={{writingMode:'vertical-rl',transform:'rotate(180deg)',fontSize:'11px',color:'var(--dim)',letterSpacing:'2px',textTransform:'uppercase',alignSelf:'center',paddingBottom:'32px'}}>
            PROBABILIDAD
          </div>
          <div style={{flex:1}}>
            <div className="matrix">
              {/* Fila de cabeceras impacto */}
              <div className="corner"/>
              {LEVELS.map(i => (
                <div key={i} className="axis-label" style={{fontSize:'10px',paddingBottom:'4px'}}>
                  <div style={{fontWeight:700,color:'var(--text)'}}>{i}</div>
                  <div style={{fontSize:'9px',marginTop:'1px'}}>{IMP_LABELS[i]}</div>
                </div>
              ))}

              {/* Filas: probabilidad de mayor a menor */}
              {yAxis.map(p => (
                <>
                  <div key={`yl-${p}`} className="axis-label axis-y-label" style={{flexDirection:'column',gap:'2px'}}>
                    <div style={{fontWeight:700,color:'var(--text)'}}>{p}</div>
                    <div style={{fontSize:'9px'}}>{LABELS[p]}</div>
                  </div>
                  {LEVELS.map(i => {
                    const key = `${p}-${i}`;
                    const items = grid[key] || [];
                    const risk = p * i;
                    const isHov = hoveredCell === key;
                    return (
                      <div key={key}
                        className="cell"
                        style={{background: cellBg(p,i), color: cellColor(p,i), borderColor: isHov?'var(--accent)':'transparent'}}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <span className="count" style={{color:cellColor(p,i)}}>{items.length || ''}</span>
                        <span className="cell-label" style={{color:cellColor(p,i),opacity:.8}}>
                          {risk}
                        </span>
                        {items.map(f => (
                          <div key={f.id} style={{fontSize:'9px',fontWeight:600,marginTop:'3px',color:cellColor(p,i),fontFamily:'var(--font-mono)',lineHeight:1.3}}>
                            {f.id}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div style={{textAlign:'center',fontSize:'11px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'2px',marginTop:'6px'}}>
              IMPACTO
            </div>
          </div>
        </div>

        {/* Tooltip de celda activa */}
        {hoveredCell && grid[hoveredCell] && (
          <div className="tooltip-panel">
            {grid[hoveredCell].map(f => {
              const cl = classify(f.prob * f.imp);
              return (
                <div key={f.id} style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--dim)',minWidth:'36px'}}>{f.id}</span>
                  <span style={{fontWeight:600,fontSize:'13px'}}>{f.name}</span>
                  <span className={`badge ${cl.cls}`}>{cl.level}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--muted)'}}>P:{f.prob} × I:{f.imp} = {f.prob*f.imp}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--accent)'}}>CVSS {f.cvss}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="legend">
          {[['Bajo (1-4)','#052e16','#4ade80'],['Medio (5-9)','#1c1500','#fbbf24'],['Alto (10-16)','#1c0a00','#fb923c'],['Crítico (17-25)','#2d0505','#f87171']].map(([l,bg,c]) => (
            <span key={l}><i style={{background:bg,border:`1px solid ${c}`}}/>{l}</span>
          ))}
        </div>
      </div>

      {/* Tabla de priorización con CVSS */}
      <div className="doc" style={{marginTop:'32px'}}>
        <h2>Priorización de vulnerabilidades — Criterio 3.1.3</h2>
        <p>
          Ordenadas por <strong>score de riesgo (P×I)</strong> y validadas con <strong>CVSS 3.1</strong>.
          Las rojas/naranja se atienden primero; las amarillas en segunda ronda; las verdes en ciclo normal de hardening.
        </p>
        <div className="cvss-table-wrap" style={{marginTop:'16px'}}>
          <table className="cvss-table">
            <thead>
              <tr><th>#</th><th>ID</th><th>Vulnerabilidad</th><th>P</th><th>I</th><th>P×I</th><th>CVSS</th><th>Nivel</th><th>Prioridad</th></tr>
            </thead>
            <tbody>
              {sortedFindings.map((f,idx) => {
                const cl = classify(f.prob * f.imp);
                return (
                  <tr key={f.id}>
                    <td style={{fontFamily:'var(--font-mono)',color:'var(--dim)'}}>{idx+1}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{f.id}</td>
                    <td style={{fontWeight:500}}>{f.name}</td>
                    <td style={{textAlign:'center'}}>{f.prob}</td>
                    <td style={{textAlign:'center'}}>{f.imp}</td>
                    <td style={{textAlign:'center',fontWeight:700,fontFamily:'var(--font-mono)'}}>{f.prob*f.imp}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontWeight:700}}>{f.cvss}</td>
                    <td><span className={`badge ${cl.cls}`}>{cl.level}</span></td>
                    <td style={{fontSize:'12px',color:'var(--muted)'}}>
                      {idx===0?'⚡ Inmediata':idx<3?'🔴 Urgente':idx<5?'🟡 Planificada':'🟢 Rutinaria'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
