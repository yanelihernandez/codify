// Gestión de favoritos por usuario
import { getAuth } from './auth.js';

function getFavoritesKey() {
    const auth = getAuth();
    return auth.loggedIn ? `codify_favorites_${auth.username}` : null;
}

export function getFavorites() {
    try {
        const key = getFavoritesKey();
        if (!key) return [];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    const key = getFavoritesKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(favorites));
}

export function isFavorite(professorId) {
    return getFavorites().includes(Number(professorId));
}

export function addFavorite(professorId) {
    const favorites = getFavorites();
    const id = Number(professorId);
    if (!favorites.includes(id)) {
        favorites.push(id);
        saveFavorites(favorites);
    }
}

export function removeFavorite(professorId) {
    const id = Number(professorId);
    const favorites = getFavorites().filter(favId => favId !== id);
    saveFavorites(favorites);
}
