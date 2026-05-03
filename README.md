<p align="center">
  <img width="756" height="330" alt="logo_verde" src="https://github.com/user-attachments/assets/2874b5f2-1183-4911-8bd0-379e74f70b82" />
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
Para cumplir con los requisitos, la aplicación ha sido desarrollada utilizando el framework **Angular** y maquetada utilizando componentes y utilidades de **Bootstrap** para garantizar la responsividad. Estructuramos el código de forma modular para separar la lógica, las vistas y los componentes:

### Componentes (`/src/app/components/`)
Son elementos visuales modulares y reutilizables en distintas partes de la web. **Estos componentes cumplen exactamente la misma función que la carpeta `templates` que utilizábamos en el sprint anterior**, pero ahora con la ventaja de que Angular encapsula su propia lógica (TypeScript), estructura (HTML) y estilos (CSS) de forma independiente.
* **`header` y `footer`**: Proveen la navegación global. El header detecta si el usuario está logueado para adaptar sus opciones, muestra su avatar en tiempo real y carga la lista de idiomas desde Firebase para los menús.
* **`teacher-compact-card` y `teacher-detail-card`**: Tarjetas para mostrar la información básica y detallada de un profesor mediante `@Input()` para pintarlos en los listados y en los perfiles detallados.
* **`teacher-list`**: Componente encargado de estructurar y renderizar las cuadrículas/listas de profesores.
* **`opinion-card`**: Formato visual para renderizar las reseñas y valoraciones de los alumnos.
* **`booking-card`**: Formatea visualmente los datos de una clase reservada en el panel del usuario.
* **`chat-card` y `chat-message`**: Renderizan la interfaz de mensajería. `chat-message` utiliza lógica dinámica para diferenciar visualmente los mensajes de alumnos y profesores.
* **`toast`**: Pequeñas notificaciones emergentes para dar *feedback* visual e inmediato al usuario tras acciones o bloqueos de seguridad. Mejora la UX.

### Páginas (`/src/app/pages/`)
> *home es la página de inicio*

Son los componentes contenedores que actúan como páginas completas, enrutadas a través de `app.routes.ts`:
* **`home` y `language-teachers`**: Muestran el catálogo dinámico de profesores extrayendo la información de la base de datos. Realizan consultas (queries) a la colección `professors` de Firestore para renderizar tarjetas de forma dinámica.
* **`teacher-profile`**: Recupera un documento específico de la base de datos mediante el ID de la URL. Muestra biografía, precios y recupera la colección de opiniones vinculadas a ese profesor en tiempo real.
* **`sign-in` y `sign-up`**: Contienen los formularios reactivos de Angular (con validaciones integradas, como mayoría de edad o formato de contraseñas) para interactuar con Firebase Auth. El registro crea un nuevo `uid` y genera simultáneamente un documento en la colección `users` de Firestore.
* **`booking` y `my-bookings`**: Vistas para generar una nueva reserva con cálculo de precio en tiempo real, y para listar/cancelar las reservas activas del usuario. Recopila datos del formulario y los escribe en la colección `bookings` de Firestore.
* **`profile` y `edit-profile`**: Zonas privadas protegidas por *Guards* donde el usuario puede modificar su información y subir/borrar su foto de avatar. Gestiona la subida de imágenes a **Cloudinary** y actualiza el campo `profileImageUrl` en Firestore con la nueva URL segura generada.
* **`chat`**: Centro de mensajería que utiliza los servicios de **Firestore Realtime**. Permite la lectura y escritura de mensajes instantáneos, manteniendo la comunicación fluida entre alumno y docente sin necesidad de recargar la página.

### Servicios (`/src/app/services/`)
Son clases inyectables encargadas de gestionar la comunicación con **Firebase** y centralizar la lógica de la aplicación para que los componentes solo se preocupen de la interfaz.
*   **`auth.ts`**: Gestiona todo el ciclo de vida del usuario. Utiliza **Firebase Auth** para el registro y login, y **Firestore** para leer/escribir los datos adicionales del perfil del usuario.
*   **`professors.service.ts`**: Se encarga de realizar las consultas *(queries)* a la colección de profesores, permitiendo filtrar por idiomas y obtener los detalles específicos de cada docente.
*   **`languages.service.ts`**: Recupera de forma dinámica la lista de tecnologías e idiomas disponibles en Firestore. Es el motor que alimenta los menús y categorías de la web.
*   **`booking.service.ts`**: Controla la creación de nuevas reservas y la recuperación del historial de clases del usuario, interactuando con la colección `bookings`.
*   **`chat.service.ts`**: Implementa la mensajería en tiempo real. Escucha cambios en la base de datos para enviar y recibir mensajes instantáneamente sin recargar la página.
*   **`favorites.service.ts`**: Gestiona la persistencia de los profesores favoritos del usuario, permitiendo guardar y eliminar preferencias directamente en la nube.
*   **`toast.service.ts`**: Un servicio de utilidad que dispara notificaciones visuales emergentes en cualquier parte de la app para mejorar el feedback tras acciones del usuario.

### Modelos (`/src/app/models/`)
Definen las interfaces de TypeScript que garantizan que los datos que fluyen por la aplicación tengan la estructura correcta.
*   **`professor.ts`**: Define la estructura de un docente.
*   **`language.ts`**: Estructura básica de los idiomas.
*   **`opinion.ts`**: Define cómo se almacena una reseña.
*   **`chat.ts`**: Establece el formato de los mensajes y de las salas de conversación.
* >   *También se utilizan interfaces internas para `User` y `Booking` integradas en sus respectivos flujos.*

### Seguridad y Navegación (`/src/app/guards/`)
Para garantizar la integridad de la plataforma, hemos implementado barreras lógicas que controlan el flujo de navegación según el estado de autenticación del usuario.
* **`auth.guard.ts`**: Protector de rutas que impide el acceso a zonas privadas (`profile`, `booking`, `chat`) a usuarios no autenticados. Incluye una lógica de redirección inteligente: guarda la ruta de destino deseada para devolver al usuario allí tras el inicio de sesión.

---

## ☁️ Estructura de Datos en Firebase y Cloudinary
Se ha sustituido la carga local (desde ficheros JSON) por un backend en la nube:

### 1. Autenticación (Firebase Auth)👤
Gestionamos el registro y login mediante correo electrónico y contraseña. Al registrarse un usuario, Firebase le asigna un identificador único seguro (`uid`), que usamos para enlazar su cuenta con sus datos en la base de datos.

### 2. Base de Datos (Firestore)
Los datos están sincronizados en **tiempo real** mediante las siguientes colecciones:
* **`users`**: Perfiles de usuario vinculados por su `uid`.
* **`professors`**: Información técnica, precios y especialidades de los docentes.
* **`languages`**: Colección dinámica que alimenta los menús y categorías de la web.
* **`bookings`**: Registro de clases reservadas (vincula `userId` con `professorId`).
* **`chats`**: Historial de mensajes y conversaciones activas.

<p align="center">
  <img width="760" height="470" alt="Captura de pantalla 2026-05-03 191332" src="https://github.com/user-attachments/assets/d9d0ef75-26e9-4f56-906f-f9e29fe2f027" />
</p>

### 3. Almacenamiento Multimedia (Cloudinary)
> Se utiliza **Cloudinary** para las imágenes para evitar las restricciones de pago de Firebase Storage.

Para evitar facturaciones y mantener el desarrollo accesible, Cloudinary se presentó como la alternativa ideal: es gratuito, muy cómodo de integrar en Angular mediante su API y optimiza las imágenes automáticamente.
* Se ha migrado también toda la carga gráfica a la nube (incluyendo el *favicon* y recursos estáticos), lo que nos ha permitido **eliminar por completo la carpeta local `/images`**, reduciendo drásticamente el peso del proyecto.
* **Flujo de subida de datos**: Cuando un usuario sube su foto desde el formulario de Angular, la imagen se manda a Cloudinary. Éste nos devuelve inmediatamente una URL segura (`secure_url`), y es **esa URL la que guardamos en nuestra base de datos de Firebase** (en el campo `profileImageUrl` del usuario).
* **Flujo de borrado de datos**: Asimismo, el usuario tiene la opción de **borrar su foto de perfil** en cualquier momento, lo cual restaura el avatar predeterminado de la plataforma y actualiza su documento en Firestore al instante.

<p align="center">
  <img width="1898" height="846" alt="Captura de pantalla 2026-05-03 191439" src="https://github.com/user-attachments/assets/f4f475fb-87ca-43a2-9617-b9362a34249d" />
</p>

---

### 🎥Tour
[![Ver Demo en YouTube](https://img.shields.io/badge/Ver_Tour-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/zrMwfuKt8_E)

Para facilitar la evaluación del proyecto, hemos grabado una demostración completa donde se pueden observar los siguientes hitos técnicos:

1.  **Flujo Completo de Datos (Input/Output)**:
  *   En el vídeo se muestra el proceso de realizar una reserva en `/booking`.
  *   Se observa cómo Angular valida el formulario, calcula el precio dinámicamente y realiza una operación de escritura (Create) en la colección `bookings` de **Firestore**.
  *   Acto seguido, se visualiza la redirección automática a `/my-bookings`, donde se realiza una lectura en tiempo real (Read) para mostrar la nueva reserva en el catálogo personal.
2.  **Seguridad y Control de Acceso (Guards)**:
  *   Se demuestra el funcionamiento del **AuthGuard** intentando acceder a zonas privadas sin estar autenticado, forzando la redirección al Login y mostrando el aviso visual mediante el **Toast**.
3.  **Reactividad y Sincronización (Signals)**:
  *   Se visualiza la edición del perfil en `/edit-profile`. Al actualizar la información o la imagen de perfil (subida a **Cloudinary**), se observa cómo el cambio se propaga instantáneamente a la cabecera (Header) sin necesidad de recargar la página, gracias a la implementación de **Angular Signals**.
4.  **Diseño Adaptativo (RWD)**:
  *   El vídeo muestra la transición del diseño de escritorio al diseño móvil, activando el **menú hamburguesa** dinámico que consume los idiomas directamente desde Firebase.

---

### 🔑 Credenciales de Prueba
| Usuario | Correo            | Contraseña | 
|:--------|:------------------|:-----------|
| `manu`  | `manu@gmail.com`  | `12345678` |
| `carla` | `carla@hotmail.com` | `12345678` |
> *O bien, cualquier usuario existente en el *Firebase* o uno nuevo creado a través de registro.*
