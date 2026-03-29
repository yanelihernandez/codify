// Inicialización global y configuración de eventos
import { getAuth, logout, setAuth, clearAuth, getProfileImage, saveProfileImage, deleteProfileImage } from './auth.js';
import { getFavorites, isFavorite, addFavorite, removeFavorite } from './favorites.js';
import { toast, updateHeader, initDropdownMenu } from './ui.js';
import { setupAsideNavBar } from './utils.js';

// Botones de favoritos
function bindFavButtons() {
    const favBtns = document.querySelectorAll('.fav-btn');
    if (favBtns.length === 0) return;

    const auth = getAuth();

    favBtns.forEach(btn => {
        const card = btn.closest('.best-professor-card, .professor-card, .card, article');
        const profileLink = card?.querySelector('.see-profile-btn, .see-profile');
        let professorId = null;

        if (profileLink) {
            const href = profileLink.getAttribute('href') || '';
            const match = href.match(/id=(\d+)/);
            if (match) professorId = Number(match[1]);
        }

        const inFavSection = !!btn.closest('.fav-professors-content');

        if (!auth.loggedIn) {
            btn.classList.add('guest-mode');
            btn.classList.remove('liked');
            btn.setAttribute('aria-pressed', 'false');
            btn.textContent = '♡';
        } else {
            btn.classList.remove('guest-mode');
            const liked = professorId !== null && isFavorite(professorId);
            btn.classList.toggle('liked', liked);
            btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
            btn.textContent = liked ? '♥' : '♡';
        }

        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentAuth = getAuth();

            if (!currentAuth.loggedIn) {
                toast("Debes iniciar sesión para guardar favoritos");
                setTimeout(() => {
                    sessionStorage.setItem('redirectAfterLogin', window.location.href);
                    window.location.href = "sign-in.html";
                }, 800);
                return;
            }

            if (professorId === null) return;

            const currentlyLiked = isFavorite(professorId);

            if (currentlyLiked) {
                removeFavorite(professorId);
                newBtn.classList.remove('liked');
                newBtn.setAttribute('aria-pressed', 'false');
                newBtn.textContent = '♡';

                if (inFavSection) {
                    const currentCard = newBtn.closest('.best-professor-card, .professor-card, .card, article');
                    if (currentCard) {
                        currentCard.remove();
                        const remainingFavs = document.querySelectorAll('.fav-professors-content .best-professor-card');
                        const container = document.querySelector('.fav-professors-content');
                        if (remainingFavs.length === 0 && container) {
                            container.innerHTML = '<p>No tienes profesores favoritos aún. Explora y añade algunos.</p>';
                        }
                    }
                }
                toast('Eliminado de favoritos');
            } else {
                addFavorite(professorId);
                newBtn.classList.add('liked');
                newBtn.setAttribute('aria-pressed', 'true');
                newBtn.textContent = '♥';
                toast('Añadido a favoritos');
            }

            window.dispatchEvent(new CustomEvent('favorites:updated'));
        });
    });
}

// Inicializador Principal
export function initCodifyUI() {
    updateHeader();
    initDropdownMenu();
    setupAsideNavBar();
    bindFavButtons();
}

// Exponer las funciones más importantes globalmente para mantener compatibilidad
// con los scripts antiguos que esperan window.codify
window.codify = {
    getAuth,
    setAuth,
    clearAuth,
    logout,
    toast,
    initCodifyUI,
    updateHeader,
    initDropdownMenu,
    getFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    getProfileImage,
    saveProfileImage,
    deleteProfileImage
};

// Escuchar cambios
window.addEventListener('auth:changed', () => {
    // Reflejar el nuevo estado
    updateHeader();
    initDropdownMenu();
    bindFavButtons();
});
