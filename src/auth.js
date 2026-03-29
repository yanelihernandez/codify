// Gestión de autenticación de usuarios

export function getAuth() {
    try {
        const data = localStorage.getItem('codify_auth');
        return data ? JSON.parse(data) : { loggedIn: false, username: 'Invitado' };
    } catch {
        return { loggedIn: false, username: 'Invitado' };
    }
}

export function setAuth(auth) {
    localStorage.setItem('codify_auth', JSON.stringify(auth));
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: auth }));
}

export function clearAuth() {
    localStorage.removeItem('codify_auth');
}

export function logout() {
    clearAuth();
    if (window.codify?.toast) {
        window.codify.toast('¡Hasta pronto! Has cerrado sesión');
    }
    window.location.href = 'home-public.html';
}


// Obtiene la clave para almacenar la foto de perfil del usuario actual
function getProfileImageKey() {
    const auth = getAuth();
    return auth.loggedIn ? `codify_profile_image_${auth.username}` : null;
}

// Guarda la foto de perfil del usuario actual
export function saveProfileImage(imageData) {
    const key = getProfileImageKey();
    if (!key) return false;

    localStorage.setItem(key, imageData);

    // Disparar evento para actualizar la UI
    window.dispatchEvent(new CustomEvent('profile-image:changed', {
        detail: { image: imageData }
    }));

    return true;
}

// Obtiene la foto de perfil del usuario actual
export function getProfileImage() {
    const key = getProfileImageKey();
    if (!key) return null;

    return localStorage.getItem(key);
}

// Elimina la foto de perfil del usuario actual
export function deleteProfileImage() {
    const key = getProfileImageKey();
    if (!key) return;

    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('profile-image:changed', { detail: { image: null } }));
}
