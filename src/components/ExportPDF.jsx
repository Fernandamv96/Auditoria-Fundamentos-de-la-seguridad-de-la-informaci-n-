import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Todas las secciones en orden para el PDF
const SECTIONS = [
  { path: '/resumen',      label: 'Resumen Ejecutivo' },
  { path: '/sqli',         label: 'SQL Injection' },
  { path: '/xss',          label: 'XSS Reflected' },
  { path: '/comandos',     label: 'Command Injection' },
  { path: '/activos',      label: 'Activos de Información' },
  { path: '/matriz',       label: 'Matriz de Riesgo' },
  { path: '/controles',    label: 'Controles' },
  { path: '/recuperacion', label: 'Recuperación (DR)' },
  { path: '/prompts',      label: 'Prompts / IA' },
];

export default function ExportPDF({ navigate }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const exportPDF = async () => {
    setLoading(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageW = 210;
      const pageH = 297;
      const margin = 12;
      const contentW = pageW - margin * 2;

      // ── Portada ──────────────────────────────────────
      pdf.setFillColor(6, 8, 16);
      pdf.rect(0, 0, pageW, pageH, 'F');

      // Acento superior
      pdf.setFillColor(0, 245, 212);
      pdf.rect(margin, 20, 6, 40, 'F');

      pdf.setTextColor(0, 245, 212);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TI3034 · FUNDAMENTOS DE SEGURIDAD DE LA INFORMACIÓN', margin + 10, 28);

      pdf.setTextColor(232, 236, 255);
      pdf.setFontSize(28);
      pdf.text('Auditoría de', margin + 10, 50);
      pdf.text('Seguridad Web', margin + 10, 62);

      pdf.setTextColor(0, 245, 212);
      pdf.setFontSize(14);
      pdf.text('DVWA · React · Vercel', margin + 10, 76);

      pdf.setTextColor(107, 119, 168);
      pdf.setFontSize(10);
      pdf.text('Análisis de vulnerabilidades web con explotación controlada,', margin + 10, 88);
      pdf.text('matriz de riesgo CVSS y plan de recuperación ante incidentes.', margin + 10, 94);

      // Info box
      pdf.setFillColor(12, 15, 26);
      pdf.roundedRect(margin + 10, 108, contentW - 10, 50, 3, 3, 'F');
      pdf.setDrawColor(30, 40, 71);
      pdf.roundedRect(margin + 10, 108, contentW - 10, 50, 3, 3, 'S');

      const infoY = 120;
      const rows = [
        ['Estudiante', 'Fernanda MV'],
        ['Empresa auditada', 'INACAP Valparaíso'],
        ['Docente', 'Rubén Schnettler'],
        ['Ponderación', '60% nota final'],
        ['Entorno de pruebas', 'DVWA — Damn Vulnerable Web Application'],
      ];
      rows.forEach(([k, v], i) => {
        pdf.setTextColor(58, 69, 112);
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.text(k.toUpperCase(), margin + 16, infoY + i * 8);
        pdf.setTextColor(232, 236, 255);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(v, margin + 56, infoY + i * 8);
      });

      // Hallazgos chips
      const chips = [
        { t: 'SQL Injection  CVSS 9.1', r: '🔴' },
        { t: 'Command Injection  CVSS 9.8', r: '🔴' },
        { t: 'XSS Reflected  CVSS 6.1', r: '🟠' },
      ];
      chips.forEach((ch, i) => {
        const cx = margin + 10 + i * 60;
        pdf.setFillColor(16, 21, 42);
        pdf.roundedRect(cx, 170, 57, 10, 2, 2, 'F');
        pdf.setDrawColor(255, 77, 109);
        pdf.roundedRect(cx, 170, 57, 10, 2, 2, 'S');
        pdf.setTextColor(255, 77, 109);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(ch.t, cx + 4, 176.5);
      });

      // Línea inferior + footer
      pdf.setDrawColor(30, 40, 71);
      pdf.line(margin, 268, pageW - margin, 268);
      pdf.setTextColor(58, 69, 112);
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('INACAP Valparaíso · Unidad 3 · 2025 · fmv001', margin, 274);
      pdf.text('github.com/Fernandamv96/Auditoria-Fundamentos-de-la-seguridad-de-la-informaci-n-', margin, 280);

      // ── Capturar cada sección ────────────────────────
      const mainEl = document.querySelector('.content');
      if (!mainEl) throw new Error('No se encontró .content');

      for (let i = 0; i < SECTIONS.length; i++) {
        const sec = SECTIONS[i];
        setProgress(`Exportando ${i + 1}/${SECTIONS.length}: ${sec.label}...`);

        // Navegar a la sección
        navigate(sec.path);
        await new Promise(r => setTimeout(r, 600));

        // Capture
        const canvas = await html2canvas(mainEl, {
          scale: 1.8,
          useCORS: true,
          backgroundColor: '#060810',
          logging: false,
          windowWidth: mainEl.scrollWidth,
          windowHeight: mainEl.scrollHeight,
          scrollX: 0,
          scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.88);
        const imgW = canvas.width;
        const imgH = canvas.height;

        // Calcular cuántas páginas necesita esta sección
        const ratio = contentW / (imgW / 1.8);
        const renderedH = (imgH / 1.8) * ratio;
        const maxH = pageH - margin * 2 - 18; // espacio para header de sección

        const totalPages = Math.ceil(renderedH / maxH);

        for (let p = 0; p < totalPages; p++) {
          pdf.addPage();
          pdf.setFillColor(6, 8, 16);
          pdf.rect(0, 0, pageW, pageH, 'F');

          // Header de sección
          pdf.setFillColor(0, 245, 212);
          pdf.rect(margin, margin, 4, 10, 'F');
          pdf.setTextColor(0, 245, 212);
          pdf.setFontSize(7.5);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${String(i + 1).padStart(2, '0')} — ${sec.label.toUpperCase()}`, margin + 8, margin + 7);

          // Número de página
          pdf.setTextColor(58, 69, 112);
          pdf.setFontSize(7);
          pdf.text(`Pág. ${pdf.internal.getNumberOfPages()}`, pageW - margin - 12, margin + 7);

          // Línea divisoria
          pdf.setDrawColor(30, 40, 71);
          pdf.line(margin, margin + 12, pageW - margin, margin + 12);

          // Calcular el crop de la imagen para esta página
          const srcScale = 1.8;
          const srcPageH = (maxH / ratio) * srcScale;
          const srcOffsetY = p * srcPageH;

          // Crear canvas recortado
          const cropCanvas = document.createElement('canvas');
          const cropH = Math.min(srcPageH, imgH - srcOffsetY);
          cropCanvas.width = imgW;
          cropCanvas.height = cropH;
          const ctx = cropCanvas.getContext('2d');
          ctx.fillStyle = '#060810';
          ctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
          ctx.drawImage(canvas, 0, -srcOffsetY);
          const cropData = cropCanvas.toDataURL('image/jpeg', 0.88);

          const cropRenderedH = (cropH / srcScale) * ratio;
          pdf.addImage(
            cropData, 'JPEG',
            margin, margin + 14,
            contentW, Math.min(cropRenderedH, maxH)
          );

          // Footer
          pdf.setDrawColor(30, 40, 71);
          pdf.line(margin, pageH - margin - 4, pageW - margin, pageH - margin - 4);
          pdf.setTextColor(58, 69, 112);
          pdf.setFontSize(6.5);
          pdf.text('TI3034 · Auditoría DVWA · Fernanda MV · INACAP Valparaíso', margin, pageH - margin);
        }
      }

      // ── Tabla de contenidos (insertar en página 2) ───
      // (se deja al final para no complicar la paginación)

      setProgress('Guardando PDF...');
      pdf.save('Informe_Auditoria_DVWA_fmv001.pdf');
      setProgress('');
    } catch (err) {
      console.error(err);
      setProgress('Error al exportar. Intenta de nuevo.');
      setTimeout(() => setProgress(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={exportPDF}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: loading ? 'var(--panel)' : 'linear-gradient(135deg, var(--teal), #00c4a8)',
          border: 'none',
          borderRadius: '8px',
          color: loading ? 'var(--muted)' : '#000',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all .2s',
          whiteSpace: 'nowrap',
          boxShadow: loading ? 'none' : '0 0 16px rgba(0,245,212,.3)',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--dim)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
            Exportando...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar PDF
          </>
        )}
      </button>

      {/* Progress toast */}
      {progress && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--panel)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '12px 18px',
          fontSize: '13px',
          color: 'var(--text)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeUp .25s ease',
        }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--dim)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
          {progress}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
