// Funciones reutilizables que no dependen de la lógica principal

export function calculateRating(professorId, opinions) {
    const professorOpinions = opinions.filter(
        o => o.professor_id === professorId
    );

    if (professorOpinions.length === 0) return 0;

    const sum = professorOpinions.reduce(
        (acc, op) => acc + op.rating, 0
    );

    // Redondear a 2 decimales
    return Math.round((sum / professorOpinions.length) * 100) / 100;
}

// Configura el menú lateral con funcionalidad de abrir/cerrar
export function setupAsideNavBar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const closeBtn = document.getElementById('close-aside');
    const aside = document.getElementById('aside-nav');

    // Si no existen los elementos necesarios, salimos
    if (!menuBtn || !closeBtn || !aside) {
        console.warn('setupAsideNavBar: Elementos del menú lateral no encontrados');
        return;
    }

    // Abrir menú
    menuBtn.addEventListener('click', () => {
        aside.classList.add('open');
    });

    // Cerrar menú con botón X
    closeBtn.addEventListener('click', () => {
        aside.classList.remove('open');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
        if (!aside.contains(event.target) && !menuBtn.contains(event.target)) {
            aside.classList.remove('open');
        }
    });
}
