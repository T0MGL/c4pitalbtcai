import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { LogoV2 } from './LogoV2';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

const COUNTRY_DATA: Record<string, { flag: string; name: string }> = {
  '1': { flag: '🇺🇸', name: 'USA / Puerto Rico / R. Dom' },
  '52': { flag: '🇲🇽', name: 'México' },
  '34': { flag: '🇪🇸', name: 'España' },
  '54': { flag: '🇦🇷', name: 'Argentina' },
  '57': { flag: '🇨🇴', name: 'Colombia' },
  '56': { flag: '🇨🇱', name: 'Chile' },
  '51': { flag: '🇵🇪', name: 'Perú' },
  '593': { flag: '🇪🇨', name: 'Ecuador' },
  '58': { flag: '🇻🇪', name: 'Venezuela' },
  '506': { flag: '🇨🇷', name: 'Costa Rica' },
  '507': { flag: '🇵🇦', name: 'Panamá' },
  '598': { flag: '🇺🇾', name: 'Uruguay' },
  '503': { flag: '🇸🇻', name: 'El Salvador' },
  '502': { flag: '🇬🇹', name: 'Guatemala' },
  '504': { flag: '🇭🇳', name: 'Honduras' },
  '591': { flag: '🇧🇴', name: 'Bolivia' },
  '595': { flag: '🇵🇾', name: 'Paraguay' },
};

const getCountryByPhone = (phone: string) => {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length >= 3 && COUNTRY_DATA[clean.substring(0, 3)]) return COUNTRY_DATA[clean.substring(0, 3)];
  if (clean.length >= 2 && COUNTRY_DATA[clean.substring(0, 2)]) return COUNTRY_DATA[clean.substring(0, 2)];
  if (clean.length >= 1 && COUNTRY_DATA[clean.substring(0, 1)]) return COUNTRY_DATA[clean.substring(0, 1)];
  return { flag: '🌐', name: 'Desconocido' };
};

interface Lead {
  id: string;
  date: string;
  name: string;
  phone: string;
  capital: string;
  experience: string;
  goal: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

export const CRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const CRM_PASSWORD = process.env.CRM_PASSWORD || 'capitalbtc2025';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CRM_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta');
    }
  };

  const MOCK_LEADS: Lead[] = [
    { id: '1', date: new Date().toISOString(), name: 'Carlos Mendoza', phone: '5215512345678', capital: '$5,000 - $10,000 USD', experience: 'Intermedio', goal: 'Vivir del Trading', status: 'new' },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), name: 'Sofia Rodriguez', phone: '34611223344', capital: 'Más de $10,000 USD', experience: 'Experto', goal: 'Patrimonio LP', status: 'contacted' },
    { id: '3', date: new Date(Date.now() - 172800000).toISOString(), name: 'Javier Silva', phone: '573001234567', capital: 'Menos de $1,000 USD', experience: 'Principiante', goal: 'Ingreso Extra', status: 'lost' },
    { id: '4', date: new Date(Date.now() - 250000000).toISOString(), name: 'Ana Lopez', phone: '13051234567', capital: '$1,000 - $5,000 USD', experience: 'Principiante', goal: 'Ahorro', status: 'new' },
  ];

  const parseSpanishDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();

    if (dateStr.includes('T') || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateStr;
    }

    try {
      const isPM = dateStr.toLowerCase().includes('p. m.') || dateStr.toLowerCase().includes('pm');
      const isAM = dateStr.toLowerCase().includes('a. m.') || dateStr.toLowerCase().includes('am');

      const cleanedStr = dateStr
        .replace(/\s*[ap]\.\s*m\.\s*/gi, '')
        .replace(/\s*[ap]m\s*/gi, '')
        .trim();

      const [datePart, timePart] = cleanedStr.split(',').map(s => s.trim());

      if (!datePart) return new Date().toISOString();

      const [day, month, year] = datePart.split('/').map(Number);

      let hours = 0, minutes = 0, seconds = 0;
      if (timePart) {
        const timeParts = timePart.split(':').map(Number);
        hours = timeParts[0] || 0;
        minutes = timeParts[1] || 0;
        seconds = timeParts[2] || 0;

        if (isPM && hours !== 12) {
          hours += 12;
        } else if (isAM && hours === 12) {
          hours = 0;
        }
      }

      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      return date.toISOString();
    } catch (e) {
      console.error('Error parsing date:', dateStr, e);
      return new Date().toISOString();
    }
  };

  const mapSheetDataToLead = (row: Record<string, unknown>): Lead => {
    return {
      id: String(row.id || row.Id || row.ID || crypto.randomUUID()),
      date: parseSpanishDate(String(row.Fecha || row.fecha || row.date || '')),
      name: String(row.Nombre || row.nombre || row.name || ''),
      phone: String(row.WhatsApp || row.whatsapp || row.phone || row.Phone || '').replace(/^'/, ''),
      capital: String(row.Capital || row.capital || ''),
      experience: String(row.Experiencia || row.experiencia || row.experience || ''),
      goal: String(row.Objetivo || row.objetivo || row.goal || ''),
      status: (row.Status || row.status || row.Estado || row.estado || 'new') as Lead['status'],
    };
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);

    if (!GOOGLE_SCRIPT_URL) {
      console.warn("CRM en Modo Desarrollo: Usando datos locales y mock.");

      setTimeout(() => {
        let localLeads: Lead[] = [];
        try {
          const stored = localStorage.getItem('capital_btc_crm_leads');
          if (stored) {
            const parsed = JSON.parse(stored);
            localLeads = Array.isArray(parsed) ? parsed.map(mapSheetDataToLead) : [];
          }
        } catch (e) { console.error("Error reading local leads", e); }

        const allLeads = [...localLeads, ...MOCK_LEADS];

        allLeads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setLeads(allLeads);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const mappedLeads = data.map(mapSheetDataToLead);
        mappedLeads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLeads(mappedLeads);
      } else {
        setLeads(MOCK_LEADS);
      }
    } catch (error) {
      console.error("Error fetching leads (usando mock data):", error);
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

    if (!GOOGLE_SCRIPT_URL) return;

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: id,
          field: 'status',
          value: newStatus
        })
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al sincronizar cambio de estado.");
    }
  };

  const openWhatsApp = (lead: Lead) => {
    if (lead.status === 'new') {
      updateStatus(lead.id, 'contacted');
    }

    const firstName = lead.name.split(' ')[0];
    const message = `Hola ${firstName}, soy del equipo de Capital BTC AI. 👋\n\nRevisé tu perfil de admisión:\n• Capital: ${lead.capital}\n• Experiencia: ${lead.experience}\n\nTu perfil encaja con nuestra estrategia privada. ¿Tienes 5 minutos para explicarte cómo funciona?`;

    const url = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    window.scrollTo(0, 0);
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = { new: 'Nuevo', contacted: 'Contactado', converted: 'Convertido', lost: 'Perdido' };
    return map[status] || status;
  };

  const getFileName = (ext: string) => {
    const date = new Date().toISOString().slice(0, 10);
    return `capital-btc-leads-${date}.${ext}`;
  };

  const exportToCSV = (data: Lead[]) => {
    if (data.length === 0) return;
    const headers = ['Estado', 'Fecha', 'Nombre', 'WhatsApp', 'Capital', 'Experiencia', 'Objetivo'];
    const rows = data.map(lead => [
      statusLabel(lead.status),
      new Date(lead.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      lead.name,
      lead.phone,
      lead.capital,
      lead.experience,
      lead.goal.replace(/,/g, ';'),
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFileName('csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async (data: Lead[]) => {
    if (data.length === 0) return;
    try {
      // @ts-ignore - dynamic import from esm.sh CDN
      const jsPDFModule = await import('https://esm.sh/jspdf@2.5.2');
      // @ts-ignore - dynamic import from esm.sh CDN
      const autoTableModule = await import('https://esm.sh/jspdf-autotable@3.8.4');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const autoTable = autoTableModule.default || autoTableModule.applyPlugin;

      const doc = new jsPDF({ orientation: 'landscape' });

      // Register autoTable plugin if needed
      if (typeof autoTable === 'function' && !(doc as any).autoTable) {
        autoTable(doc);
      }

      // Header
      doc.setFillColor(5, 8, 15);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
      doc.setTextColor(232, 193, 112);
      doc.setFontSize(18);
      doc.text('CAPITAL BTC AI', 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Reporte de Clientes', 14, 22);
      const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.text(`${today}  |  ${data.length} registros`, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });

      // Table
      const headers = [['Estado', 'Fecha', 'Nombre', 'WhatsApp', 'Capital', 'Experiencia', 'Objetivo']];
      const rows = data.map(lead => [
        statusLabel(lead.status),
        new Date(lead.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        lead.name,
        lead.phone,
        lead.capital,
        lead.experience,
        lead.goal,
      ]);

      (doc as any).autoTable({
        head: headers,
        body: rows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [11, 16, 27], textColor: [232, 193, 112], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 6: { cellWidth: 50 } },
      });

      doc.save(getFileName('pdf'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  };

  // --- FILTROS Y PAGINACIÓN ---
  const filteredLeads = useMemo(() => {
    if (filterStatus === 'all') return leads;
    return leads.filter(l => l.status === filterStatus);
  }, [leads, filterStatus]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'converted': return 'bg-brand-green/20 text-brand-green border-brand-green/50';
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <LogoV2 className="w-16 h-16 mx-auto mb-4" withText={false} />
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              CAPITAL BTC <span className="text-brand-gold">AI</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2">Panel de Gestión CRM</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0B101B] border border-white/10 rounded-xl p-6">
            <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05080f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/50 pr-12"
                placeholder="Ingresa la contraseña"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {authError && (
              <p className="text-red-400 text-xs mt-2">{authError}</p>
            )}

            <Button type="submit" className="w-full mt-4">
              Acceder al CRM
            </Button>
          </form>

          <button
            onClick={() => { window.location.hash = ''; window.scrollTo(0, 0); }}
            className="w-full text-center text-slate-500 hover:text-white text-xs mt-4 transition-colors"
          >
            ← Volver al sitio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 font-sans">
      <header className="bg-[#0B101B] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoV2 className="w-8 h-8" withText={false} />
            <h1 className="font-serif font-bold text-white tracking-wide">CAPITAL BTC <span className="text-brand-gold">CRM</span></h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs font-mono text-slate-500 hidden md:block">
              {!GOOGLE_SCRIPT_URL ? 'Modo Desarrollo (Mock Data)' : 'Conectado'}
            </span>

            <button
              onClick={() => exportToCSV(filteredLeads)}
              disabled={loading || filteredLeads.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-green border border-brand-green/30 bg-brand-green/10 rounded-lg hover:bg-brand-green hover:text-brand-dark transition-all disabled:opacity-40 disabled:pointer-events-none"
              title="Exportar CSV (Google Sheets)"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18M3 6h18M3 18h18" /></svg>
              <span className="hidden md:inline">CSV</span>
            </button>

            <button
              onClick={() => exportToPDF(filteredLeads)}
              disabled={loading || filteredLeads.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-400 border border-red-400/30 bg-red-400/10 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
              title="Exportar PDF"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span className="hidden md:inline">PDF</span>
            </button>

            <Button onClick={handleBackToSite} variant="secondary" className="!py-1.5 !px-3 md:!px-4 text-[10px] md:text-xs">
              ← Volver al Sitio
            </Button>

            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all disabled:pointer-events-none"
              title="Actualizar"
            >
              <svg
                className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', val: leads.length, color: 'text-white' },
            { label: 'Nuevos', val: leads.filter(l => l.status === 'new').length, color: 'text-blue-400' },
            { label: 'Contactados', val: leads.filter(l => l.status === 'contacted').length, color: 'text-brand-gold' },
            { label: 'Cierre (Convertidos)', val: leads.filter(l => l.status === 'converted').length, color: 'text-brand-green' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B101B] border border-white/5 p-4 rounded-lg">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
              {loading ? (
                <div className="h-8 w-12 bg-white/10 rounded animate-pulse mt-1"></div>
              ) : (
                <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.val}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'new', 'contacted', 'converted', 'lost'].map(status => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${filterStatus === status
                ? 'bg-brand-gold text-brand-dark border-brand-gold'
                : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30 hover:text-white'
                }`}
            >
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>

        <div className="bg-[#0B101B] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/10">
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Lead</th>
                  <th className="p-4">Perfil (Cap / Exp)</th>
                  <th className="p-4">Objetivo</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-5 w-16 bg-white/10 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-14 bg-white/10 rounded mb-1"></div>
                        <div className="h-3 w-10 bg-white/5 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-28 bg-white/10 rounded mb-1"></div>
                        <div className="h-3 w-24 bg-brand-gold/20 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="h-5 w-32 bg-white/5 rounded"></div>
                          <div className="h-5 w-24 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-36 bg-white/5 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-white/5 rounded"></div>
                          <div className="h-8 w-8 bg-white/5 rounded"></div>
                          <div className="h-8 w-8 bg-white/5 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No hay leads en esta vista.</td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                        {new Date(lead.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        <br />
                        {new Date(lead.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <div className="relative group/flag inline-block cursor-help">
                            <span className="text-lg leading-none">{getCountryByPhone(lead.phone).flag}</span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/flag:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                              {getCountryByPhone(lead.phone).name}
                            </div>
                          </div>
                          {lead.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="text-xs text-brand-gold font-mono">{lead.phone.replace(/^'/, '').startsWith('+') ? '' : '+'}{lead.phone.replace(/^'/, '')}</div>
                          <button
                            onClick={() => {
                              const fullPhone = (lead.phone.replace(/^'/, '').startsWith('+') ? '' : '+') + lead.phone.replace(/^'/, '');
                              navigator.clipboard.writeText(fullPhone);
                            }}
                            className="text-slate-500 hover:text-brand-gold transition-colors p-1 rounded hover:bg-white/5 active:scale-90"
                            title="Copiar número"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 w-fit">
                            💰 {lead.capital}
                          </span>
                          <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 w-fit">
                            🧠 {lead.experience}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 max-w-[200px]">
                        <p className="text-xs text-slate-400 truncate" title={lead.goal}>
                          {lead.goal}
                        </p>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openWhatsApp(lead)}
                            className="p-2 bg-brand-green/10 text-brand-green border border-brand-green/30 rounded hover:bg-brand-green hover:text-brand-dark transition-all"
                            title="Enviar WhatsApp"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                          </button>

                          {lead.status !== 'converted' && (
                            <button
                              onClick={() => updateStatus(lead.id, 'converted')}
                              className="p-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded hover:bg-brand-gold hover:text-brand-dark transition-all"
                              title="Marcar como Convertido (Venta)"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                          )}

                          {lead.status !== 'lost' && (
                            <button
                              onClick={() => updateStatus(lead.id, 'lost')}
                              className="p-2 bg-slate-800 text-slate-500 border border-slate-700 rounded hover:bg-red-500 hover:text-white transition-all"
                              title="Marcar como Perdido"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex justify-between items-center bg-[#05080f]">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-50"
              >
                &larr; Anterior
              </button>
              <span className="text-xs font-mono text-slate-500">Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-50"
              >
                Siguiente &rarr;
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};