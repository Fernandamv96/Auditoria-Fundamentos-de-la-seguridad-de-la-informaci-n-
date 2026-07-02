import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Resumen       from './components/Resumen.jsx';
import InyeccionSQL  from './components/InyeccionSQL.jsx';
import XSS           from './components/XSS.jsx';
import Comandos      from './components/Comandos.jsx';
import Activos       from './components/Activos.jsx';
import Matriz        from './components/Matriz.jsx';
import Controles     from './components/Controles.jsx';
import Recuperacion  from './components/Recuperacion.jsx';
import Prompts       from './components/Prompts.jsx';
import ExportPDF     from './components/ExportPDF.jsx';

const SECTIONS = [
  { path: '/resumen',      label: 'Resumen ejecutivo',  num: '01', Comp: Resumen },
  { path: '/sqli',         label: 'SQL Injection',       num: '02', Comp: InyeccionSQL },
  { path: '/xss',          label: 'XSS Reflected',       num: '03', Comp: XSS },
  { path: '/comandos',     label: 'Command Injection',   num: '04', Comp: Comandos },
  { path: '/activos',      label: 'Activos de info.',    num: '05', Comp: Activos },
  { path: '/matriz',       label: 'Matriz de riesgo',    num: '06', Comp: Matriz },
  { path: '/controles',    label: 'Controles',           num: '07', Comp: Controles },
  { path: '/recuperacion', label: 'Recuperación (DR)',   num: '08', Comp: Recuperacion },
  { path: '/prompts',      label: 'Prompts / IA',        num: '09', Comp: Prompts },
];

function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
  return null;
}

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">A</div>
        <div>
          <h1>Auditoria DVWA</h1>
        </div>
      </div>
      <div className="subtitle">fmv001 · TI3034 · INACAP</div>

      <div className="sidebar-section-label">Informe A</div>
      <nav>
        {SECTIONS.slice(0, 4).map(({ path, label, num }) => (
          <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-num">{num}</span>{label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-label">Informe B</div>
      <nav>
        {SECTIONS.slice(4, 9).map(({ path, label, num }) => (
          <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-num">{num}</span>{label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '12px', color: 'var(--dim)', fontSize: '11px' }}>
          TI3034 · Unidad 3 · 2025
        </div>
        <ExportPDF navigate={navigate} />
      </div>
    </aside>
  );
}

function PageWrapper({ children }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <div className="page-enter">{children}</div>;
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/resumen" replace />} />
          {SECTIONS.map(({ path, Comp }) => (
            <Route key={path} path={path} element={
              <PageWrapper><Comp /><ScrollReveal /></PageWrapper>
            } />
          ))}
          <Route path="*" element={<div><h1>404</h1></div>} />
        </Routes>
      </main>
    </div>
  );
}
