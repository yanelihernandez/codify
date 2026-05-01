<p align="center">
  <img width="756" height="330" alt="logo_verde" src="https://github.com/user-attachments/assets/548b29e3-3678-456e-8248-688c6c966ca9" />
</p>

# Codify - Sprint 3
### ➣ Programación Web y Móvil

> **Estado del Proyecto:** Aplicación **SPA (Single Page Application)** migrada a **Angular (v20.3.23)**, con backend en tiempo real en **Firebase** y gestión multimedia mediante **Cloudinary**. Mantiene un diseño **100% Adaptativo (RWD)**.

Codify ha evolucionado de un prototipo estático a una plataforma funcional y moderna. En esta fase, hemos abandonado Vanilla JavaScript y la carga de datos local (JSON/LocalStorage) para implementar una arquitectura basada en **Angular**. Se ha establecido específicamente la **versión 20.3.23** como base del proyecto para garantizar la máxima estabilidad y evitar los defectos presentes en versiones más recientes. 

Ahora contamos con un backend real en la nube que garantiza un sistema de autenticación seguro, sincronización de datos en tiempo real y una estructura completamente modularizada.

---

## 👥 Integrantes del Grupo
* **Dámaso Guerra, Sergio**
* **Perdomo Hernández, Yaneli**
* **Ramos Quintana, Alba**

---

## Iniciar el proyecto (Desarrollo Local)
Para poder visualizar y ejecutar esta aplicación Angular en tu máquina local, asegúrate de tener instalado [Node.js](https://nodejs.org/) y el [Angular CLI](https://angular.dev/tools/cli). 
Sigue estos pasos:

1. **Clonar el repositorio e instalar las dependencias:**
   Abre tu terminal, clona el proyecto y descarga los paquetes necesarios de Node.
   ```bash
   git clone [URL_DE_TU_REPOSITORIO]
   cd codify-sprint3
   npm install
   ```
2. **Desplegar el servidor de desarrollo:**
   Una vez instaladas las dependencias, levanta el servidor local de Angular con el siguiente comando:
   ```bash
   ng serve
   ```
3. Abre tu navegador web y navega a la dirección `http://localhost:4200/`. Si realizas cualquier cambio en el código fuente, la página se recargará automáticamente.

---

## 📁 Estructura del Código del Proyecto Web
Para cumplir con los requisitos, la aplicación ha sido desarrollada utilizando el framework **Angular**, estructurando el código de forma modular para separar la lógica, las vistas y los componentes:

### Componentes (`/src/app/components/`)
Son elementos visuales modulares y reutilizables en distintas partes de la web. **Estos componentes cumplen exactamente la misma función que la carpeta `templates` que utilizábamos en el sprint anterior**, pero ahora con la ventaja de que Angular encapsula su propia lógica (TypeScript), estructura (HTML) y estilos (CSS) de forma independiente.
* **`header` y `footer`**: Proveen la navegación global. El header detecta si el usuario está logueado para adaptar sus opciones.
* **`teacher-compact-card` y `teacher-detail-card`**: Tarjetas para mostrar la información básica y detallada de un profesor mediante `@Input()` para pintarlos en los listados y en los perfiles detallados.
* **`teacher-list`**: Componente encargado de estructurar y renderizar las cuadrículas/listas de profesores.
* **`opinion-card`**: Formato visual para renderizar las reseñas y valoraciones de los alumnos.
* **`booking-card`**: Formatea visualmente los datos de una clase reservada en el panel del usuario.
* **`chat-card` y `chat-message`**: Renderizan la interfaz de mensajería para simular las conversaciones entre alumnos y profesores. (previsualizaciones de los chats y los globos de mensajes individuales).
* **`toast`**: Pequeñas notificaciones emergentes para dar *feedback* visual e inmediato al usuario. Mejora la UX.

---
