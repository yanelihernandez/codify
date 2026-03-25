// Carga header, footer y templates desde archivos HTML
async function loadHTML(filePath, targetId = null) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error("Error cargando:", filePath);
            return;
        }

        const text = await response.text();
        const temp = document.createElement("div");
        temp.innerHTML = text;
        const template = temp.querySelector("template");

        // Si es un template (como profesor-card), lo añadimos al body
        if (template) {
            const existing = document.getElementById(template.id);
            if (!existing) {
                document.body.appendChild(template);
            }
            return template;
        }

        // Si es header o footer, lo insertamos en el elemento con ese id
        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = text;
            }
            // Después de cargar header/footer, reactivamos los eventos
            if (window.codify?.initCodifyUI) {
                window.codify.initCodifyUI();
            }
        }
    } catch (err) {
        console.error("Error en loadHTML:", err);
    }
}
