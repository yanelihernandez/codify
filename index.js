async function xLuIncludeFile() {
    const elements = document.querySelectorAll('[xlu-include-file]');

    if (elements.length === 0) {
        if (window.codify?.initCodifyUI) {
            window.codify.initCodifyUI();
        }
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
            return xLuIncludeFile();
        }
    } catch (err) {
        console.log('Error cargando:', file);
        el.removeAttribute('xlu-include-file');
        return xLuIncludeFile();
    }
}

// Guardar sesión del usuario
function getAuth() {
    try {
        const data = localStorage.getItem('codify_auth');
        return data ? JSON.parse(data) : { loggedIn: false, username: 'Invitado' };
    } catch {
        return { loggedIn: false, username: 'Invitado' };
    }
}

function setAuth(auth) {
    localStorage.setItem('codify_auth', JSON.stringify(auth));
    if (window.codify?.updateHeader) window.codify.updateHeader();
    if (window.codify?.initDropdownMenu) window.codify.initDropdownMenu();
}

function clearAuth() {
    localStorage.removeItem('codify_auth');
}

function logout() {
    clearAuth();

    if (window.codify?.toast) {
        window.codify.toast('¡Hasta pronto! Has cerrado sesión');
    }

    if (window.codify?.updateHeader) window.codify.updateHeader();
    if (window.codify?.initDropdownMenu) window.codify.initDropdownMenu();

    window.location.href = 'home-public.html';
}

// Favoritos: cada usuario tiene los suyos (clave con su nombre)
function getFavoritesKey() {
    const auth = getAuth();
    return auth.loggedIn ? `codify_favorites_${auth.username}` : null;
}

function getFavorites() {
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

function isFavorite(professorId) {
    return getFavorites().includes(Number(professorId));
}

function addFavorite(professorId) {
    const favorites = getFavorites();
    const id = Number(professorId);
    if (!favorites.includes(id)) {
        favorites.push(id);
        saveFavorites(favorites);
    }
}

function removeFavorite(professorId) {
    const id = Number(professorId);
    const favorites = getFavorites().filter(favId => favId !== id);
    saveFavorites(favorites);
}

// Header dinámico según si está logueado o no
function updateHeader() {
    const auth = getAuth();
    const homeLink = document.getElementById('homeLink');
    const profileLink = document.getElementById('profileLink');
    const profileLinkMenu = document.getElementById('profileLinkMenu');
    const username = document.getElementById('headerUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileImg = document.querySelector('#site-header .profile img');

    if (!username) return;

    if (auth.loggedIn) {
        if (homeLink) homeLink.href = 'home.html';
        if (profileLink) profileLink.href = '#';
        if (profileLinkMenu) profileLinkMenu.href = 'profile.html';
        username.textContent = auth.username || 'Usuario';

        const savedImage = localStorage.getItem('codify_profile_image');
        if (savedImage && profileImg) {
            profileImg.src = savedImage;
        } else if (profileImg) {
            profileImg.src = '../images/perfil.jpg';
        }

        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        }
    } else {
        if (homeLink) homeLink.href = 'home-public.html';
        if (profileLink) profileLink.href = '#';
        if (profileLinkMenu) profileLinkMenu.href = 'sign-in.html';
        username.textContent = 'Invitado';
        if (profileImg) profileImg.src = '../images/perfil.jpg';
        if (logoutBtn) logoutBtn.style.display = 'none';

        const footerLinks = document.querySelectorAll('.footer-links a');

        if (footerLinks.length > 0) {
            const targetHome = auth.loggedIn ? 'home.html' : 'home-public.html';

            footerLinks.forEach(link => {
                link.href = `${targetHome}#acerca-codify`;
            });
        }
    }
}

// Menú desplegable del perfil
function initDropdownMenu() {
    const profileDropdown = document.getElementById('profileDropdown');
    const auth = getAuth();
    if (!profileDropdown) return;

    if (!auth.loggedIn) {
        profileDropdown.classList.add('guest-mode');
    } else {
        profileDropdown.classList.remove('guest-mode');
    }

    const newProfileDropdown = profileDropdown.cloneNode(true);
    profileDropdown.parentNode.replaceChild(newProfileDropdown, profileDropdown);

    const currentDropdownMenu = document.getElementById('dropdownMenu');
    const currentLogoutBtn = document.getElementById('logoutBtn');

    if (currentLogoutBtn && auth.loggedIn) {
        currentLogoutBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }

    newProfileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentAuth = getAuth();

        if (!currentAuth.loggedIn) {
            e.preventDefault();
            if (window.codify?.toast) {
                window.codify.toast("Debes iniciar sesión para acceder a tu perfil");
            }
            setTimeout(() => {
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = "sign-in.html";
            }, 500);
            return;
        }

        if (currentDropdownMenu) {
            currentDropdownMenu.classList.toggle('show-dropdown');
        }
    });

    document.addEventListener('click', (e) => {
        if (!newProfileDropdown.contains(e.target) && currentDropdownMenu) {
            currentDropdownMenu.classList.remove('show-dropdown');
        }
    });

    if (currentDropdownMenu) {
        currentDropdownMenu.addEventListener('click', (e) => e.stopPropagation());
    }
}

// Corazones de favoritos: si no estás logueado te manda al login
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
                if (window.codify?.toast) {
                    window.codify.toast("Debes iniciar sesión para guardar favoritos");
                }
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
                window.codify?.toast?.('Eliminado de favoritos');
            } else {
                addFavorite(professorId);
                newBtn.classList.add('liked');
                newBtn.setAttribute('aria-pressed', 'true');
                newBtn.textContent = '♥';
                window.codify?.toast?.('Añadido a favoritos');
            }

            window.dispatchEvent(new CustomEvent('favorites:updated'));
        });
    });
}

// Mensajes flotantes que desaparecen solos
function toast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }, 2200);
}

// Inicializar todo cuando carga la página
function initCodifyUI() {
    updateHeader();
    initDropdownMenu();
    bindFavButtons();
}

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
    removeFavorite
};
