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
