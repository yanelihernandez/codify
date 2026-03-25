function calculateRating(professorId, opiniones) {
    const opinionesProfesor = opiniones.filter(
        o => o.professor_id === professorId
    );

    if (opinionesProfesor.length === 0) return 0;

    const suma = opinionesProfesor.reduce(
        (acc, op) => acc + op.rating, 0
    );

    return suma / opinionesProfesor.length;
}

function setupAsideNavBar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const closeBtn = document.getElementById('close-aside');
    const aside = document.getElementById('aside-nav');

    menuBtn.addEventListener('click', () => {
        aside.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        aside.classList.remove('open');
    });

    document.addEventListener('click', (event) => {
        if (!aside.contains(event.target) && !menuBtn.contains(event.target)) {
            aside.classList.remove('open');
        }
    });
}
