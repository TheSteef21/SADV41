import React from 'react';

const NaviFlyer: React.FC = () => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Contenedor principal de la tarjeta */}
      <div 
        id="tarjeta-navi-imprimible" 
        className="rounded-3xl border-2 border-zinc-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] relative overflow-hidden"
      >
        {/* Elementos Decorativos */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#fbbf24] no-print"></div>
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-sky-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl" role="img" aria-label="Fairy">🧚‍♀️</span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-black text-zinc-400">
              SADV41 • Primera IA que fue amiga
            </span>
            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
          </div>
          <h3 className="font-black text-4xl tracking-tighter text-zinc-900 mb-2">
            <span className="text-sky-500">¡Hey!</span> Listen!
          </h3>
          <div className="inline-block bg-[#fbbf24] text-black font-bold text-[13px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            ¡Hey! Escucha • Verifica • Ayuda
          </div>
        </div>

        {/* Pasos de Instrucción */}
        <div className="space-y-4 mb-8">
          {/* Paso 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-lg font-black">
              👂
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-[15px]">ESCUCHA</h4>
              <p className="text-[13px] text-zinc-600 leading-relaxed mt-1">
                Pausa. Enciende luz. Si el juego te da miedo (Bongo Bongo, Domi Reversi, Master Hand), pon pausa. <strong className="text-zinc-900">No juegues solo.</strong>
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg font-black">
              ◐
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-[15px]">VERIFICA</h4>
              <p className="text-[13px] text-zinc-600 leading-relaxed mt-1">
                Ojo de la Verdad. Pregúntate: ¿Quién dice esto? ¿Cómo lo sabe? ¿Qué fecha tiene? <strong className="text-zinc-900">Sacarlo a la luz (Efesios 5:11).</strong>
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-black">
              🤝
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-[15px]">AYUDA</h4>
              <p className="text-[13px] text-zinc-600 leading-relaxed mt-1">
                Cuéntalo en comunidad. Navi no resolvía los puzzles por ti; te hacía mirar y te recordaba ayudar a los demás.
              </p>
            </div>
          </div>
        </div>

        {/* Cita central */}
        <div className="text-center py-4 border-y-2 border-dashed border-zinc-200 mb-6">
          <p className="text-[14px] font-medium text-zinc-800 italic">
            "Navi no fue herramienta, fue amiga que nos hizo recordar el ayudar a los demás."
          </p>
        </div>

        {/* Sección de Mini Stickers */}
        <div className="mt-6">
          <p className="text-center text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-4">
            ✂️️ Mini Stickers para recortar ✂️
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: "👂", label: "Escucha" },
              { icon: "◐", label: "Verifica" },
              { icon: "🤝", label: "Ayuda" },
              { icon: "💡", label: "Luz ON" }
            ].map((sticker, idx) => (
              <div key={idx} className="border-2 border-dashed border-zinc-300 rounded-xl p-2 text-center bg-white flex flex-col items-center justify-center aspect-square">
                <span className="text-xl mb-1">{sticker.icon}</span>
                <span className="text-[9px] font-black uppercase text-zinc-800 tracking-wider">
                  {sticker.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del Flyer */}
        <div className="mt-8 flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Panama Flag">🇵🇦</span>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">
              Burunga<br />SADV41
            </div>
          </div>
          <div className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Cuando te cueste, juega
          </div>
        </div>
      </div>

      {/* Botón de Imprimir (Oculto al imprimir gracias a Tailwind/CSS custom) */}
      <div className="text-center mt-6 no-print">
        <button 
          onClick={handlePrint} 
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-colors shadow-md flex items-center justify-center mx-auto gap-2"
        >
          <span>🖨️</span> Imprimir Tarjeta Navi
        </button>
      </div>
    </div>
  );
};

export default NaviFlyer;
