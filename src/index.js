// Punto de entrada.
// Carga dinámicamente los templates.

async function loadTemplates() {
    const elements = document.querySelectorAll('[xlu-include-file]');

    // Si no hay más elementos por cargar, terminamos
    if (elements.length === 0) {
        return;
    }

    const el = elements[0];
    const file = el.getAttribute('xlu-include-file');

    try {
        const response = await fetch(file);
        if (response.ok) {
            const content = await response.text();
            const newEl = el.cloneNode(false);
            newEl.removeAttribute('xlu-include-file');
            newEl.innerHTML = content;
            el.parentNode.replaceChild(newEl, el);
            return loadTemplates(); // Continuar con el siguiente elemento
        }
    } catch (err) {
        console.error('Error cargando template:', file, err);
        el.removeAttribute('xlu-include-file');
        return loadTemplates();
    }
}

// Iniciar la carga de templates cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadTemplates);
