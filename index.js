// Carga los includes HTML cuando se llama a esta función
async function xLuIncludeFile() {
    const elements = document.querySelectorAll('[xlu-include-file]');

    for (let el of elements) {
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
        }
    }

    if (window.codify?.initCodifyUI) {
        window.codify.initCodifyUI();
    }
}

// Gestión de autenticación
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
}

function clearAuth() {
    localStorage.removeItem('codify_auth');
}

// Actualiza el header según el estado
function updateHeader() {
    const auth = getAuth();
    const homeLink = document.getElementById('homeLink');
    const profileLink = document.getElementById('profileLink');
    const username = document.getElementById('headerUsername');

    if (!homeLink || !profileLink || !username) return;

    if (auth.loggedIn) {
        homeLink.href = 'home.html';
        profileLink.href = 'profile.html';
        username.textContent = auth.username || 'Usuario';
    } else {
        homeLink.href = 'home-public.html';
        profileLink.href = 'sign-in.html';
        username.textContent = 'Invitado';
    }
}

// Botones de mostrar contraseña
function bindPasswordToggles() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = this.closest('.field-wrapper');
            if (!wrapper) return;

            const input = wrapper.querySelector('input');
            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁';
            }
        });
    });
}

// Botones de favoritos
function bindFavButtons() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const liked = this.classList.toggle('liked');
            this.setAttribute('aria-pressed', liked);
            this.textContent = liked ? '♥' : '♡';

            const inFavSection = this.closest('.fav-professors-content');
            if (inFavSection && !liked) {
                const card = this.closest('.best-professor-card, .card, article');
                if (card) {
                    card.remove();
                    if (window.codify?.toast) {
                        window.codify.toast('Eliminado de favoritos');
                    }
                }
            }
        });

        const isLiked = btn.classList.contains('liked') || btn.getAttribute('aria-pressed') === 'true';
        btn.textContent = isLiked ? '♥' : '♡';
    });
}

// Notificaciones toast
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

function initCodifyUI() {
    updateHeader();
    bindPasswordToggles();
    bindFavButtons();
}

window.codify = {
    getAuth,
    setAuth,
    clearAuth,
    toast,
    initCodifyUI
};
