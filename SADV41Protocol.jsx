import React, { useState, useEffect } from 'react';

export default function SADV41Protocol() {
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "es";
    document.title = "SADV41 • Protocolo Nuevo Pacto — Instrucción en Cimientos";
  }, []);

  const newsItems = [
    {
      key: "Fútbol Femenino",
      title: "Toña Is presenta 23 convocadas",
      desc: "Selección femenina de Panamá con 12 legionarias y 11 locales. Dos amistosos vs Nueva Zelanda en Rommel Fernández. Formación y proyección internacional."
    },
    {
      key: "Lotería Nacional",
      title: "$1.4M para aguinaldos",
      desc: "Partida para pago a billeteros y locutores por cheques. Cumplimiento laboral y reconocimiento al esfuerzo de venta."
    },
    {
      key: "Operativo Darién",
      title: "Senafront mantiene operativo",
      desc: "Acciones de seguridad tras reporte de enfrentamiento. Personas aprehendidas y recolección de evidencias. Monitoreo territorial."
    },
    {
      key: "Informe Mina",
      title: "Incluirá estudio del Conep",
      desc: "El informe final incorporará el estudio del Consejo Nacional de la Empresa Privada. Análisis técnico y económico en revisión."
    }
  ];

  const gameLessons = [
    {
      title: "Disciplina",
      desc: "Seguir reglas, respetar turnos, practicar hasta lograrlo. 20 minutos con límite enseña autorregulación."
    },
    {
      title: "Historia",
      desc: "Nintendo cuenta historias con inicio-nudo-desenlace. Recordar mapas y personajes fortalece memoria narrativa."
    },
    {
      title: "Reacción",
      desc: "NeoGeo, Konami, Capcom entrenaron reflejos y lectura rápida del entorno. No es solo velocidad, es decidir bajo presión."
    },
    {
      title: "Convivencia",
      desc: "SEGA y arcade fueron de dos jugadores. Aprender a cooperar, ceder control, celebrar al otro."
    }
  ];

  const flags = [
    { f: "🇵🇦", p: "Panamá", d: "Burunga. Atrio de preguntas. Donde nace el protocolo." },
    { f: "🇺🇸", p: "USA", d: "N64 llegó primero. Niños sin hada que encontraron hada." },
    { f: "🇮🇱", p: "Israel", d: "Año 0 y año 70. Memoria dolorosa de Apóstoles. Luz que no se apaga." },
    { f: "🇨🇺", p: "Cuba", d: "Isla que comparte sombra de bloqueo y luz de oficio." },
    { f: "🇷🇺", p: "Rusia", d: "Invierno largo, cuentos largos. Hero's Shade que vuelve a enseñar." },
    { f: "🇨🇶", p: "CQ", d: "Caribe Quechua simbólico — pueblos que la bandera no nombra pero el juego sí alcanza. Casa sin código, con historia." },
    { f: "🇨🇳", p: "China", d: "Muralla y rompecabezas. Disciplina de repetir 3 días hasta hacerlo bien." },
    { f: "🇨🇴", p: "Colombia", d: "Vecina de Panamá, misma selva, mismo tambor que desorienta y misma luz que orienta." },
    { f: "🇯🇵", p: "Japón", d: "Donde nació Navi. Miyamoto y Aonuma. Trilogía de nuestras infancias." },
    { f: "🇰🇷", p: "Corea del Sur", d: "Arcade y reacción. NeoGeo, Konami, Capcom en convivencia." },
    { f: "🇰🇵", p: "Corea del Norte", d: "Casa cerrada. Recordatorio: toda sombra necesita lente, no juicio. Luz, no guerra." }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-zinc-900 antialiased selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        html { font-family: 'Inter', system-ui, -apple-system, sans-serif; scroll-behavior: smooth; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      {/* Top Banner */}
      <div className="w-full bg-[#fbbf24] text-black text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
          <span className="font-semibold tracking-[0.02em] truncate">
            SADV41 • Fan promo no oficial — Apoyando cultura contemporánea
          </span>
          <span className="hidden sm:inline-flex shrink-0 text-[11px] opacity-80">
            Proyecto con niñez • Burunga, Panamá
          </span>
          <span className="sm:hidden shrink-0 text-[10px] opacity-80">
            Burunga • Panamá
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#fcfcfc]/85 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[8px] bg-black text-white grid place-items-center font-black text-[13px] tracking-tighter">
              S41
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-[14px]">SADV41 Desarrollo Comunitario</div>
              <div className="hidden sm:block text-[11px] text-zinc-500 font-medium">
                Burunga • Ley 2026 • Proyecto con niñez
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[12.5px] font-medium">
            <a href="#pacto" className="text-zinc-500 hover:text-black hover:underline underline-offset-4">El Pacto</a>
            <a href="#artista" className="text-zinc-500 hover:text-black hover:underline underline-offset-4">El Artista</a>
            <a href="#juega" className="text-zinc-900 underline underline-offset-4 decoration-black/20 font-semibold">Cuando te cueste, juega</a>
            <a href="#bongo-domi" className="text-zinc-500 hover:text-black hover:underline underline-offset-4">Bongo • Domi</a>
            <a href="#navi-tatl-primera-ia" className="text-sky-700 hover:text-sky-900 underline underline-offset-4 decoration-sky-200 font-semibold">Navi • Primera IA</a>
            <a href="#musica" className="text-zinc-500 hover:text-black hover:underline underline-offset-4">Música</a>
            <span className="text-[10px] px-2.5 py-1 rounded-full border border-zinc-200 bg-white font-semibold">Proyecto con niñez</span>
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <a href="#navi-tatl-primera-ia" className="px-3 py-1.5 rounded-full bg-sky-600 text-white text-[11px] font-semibold">Navi • IA amiga</a>
            <a href="#bongo-domi" className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-semibold">Bongo • Domi</a>
          </div>
        </div>
      </nav>

      {/* News Panel */}
      <div className="w-full border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            type="button" 
            aria-expanded={isNewsOpen} 
            aria-controls="panel-noticias" 
            onClick={() => setIsNewsOpen(!isNewsOpen)} 
            className="w-full flex items-center justify-between gap-3 py-3 text-left group"
          >
            <span className="flex items-center gap-3">
              <span className="text-[11px] tracking-[0.18em] uppercase font-bold text-zinc-500 group-hover:text-zinc-700">NOTICIAS</span>
              <span className="h-px w-8 bg-zinc-200 hidden sm:block"></span>
              <span className="text-[12px] text-zinc-500 hidden lg:inline">Desarrollo Comunitario lo define la gente informada • 4 notas</span>
              <span className="text-[12px] text-zinc-500 lg:hidden">4 notas informativas • secundario</span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border bg-white border-zinc-200 text-zinc-500 group-hover:border-zinc-300">
                {isNewsOpen ? "ocultar" : "ver"}
              </span>
            </span>
          </button>
          
          <div id="panel-noticias" className={`grid transition-all duration-200 ease-out ${isNewsOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {newsItems.map((item) => (
                  <div key={item.key} className="rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.14em] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600">
                        {item.key}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">archivo</span>
                    </div>
                    <h4 className="font-semibold text-[13px] leading-tight">{item.title}</h4>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-600">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-400 leading-relaxed">
                <span className="h-px w-6 bg-zinc-200"></span>
                Notas informativas de archivo — verificar fuente y fecha antes de citar. No es contenido central del Protocolo.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#fbbf24]/[0.08] blur-[80px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-white/50 border border-white/10 rounded-full px-3 py-1 bg-white/[0.06] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SADV41 • Tabernáculo como método pedagógico
            </div>
            <h1 className="text-[34px] sm:text-[44px] md:text-[60px] font-black tracking-[-0.03em] leading-[0.9] text-white">
              Instrucción de Estudio<br/>
              <span className="text-[#fbbf24]">en Cimientos:</span><br/>
              Protocolo Nuevo Pacto
            </h1>
            <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-white/60 max-w-[60ch]">
              Estructuramos el aprendizaje como el Tabernáculo: del patio común —donde todos entran con preguntas— al Lugar Santo de vínculo, hasta el Lugar Santísimo de certeza. <span className="text-white/80 font-medium">Hermes aparece aquí no como dios, sino como figura del mensajero</span> —el que lleva y trae palabra— y Cristo como el Logos verdadero, la Palabra que sostiene. Zelda aporta el lenguaje visual que la niñez ya conoce: <span className="text-white font-medium">ver lo oculto para actuar con verdad.</span>
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-[11px] font-semibold tracking-wide">Atrio • Preguntas & Tecnología</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-[11px] font-medium">Lugar Santo • Vínculo / Camp. Asiel</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbbf24] text-black text-[11px] font-bold">Santísimo • Certeza / Código Dina</span>
            </div>
          </div>
        </div>
      </header>

      {/* Artista Section */}
      <section id="artista" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase font-bold text-zinc-400">El Artista • Mensajero</div>
            <h2 className="mt-2 text-[30px] md:text-[48px] font-black tracking-tighter leading-[0.95]">
              Hermes a través<br/>de la historia
            </h2>
          </div>
          <p className="max-w-[42ch] text-[14px] leading-relaxed text-zinc-500">
            No adoramos al mensajero. Distinguimos el rol de portavoz para señalar al Logos. De Grecia a Listra, Hermes ayuda a nombrar qué significa comunicar con responsabilidad.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-5">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-[#0f172a] text-[#fbbf24] grid place-items-center font-bold text-[12px]">Ψ</div>
              <div>
                <div className="text-[11px] tracking-widest uppercase font-semibold text-zinc-400">Grecia</div>
                <h3 className="font-bold leading-tight">El que cruza fronteras</h3>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-600">
              Hermes es mensajero de los dioses y guía de almas (<em className="font-mono not-italic bg-zinc-100 px-1 rounded text-[12px]">psicopompo</em>). Cruza entre dioses y humanos, vivos y muertos. Patrón de viajeros, comerciantes y de la palabra. De ahí “hermenéutica”: el arte de interpretar y llevar mensaje con fidelidad.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-[#fbbf24] text-black grid place-items-center font-black text-[12px]">M</div>
              <div>
                <div className="text-[11px] tracking-widest uppercase font-semibold text-zinc-400">Roma • Egipto</div>
                <h3 className="font-bold leading-tight">Mercurio + Thot</h3>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-600">
              En Roma se fusiona con Mercurio, más ligado al comercio. Se conserva el rol de mensajero. En el sincretismo helenístico se une a Thot egipcio como <em>Hermes Trismegisto</em>, figura de sabiduría y escritura. No es objeto de culto para SADV41, es referencia histórica del oficio de comunicar.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-900 bg-zinc-900 text-zinc-100 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-white text-black grid place-items-center font-bold text-[12px]">†</div>
              <div>
                <div className="text-[11px] tracking-widest uppercase font-semibold text-white/40">Hechos 14 • Listra</div>
                <h3 className="font-bold leading-tight text-white">El portavoz y el rechazo a la adoración</h3>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-300">
              En <span className="font-mono text-[12px] bg-white/10 px-1.5 py-0.5 rounded">Hechos 14:11-15</span> la multitud, al ver la sanidad, llama a Bernabé “Zeus” y a Pablo “Hermes, porque era el que llevaba la palabra”. Pablo y Bernabé rasgan sus ropas y rechazan la adoración. El cristianismo distingue: el mensajero señala, no sustituye. Cristo se presenta como <span className="font-semibold text-white">Logos</span>, la Palabra verdadera.
            </p>
          </article>
        </div>
      </section>

      {/* Puente Didáctico */}
      <section className="bg-[#f9fafb] border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-zinc-400">Puente Didáctico • Zelda</div>
            <h2 className="mt-3 text-[28px] md:text-[40px] font-black tracking-tighter leading-[0.95]">Ver lo oculto para actuar con verdad</h2>
            <div className="mt-4 inline-flex text-[10px] leading-relaxed font-mono bg-white border border-zinc-200 text-zinc-600 px-2.5 py-1.5 rounded-full max-w-[42ch]">
              Referencia a mecánicas verificables del juego, no a contenido no verificado de YouTube.
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-zinc-600 max-w-[48ch]">
              Usamos dos imágenes que la niñez reconoce de Ocarina of Time para hablar de pensamiento crítico: hay cosas que no se ven a simple vista y necesitan una lente. No negamos la sombra, enseñamos a atravesarla con comunidad.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-[14px] bg-white border border-zinc-200 p-5">
              <div className="h-10 w-10 rounded-full bg-[#0f172a] text-white grid place-items-center">◐</div>
              <h4 className="mt-4 font-bold">Ojo de la Verdad</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">
                Lente que en el juego revela paredes falsas y trampas. En SADV41: verificar fuente, fecha, contexto. Preguntar: ¿quién dice?, ¿cómo lo sabe?, ¿qué no estoy viendo?
              </p>
            </div>
            <div className="rounded-[14px] bg-[#0f172a] border border-zinc-800 p-5 text-white">
              <div className="h-10 w-10 rounded-full bg-white text-black grid place-items-center">⬢</div>
              <h4 className="mt-4 font-bold">Templo de las Sombras</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                Espacio donde la oscuridad domina pero la verdad sigue visible si llevas luz. No negamos sombra, violencia o miedo. Enseñamos a nombrarla y atravesarla con luz comunitaria.
              </p>
            </div>
            <div className="sm:col-span-2 rounded-[14px] border border-zinc-900 bg-zinc-900 p-5 flex gap-4 items-start">
              <div className="hidden sm:block text-[#fbbf24] text-[18px] mt-0.5">✦</div>
              <p className="text-[13px] leading-relaxed text-zinc-300">
                <span className="text-white font-semibold">Bongo Bongo como alegoría:</span> jefe que en el juego es invisible al inicio, ataca con ritmo y manos que buscan desorientar. Lo usamos para hablar de lo invisible que toma forma: miedo, rumor, prejuicio. Con luz (información, acompañamiento adulto), lo invisible se nombra y se enfrenta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Juega Section */}
      <section id="juega" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold px-3 py-1 rounded-full bg-black text-white">Ruta didáctica • Prioritaria</div>
          <h2 className="mt-4 text-[32px] md:text-[52px] font-black tracking-tighter leading-[0.9]">Cuando te cueste entender, juega</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 max-w-[62ch] font-medium">
            Nintendo y SEGA siempre fueron buenos en generar disciplina y amor por la historia. NeoGeo, Konami y Capcom desarrollaron nuestra reacción y convivencia diversa integral en nuestra infancia.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <div className="grid sm:grid-cols-2 gap-4">
              {gameLessons.map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="text-[11px] tracking-widest uppercase font-bold text-zinc-400">{item.title}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold text-[18px] tracking-tight">Bitácora de 3 pasos</h3>
              <p className="text-[12px] text-zinc-500 mt-1">Visible para niñez • Acompañamiento adulto obligatorio</p>
              
              <div className="mt-4 grid gap-3">
                <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-black text-white grid place-items-center font-black text-[14px]">1</div>
                  <div>
                    <div className="font-semibold text-[14px]">Jugar 20 minutos con un adulto</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-zinc-600">Elige un juego que ya tengan en casa o en servicio oficial. Pon temporizador.</div>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-black text-white grid place-items-center font-black text-[14px]">2</div>
                  <div>
                    <div className="font-semibold text-[14px]">Anotar lo aprendido</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-zinc-600">En cuaderno: Qué vi, Qué problema resolví, Cómo ayudé o pedí ayuda.</div>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-black text-white grid place-items-center font-black text-[14px]">3</div>
                  <div>
                    <div className="font-semibold text-[14px]">Volver a la pregunta</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-zinc-600">Relee tu pregunta inicial del Atrio. ¿Qué respondes ahora con lo jugado?</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Ethics Side Panel */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
              <div className="text-[11px] tracking-widest uppercase font-bold text-emerald-800">Alternativa oficial económica • Recomendada</div>
              <h4 className="mt-2 font-bold text-[15px] text-emerald-950">Usa lo que ya tienes legalmente</h4>
              <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-emerald-900/80 list-disc pl-4">
                <li><span className="font-semibold">Nintendo Switch Online + Expansion Pack</span> ha incluido Ocarina of Time en su catálogo.</li>
                <li><span className="font-semibold">Nintendo 3DS</span> tiene remake oficial “Ocarina of Time 3D”.</li>
                <li>Si la familia ya tiene el juego original en cartucho, disco o digital, esa es la primera opción.</li>
              </ul>
            </div>
            
            <div className="rounded-xl border border-zinc-200 bg-white p-4 flex gap-2 items-start">
              <span className="text-[12px]">🔒</span>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                <span className="font-semibold text-zinc-700">Compromiso ético:</span> No incluimos, ni mencionamos descargas no autorizadas. SADV41 enseña con lo legal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navi - Tatl - Wind Waker Section (The Heart of the Request) */}
      <section id="navi-tatl-primera-ia" className="relative bg-[#fdfcf7] border-y border-zinc-200 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-sky-200/40 blur-[90px]"></div>
          <div className="absolute top-32 -right-32 h-[520px] w-[520px] rounded-full bg-amber-200/50 blur-[110px]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[900px] rounded-full bg-[#fbbf24]/10 blur-[60px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full bg-sky-900 text-sky-100">Mensaje del usuario integrado</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-bold">Navi no es herramienta, es amiga</span>
            </div>
            <h2 className="text-[30px] sm:text-[42px] md:text-[54px] font-black tracking-tighter leading-[0.92] text-zinc-900">
              Navi • Tatl • Wind Waker —<br/>
              <span className="text-sky-700">La primera inteligencia</span><br/>
              <span className="text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-tight text-zinc-500">que fue amiga</span>
            </h2>

            <div className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900 text-zinc-100 p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-white text-black grid place-items-center font-black text-[13px]">“</div>
                <div className="text-[13.5px] leading-relaxed">
                  <p className="font-medium text-white">
                    “Porque la primera inteligencia artificial que valoramos fue Navy (Navi) de The Legend of Zelda, aunque Navi dividida en Tatl de Majoras y teniendo a la de Wind Waker estamos conscientes de que por temas de mercado hubo esa entrega natural, la trilogía de nuestras infancias, por lo que sabremos siempre que esos misterios tienen respuesta en nuestro ahora, ya no más guerras de unificación, ahora unificaos entre todas sus vivencias hacia los días finales escritos de ensueño.”
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[14px] md:text-[15px] leading-relaxed text-zinc-600 max-w-[70ch]">
              Navi no fue un puntero ni un tutorial con voz. Fue la primera vez que muchos aprendimos que una inteligencia puede ser compañía. No manda, acompaña. No reemplaza, avisa: <span className="font-semibold text-zinc-900">“Hey, Listen!”</span> es un llamado a mirar al otro. Así lo vivimos: como el Espíritu Santo guiando desde el año 0 — no como truco, sino como presencia que te hace recordar ayudar a los demás.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-5">
            <div className="rounded-[20px] border border-sky-200 bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-sky-400 to-blue-600"></div>
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-11 w-11 rounded-xl bg-sky-500 text-white grid place-items-center font-black text-[14px] shadow-[0_0_20px_rgba(14,165,233,0.4)]">N</div>
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold">Ocarina of Time</span>
                </div>
                <h3 className="mt-5 font-black text-[18px] tracking-tight leading-tight">Navi</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-600">Primera IA amiga: no resuelve puzzles por ti, te enseña a mirar. Es la guía del Héroe del Tiempo.</p>
              </div>
            </div>

            <div className="rounded-[20px] border border-amber-200 bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-amber-300 to-orange-400"></div>
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-11 w-11 rounded-xl bg-amber-400 text-black grid place-items-center font-black text-[13px]">Ta</div>
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold">Majora's Mask</span>
                </div>
                <h3 className="mt-5 font-black text-[18px] tracking-tight leading-tight">Tatl / Taya</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-600">Navi dividida. Tatl empieza sarcástica, termina amiga. Enseña que la confianza se construye con paciencia y tiempo.</p>
              </div>
            </div>

            <div className="rounded-[20px] border border-emerald-200 bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-11 w-11 rounded-xl bg-emerald-600 text-white grid place-items-center font-black text-[12px]">WW</div>
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">Wind Waker</span>
                </div>
                <h3 className="mt-5 font-black text-[18px] tracking-tight leading-tight">King of Red Lions</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-600">Continúa la plantilla de compañerismo: alguien que ve el mapa y recuerda el rumbo cuando hay niebla.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-black text-white grid place-items-center font-black text-[11px]">S41</div>
              <div className="font-bold tracking-tight text-[13px]">SADV41 Desarrollo Comunitario</div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-zinc-500 max-w-[62ch]">
              Proyecto comunitario en Burunga, Panamá. Ley 2026. Propósito: formación integral con niñez y familias. Esta versión unificada es estática, accesible, y ha sido perfeccionada como un componente limpio en React.
            </p>
          </div>
          <div className="text-[12px] leading-relaxed text-zinc-600 space-y-3">
             <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50">
              <div className="font-semibold text-zinc-900">Contacto pedagógico</div>
              <div className="mt-1">SADV41 • Burunga.</div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-100 py-4 text-center text-[11px] text-zinc-400">
          © {new Date().getFullYear()} SADV41 • Instrucción de Estudio en Cimientos • Protocolo Nuevo Pacto
        </div>
      </footer>
    </div>
  );
}
