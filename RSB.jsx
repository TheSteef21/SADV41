import React, { useState } from 'react';

const RSB = () => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const webhookUrl = "https://hook.us2.make.com/zjb9v8wrh7iy9fyh4a7m4d2jv4bniwus";

  const validarEnlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    if (!urlInput.trim()) {
      setErrorMsg("🔴 Error: Debes ingresar una URL válida para escanear.");
      setLoading(false);
      return;
    }

    try {
      // Verificación preliminar del cliente
      const urlObj = new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`);
      if (urlObj.hostname.length < 4 || !urlObj.hostname.includes('.')) {
        setErrorMsg("🔴 Rebotado: Dominio demasiado corto o sin estructura válida.");
        setLoading(false);
        return;
      }

      // Consulta al Webhook de Make
      const response = await fetch(`${webhookUrl}?url=${encodeURIComponent(urlObj.href)}`);
      
      if (!response.ok) {
        throw new Error("Respuesta no satisfactoria del webhook.");
      }

      const data = await response.json();

      if (data.web && data.web.results && data.web.results.length > 0) {
        setResult({
          status: 'verified',
          message: "🟢 VERIFICADO: Dominio indexado y con presencia en la red real.",
          count: data.web.results.length,
          data: data.web.results
        });
      } else if (data.verificado === true) {
        setResult({
          status: 'verified',
          message: "🟢 VERIFICADO: Confirmación positiva del radar.",
          count: 1
        });
      } else {
        setResult({
          status: 'rejected',
          message: "🔴 REBOTADO AL POZO: Enlace no indexado, sin peso o inexistente en el índice de Brave.",
          count: 0
        });
      }
    } catch (err) {
      setErrorMsg("⚠️ Fallo en la comunicación con la Mesa v2.1 o el Webhook.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#090A0F',
      color: '#E0E6ED',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      minHeight: '100vh',
      padding: '2rem 1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Encabezado Principal */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: '2.5rem',
            color: '#FFFFFF',
            letterSpacing: '3px',
            margin: 0
          }}>
            RADAR BRAVE SEARCH <span style={{ color: '#00FF66' }}>// V2.1</span>
          </h1>
          <p style={{ color: '#00FF66', fontSize: '0.9rem', letterSpacing: '2px', marginTop: '0.5rem' }}>
            BURUNGA ATRIO GUARD // MESA DE VERIFICACIÓN SADV41 🎚
          </p>
        </header>

        {/* Panel Interactivo de Pruebas */}
        <div style={{
          backgroundColor: '#0D111A',
          border: '1px solid #1A2035',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          marginBottom: '2.5rem'
        }}>
          <form onSubmit={validarEnlace} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <label htmlFor="url" style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#4A90E2' }}>
              Ingrese la URL a comprobar por el radar:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                id="url"
                placeholder="https://ejemplo.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '250px',
                  backgroundColor: '#050608',
                  border: '1px solid #2C3E50',
                  borderRadius: '6px',
                  padding: '0.8rem 1rem',
                  color: '#00FF66',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#333' : '#00FF66',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.8rem 1.8rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  letterSpacing: '1px'
                }}
              >
                {loading ? 'Escaneando...' : 'ESCANEAR'}
              </button>
            </div>
          </form>

          {/* Estado de Respuesta */}
          {errorMsg && (
            <div style={{
              marginTop: '1.2rem',
              padding: '1rem',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderLeft: '4px solid #FF3300',
              borderRadius: '4px',
              color: '#FF6666'
            }}>
              {errorMsg}
            </div>
          )}

          {result && (
            <div style={{
              marginTop: '1.2rem',
              padding: '1rem',
              backgroundColor: result.status === 'verified' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 51, 0, 0.1)',
              borderLeft: `4px solid ${result.status === 'verified' ? '#00FF66' : '#FF3300'}`,
              borderRadius: '4px',
              color: result.status === 'verified' ? '#00FF66' : '#FF6666'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{result.message}</p>
              {result.count > 0 && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                  Resultados indexados coincidentes: {result.count}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Diagrama SVG Vectorial - Trilogía de Verificación */}
        <div style={{
          backgroundColor: '#0D111A',
          border: '1px solid #1A2035',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            letterSpacing: '2px',
            color: '#8C9BAE',
            marginTop: 0,
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            ARQUITECTURA DE TRILOGÍA // V2.1
          </h2>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="100%" height="100%">
            <defs>
              <linearGradient id="atrioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A90E2"/>
                <stop offset="100%" stopColor="#003366"/>
              </linearGradient>

              <linearGradient id="santoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700"/>
                <stop offset="100%" stopColor="#FF8C00"/>
              </linearGradient>

              <linearGradient id="santisimoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FF66"/>
                <stop offset="100%" stopColor="#003311"/>
              </linearGradient>

              <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <rect width="900" height="500" fill="#090A0F" rx="15"/>
            
            <path d="M 200 250 L 450 250 L 700 250" stroke="#1A2035" strokeWidth="8"/>
            <path d="M 200 250 L 450 250 L 700 250" stroke="#00FF66" strokeWidth="2" strokeDasharray="8 6" opacity="0.6"/>

            {/* NODO 1: ATRIO */}
            <g transform="translate(200, 250)">
              <circle r="90" fill="#0D111A" stroke="#4A90E2" strokeWidth="4" filter="url(#glowLight)"/>
              <circle r="75" fill="none" stroke="#2C3E50" strokeWidth="2" strokeDasharray="6 4"/>
              <circle r="30" fill="url(#atrioGrad)"/>
              <path d="M -10 -5 L 0 5 L 10 -5" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <text y="125" fontFamily="'Impact', sans-serif" fontSize="18" fill="#4A90E2" textAnchor="middle" letterSpacing="2">I. ATRIO</text>
              <text y="145" fontFamily="'Arial', sans-serif" fontSize="12" fill="#8C9BAE" textAnchor="middle">RECEPTOR // MAKE WEBHOOK</text>
            </g>

            {/* NODO 2: SANTO */}
            <g transform="translate(450, 250)">
              <circle r="90" fill="#14100A" stroke="#FF8C00" strokeWidth="4" filter="url(#glowLight)"/>
              <circle r="75" fill="none" stroke="#553300" strokeWidth="2"/>
              <circle r="30" fill="url(#santoGrad)"/>
              <circle r="15" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="0" y1="-20" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="2"/>
              <text y="125" fontFamily="'Impact', sans-serif" fontSize="18" fill="#FF8C00" textAnchor="middle" letterSpacing="2">II. SANTO</text>
              <text y="145" fontFamily="'Arial', sans-serif" fontSize="12" fill="#D4A359" textAnchor="middle">RADAR // BRAVE API SEARCH</text>
            </g>

            {/* NODO 3: SANTÍSIMO */}
            <g transform="translate(700, 250)">
              <circle r="90" fill="#0A140F" stroke="#00FF66" strokeWidth="4" filter="url(#glowLight)"/>
              <circle r="75" fill="none" stroke="#005522" strokeWidth="2" strokeDasharray="10 4"/>
              <circle r="30" fill="url(#santisimoGrad)"/>
              <text y="8" fontFamily="'Arial', sans-serif" fontWeight="900" fontSize="24" fill="#FFFFFF" textAnchor="middle">🟢</text>
              <text y="125" fontFamily="'Impact', sans-serif" fontSize="18" fill="#00FF66" textAnchor="middle" letterSpacing="2">III. SANTÍSIMO</text>
              <text y="145" fontFamily="'Arial', sans-serif" fontSize="12" fill="#77DD99" textAnchor="middle">VEREDICTO // MESA V2.1 🎚</text>
            </g>

            <text x="450" y="50" fontFamily="'Impact', 'Arial Black', sans-serif" fontSize="24" fill="#FFFFFF" textAnchor="middle" letterSpacing="4">
              TRILOGÍA DE VERIFICACIÓN // MESA V2.1
            </text>
            <text x="450" y="75" fontFamily="'Arial', sans-serif" fontSize="12" fill="#00FF66" textAnchor="middle" letter-spacing="2">
              BURUNGA ATRIO GUARD // SADV41
            </text>
          </svg>
        </div>

      </div>
    </div>
  );
};

export default RSB;
