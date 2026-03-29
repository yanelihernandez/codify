// Componentes de interfaz de usuario
import { getAuth, logout, getProfileImage } from './auth.js';

//  Toast
export function toast(msg) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.textContent = msg;
    document.body.appendChild(toastEl);

    setTimeout(() => toastEl.classList.add('show'), 10);

    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 250);
    }, 2200);
}

// Actualiza el header de la página según el estado de autenticación
// - Si el usuario está logueado muestra su nombre, foto y puede acceder a la parte privada
// - Si no está logueado muestra "Invitado" y solo puede acceder a la parte pública
export function updateHeader() {
    const auth = getAuth();
    console.log('updateHeader - auth:', auth);

    const homeLink = document.getElementById('homeLink');
    const profileLink = document.getElementById('profileLink');
    const profileLinkMenu = document.getElementById('profileLinkMenu');
    const usernameSpan = document.getElementById('headerUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileImg = document.querySelector('#site-header .profile img');

    console.log('updateHeader - elementos encontrados:', {
        homeLink: !!homeLink,
        profileLink: !!profileLink,
        profileLinkMenu: !!profileLinkMenu,
        usernameSpan: !!usernameSpan,
        logoutBtn: !!logoutBtn,
        profileImg: !!profileImg
    });

    if (!usernameSpan) {
        console.warn('updateHeader: usernameSpan no encontrado');
        return;
    }

    if (auth.loggedIn) {
        console.log('Usuario logueado:', auth.username);
        // Usuario logueado
        if (homeLink) homeLink.href = 'home.html';
        if (profileLink) profileLink.href = '#';
        if (profileLinkMenu) profileLinkMenu.href = 'profile.html';
        usernameSpan.textContent = auth.username || 'Usuario';

        // Cargar la foto específica del usuario
        const savedImage = getProfileImage();
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
        console.log('Usuario invitado');
        // Usuario invitado
        if (homeLink) homeLink.href = 'home-public.html';
        if (profileLink) profileLink.href = '#';
        if (profileLinkMenu) profileLinkMenu.href = 'sign-in.html';
        usernameSpan.textContent = 'Invitado';
        if (profileImg) profileImg.src = '../images/perfil.jpg';
        if (logoutBtn) logoutBtn.style.display = 'none';

        // Ajustar enlaces del footer para el modo invitado
        const footerLinks = document.querySelectorAll('.footer-links a');
        if (footerLinks.length > 0) {
            footerLinks.forEach(link => {
                link.href = `home-public.html#acerca-codify`;
            });
        }
    }
}

//  Inicializa el menú desplegable del perfil
// - Gestiona la apertura/cierre del menú
// - Si el usuario no está logueado, redirige al login
export function initDropdownMenu() {
    console.log('initDropdownMenu llamado');
    const profileDropdown = document.getElementById('profileDropdown');
    const auth = getAuth();

    if (!profileDropdown) {
        console.warn('initDropdownMenu: profileDropdown no encontrado');
        return;
    }

    // Añadir clase guest-mode si no está logueado
    if (!auth.loggedIn) {
        profileDropdown.classList.add('guest-mode');
    } else {
        profileDropdown.classList.remove('guest-mode');
    }

    // Eliminar listeners antiguos
    const newProfileDropdown = profileDropdown.cloneNode(true);
    profileDropdown.parentNode.replaceChild(newProfileDropdown, profileDropdown);

    const currentDropdownMenu = document.getElementById('dropdownMenu');
    const currentLogoutBtn = document.getElementById('logoutBtn');

    // Configurar botón de logout
    if (currentLogoutBtn && auth.loggedIn) {
        currentLogoutBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }

    // Evento click en el perfil
    newProfileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentAuth = getAuth();

        // Si no está logueado, redirigir al login
        if (!currentAuth.loggedIn) {
            e.preventDefault();
            toast("Debes iniciar sesión para acceder a tu perfil");
            setTimeout(() => {
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = "sign-in.html";
            }, 500);
            return;
        }

        // Si está logueado, mostrar/ocultar menú
        if (currentDropdownMenu) {
            currentDropdownMenu.classList.toggle('show-dropdown');
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!newProfileDropdown.contains(e.target) && currentDropdownMenu) {
            currentDropdownMenu.classList.remove('show-dropdown');
        }
    });

    // Evitar que el clic dentro del menú lo cierre
    if (currentDropdownMenu) {
        currentDropdownMenu.addEventListener('click', (e) => e.stopPropagation());
    }
}
