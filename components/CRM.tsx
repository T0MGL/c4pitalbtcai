import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { LogoV2 } from './LogoV2';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

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

  // --- MOCK DATA PARA DEMOSTRACIÓN VISUAL (Si falla la API o en Desarrollo) ---
  const MOCK_LEADS: Lead[] = [
    { id: '1', date: new Date().toISOString(), name: 'Carlos Mendoza', phone: '5215512345678', capital: '$5,000 - $10,000 USD', experience: 'Intermedio', goal: 'Vivir del Trading', status: 'new' },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), name: 'Sofia Rodriguez', phone: '34611223344', capital: 'Más de $10,000 USD', experience: 'Experto', goal: 'Patrimonio LP', status: 'contacted' },
    { id: '3', date: new Date(Date.now() - 172800000).toISOString(), name: 'Javier Silva', phone: '573001234567', capital: 'Menos de $1,000 USD', experience: 'Principiante', goal: 'Ingreso Extra', status: 'lost' },
    { id: '4', date: new Date(Date.now() - 250000000).toISOString(), name: 'Ana Lopez', phone: '13051234567', capital: '$1,000 - $5,000 USD', experience: 'Principiante', goal: 'Ahorro', status: 'new' },
  ];

  // Parse Spanish date format like "27/1/2026, 6:36:45 p. m." or "28/1/2026, 12:50:21 a. m."
  const parseSpanishDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();

    // If already ISO format, return as-is
    if (dateStr.includes('T') || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateStr;
    }

    try {
      // Format: "27/1/2026, 6:36:45 p. m." or "28/1/2026, 12:50:21 a. m."
      const isPM = dateStr.toLowerCase().includes('p. m.') || dateStr.toLowerCase().includes('pm');
      const isAM = dateStr.toLowerCase().includes('a. m.') || dateStr.toLowerCase().includes('am');

      // Remove AM/PM markers
      const cleanedStr = dateStr
        .replace(/\s*[ap]\.\s*m\.\s*/gi, '')
        .replace(/\s*[ap]m\s*/gi, '')
        .trim();

      // Split date and time
      const [datePart, timePart] = cleanedStr.split(',').map(s => s.trim());

      if (!datePart) return new Date().toISOString();

      // Parse date: "27/1/2026"
      const [day, month, year] = datePart.split('/').map(Number);

      // Parse time: "6:36:45" or "12:50:21"
      let hours = 0, minutes = 0, seconds = 0;
      if (timePart) {
        const timeParts = timePart.split(':').map(Number);
        hours = timeParts[0] || 0;
        minutes = timeParts[1] || 0;
        seconds = timeParts[2] || 0;

        // Convert to 24-hour format
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

  // Map Google Sheets Spanish columns to our Lead interface
  const mapSheetDataToLead = (row: Record<string, unknown>): Lead => {
    return {
      id: String(row.id || row.Id || row.ID || crypto.randomUUID()),
      date: parseSpanishDate(String(row.Fecha || row.fecha || row.date || '')),
      name: String(row.Nombre || row.nombre || row.name || ''),
      phone: String(row.WhatsApp || row.whatsapp || row.phone || row.Phone || ''),
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

    // DEV MODE CHECK: Si la URL es placeholder, usamos mock + local storage
    if (!GOOGLE_SCRIPT_URL) {
        console.warn("CRM en Modo Desarrollo: Usando datos locales y mock.");

        setTimeout(() => {
            let localLeads: Lead[] = [];
            try {
                // Recuperar leads guardados por el QualificationForm
                const stored = localStorage.getItem('capital_btc_crm_leads');
                if (stored) {
                    localLeads = JSON.parse(stored);
                }
            } catch(e) { console.error("Error reading local leads", e); }

            // Merge local leads with mock leads
            const allLeads = [...localLeads, ...MOCK_LEADS];

            // Sort by date desc (Most recent first)
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
          // Map the data from Google Sheets format to our Lead format
          const mappedLeads = data.map(mapSheetDataToLead);
          // Sort by date descending (most recent first)
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
    // Optimistic Update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

    if (!GOOGLE_SCRIPT_URL) return; // No intentar enviar a placeholder

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
      switch(status) {
          case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
          case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
          case 'converted': return 'bg-brand-green/20 text-brand-green border-brand-green/50';
          case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/50';
          default: return 'bg-slate-500/20 text-slate-400';
      }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 font-sans">
      {/* HEADER */}
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
                  
                  <Button onClick={handleBackToSite} variant="secondary" className="!py-1.5 !px-3 md:!px-4 text-[10px] md:text-xs">
                      ← Volver al Sitio
                  </Button>

                  <Button onClick={fetchLeads} className="!py-1.5 !px-3 md:!px-4 text-[10px] md:text-xs">
                      Actualizar
                  </Button>
              </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
          
          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                  { label: 'Total Leads', val: leads.length, color: 'text-white' },
                  { label: 'Nuevos', val: leads.filter(l => l.status === 'new').length, color: 'text-blue-400' },
                  { label: 'Contactados', val: leads.filter(l => l.status === 'contacted').length, color: 'text-brand-gold' },
                  { label: 'Cierre (Convertidos)', val: leads.filter(l => l.status === 'converted').length, color: 'text-brand-green' },
              ].map((stat, i) => (
                  <div key={i} className="bg-[#0B101B] border border-white/5 p-4 rounded-lg">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
                      <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.val}</p>
                  </div>
              ))}
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'new', 'contacted', 'converted', 'lost'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                        filterStatus === status 
                        ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                        : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                      {status === 'all' ? 'Todos' : status}
                  </button>
              ))}
          </div>

          {/* TABLE */}
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
                              <tr>
                                  <td colSpan={6} className="p-8 text-center text-slate-500 animate-pulse">Cargando datos...</td>
                              </tr>
                          ) : paginatedLeads.length === 0 ? (
                              <tr>
                                  <td colSpan={6} className="p-8 text-center text-slate-500">No hay leads en esta vista.</td>
                              </tr>
                          ) : (
                              paginatedLeads.map((lead) => (
                                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                                      {/* STATUS */}
                                      <td className="p-4">
                                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                                              {lead.status}
                                          </span>
                                      </td>
                                      
                                      {/* DATE */}
                                      <td className="p-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                                          {new Date(lead.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                          <br/>
                                          {new Date(lead.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                      </td>

                                      {/* LEAD INFO */}
                                      <td className="p-4">
                                          <div className="font-bold text-white">{lead.name}</div>
                                          <div className="text-xs text-brand-gold font-mono">{lead.phone}</div>
                                      </td>

                                      {/* PROFILE */}
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

                                      {/* GOAL (Truncated) */}
                                      <td className="p-4 max-w-[200px]">
                                          <p className="text-xs text-slate-400 truncate" title={lead.goal}>
                                              {lead.goal}
                                          </p>
                                      </td>

                                      {/* ACTIONS */}
                                      <td className="p-4 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                              {/* WhatsApp */}
                                              <button 
                                                onClick={() => openWhatsApp(lead)}
                                                className="p-2 bg-brand-green/10 text-brand-green border border-brand-green/30 rounded hover:bg-brand-green hover:text-brand-dark transition-all"
                                                title="Enviar WhatsApp"
                                              >
                                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                              </button>
                                              
                                              {/* Convert */}
                                              {lead.status !== 'converted' && (
                                                <button 
                                                    onClick={() => updateStatus(lead.id, 'converted')}
                                                    className="p-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded hover:bg-brand-gold hover:text-brand-dark transition-all"
                                                    title="Marcar como Convertido (Venta)"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </button>
                                              )}

                                              {/* Lost */}
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

              {/* PAGINATION */}
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