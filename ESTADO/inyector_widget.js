
// Snippet de inyección para Lapizasuli y USGS
(function() {
    const widgetContainer = document.createElement('div');
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '20px';
    widgetContainer.style.right = '20px';
    widgetContainer.style.zIndex = '9999';
    
    const iframe = document.createElement('iframe');
    iframe.src = 'widget_sadv41_inyectable.html';
    iframe.style.width = '350px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    
    widgetContainer.appendChild(iframe);
    document.body.appendChild(widgetContainer);
    console.log('[+] Widget Neopolítico SADV41 inyectado exitosamente.');
})();
