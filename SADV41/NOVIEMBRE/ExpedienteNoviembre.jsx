import React, { useState } from 'react';
import { Flag, FileText, Anchor, Shield, Globe, ChevronRight, Lock } from 'lucide-react';

export default function ExpedienteNoviembre() {
  const [activeTab, setActiveTab] = useState('carta');

  const cartaData = {
    fecha: "3 de Noviembre, 2026",
    remitente: "Donald J. Trump",
    destinatario: "José Raúl Mulino, Presidente de Panamá",
    asunto: "123 Años de Vida Republicana y Alianza Estratégica"
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-mono selection:bg-blue-900 selection:text-blue-100">
      {/* Encabezado Táctico */}
      <header className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-2 text-sm">
              <Shield size={16} />
              <span>SADV41 / TSEC / AZUERO-SONÁ</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              Expediente Noviembre 2026
            </h1>
            <p className="text-slate-400 mt-2">
              Análisis Geopolítico: Mes de la Patria y Relaciones Bilaterales
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-4xl font-black text-slate-800">123</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Años de República</div>
          </div>
        </div>
      </header>

      {/* Navegación Interna */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('carta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'carta' ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
          }`}
        >
          <FileText size={18} />
          <span>La Carta (Trump-Mulino)</span>
        </button>
        <button 
          onClick={() => setActiveTab('geopolitica')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'geopolitica' ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
          }`}
        >
          <Globe size={18} />
          <span>Impacto Soberano y Puertos</span>
        </button>
      </div>

      {/* Contenido Principal */}
      <main>
        {activeTab === 'carta' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metadatos del Documento */}
            <div className="col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-lg">
              <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Lock size={14} /> Metadatos del Documento
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="block text-slate-500 text-xs">Fecha de Emisión</span>
                  <span className="text-slate-200">{cartaData.fecha}</span>
                </li>
                <li>
                  <span className="block text-slate-500 text-xs">Remitente</span>
                  <span className="text-blue-400 font-semibold">{cartaData.remitente}</span>
                </li>
                <li>
                  <span className="block text-slate-500 text-xs">Destinatario</span>
                  <span className="text-slate-200">{cartaData.destinatario}</span>
                </li>
                <li>
                  <span className="block text-slate-500 text-xs">Contexto Histórico</span>
                  <span className="text-slate-200">123º Aniversario de la Separación de Colombia</span>
                </li>
              </ul>
            </div>

            {/* Análisis del Contenido */}
            <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-lg">
              <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Flag size={14} /> Exégesis del Mensaje
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    La misiva oficial enviada con motivo de las efemérides patrias trasciende el protocolo diplomático habitual. Representa un punto de convergencia en la línea de tiempo geopolítica de 2026, estableciendo posturas claras sobre la región interoceánica.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-400">#Diplomacia</span>
                    <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-400">#SeguridadHemisférica</span>
                    <span className="px-2 py-1 bg-blue-900/30 border border-blue-800/50 text-xs rounded text-blue-400">#SADV41</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geopolitica' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel Canal y Puertos */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Anchor size={24} />
                <h2 className="text-lg font-semibold">Puertos de Balboa y Cristóbal</h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                La evaluación táctica (TSEC) sobre la infraestructura portuaria destaca el fallo soberano y las implicaciones de control. La carta subraya la necesidad de asegurar las terminales de ambas entradas del Canal frente a inversiones extranjeras concurrentes que puedan comprometer la neutralidad o seguridad de la vía.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-500"/> Auditoría de concesiones portuarias.</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-500"/> Monitoreo logístico transístmico.</li>
              </ul>
            </div>

            {/* Panel Inversiones Bilaterales */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Globe size={24} />
                <h2 className="text-lg font-semibold">Alianza de Inversión y Seguridad</h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Más allá del saludo protocolar, el documento plantea un esquema de reforzamiento bilateral. Se anticipa un reajuste en los protocolos de inversión directa, buscando desplazar la dependencia de capitales de riesgo asiáticos en favor de consorcios con estándares de seguridad compartidos.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-500"/> Revisión de capitales en Azuero-Soná.</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-500"/> Integración tecnológica conjunta.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
