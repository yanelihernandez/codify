<p align="center">
  <img src="./images/logo_verde.png" alt="Logo de Codify" width="200"/>
</p>

# Codify - Sprint 2
### ➣ Programación Web y Móvil

> **Estado del Proyecto:** Aplicación dinámica con carga de datos **JSON**, gestión de usuarios mediante **LocalStorage** y diseño **100% Adaptativo (RWD)**.

Codify ha evolucionado de un prototipo estático a una plataforma funcional. En esta fase, hemos implementado una arquitectura basada en **Vanilla JavaScript** que permite la carga dinámica de profesores, un sistema de autenticación real y una interfaz que se adapta perfectamente a móviles, tablets y escritorio.

---

## 👥 Integrantes del Grupo
* **Dámaso Guerra, Sergio**
* **Perdomo Hernández, Yaneli**
* **Ramos Quintana, Alba**

---

## 📁 Estructura del Repositorio
* **`/data`**: "Base de datos" en formato **JSON**.
* **`/src`**: Lógica central modularizada. Toda la interactividad, eventos y funcionalidades (que antes residían en un único archivo global) se han segmentado en múltiples scripts específicos (ej. `loader.js` para componentes, `utils.js` para autenticación y favoritos, validaciones, etc.) para un código más limpio y mantenible.
* **`/pages`**: Vistas principales de la aplicación.
* **`/templates`**: Fragmentos HTML reutilizables.
* **`/styles`**: Hojas de estilo modulares con **Media Queries**.

---

## Evolución de la Interfaz
Durante este sprint, la interfaz ha sufrido mejoras sustanciales para optimizar la Experiencia de Usuario (UX), añadiendo nuevas interacciones y protegiendo rutas privadas:

* **Tooltips de Acceso:** Se han añadido "bocadillos" o mensajes flotantes informativos en los botones de **Favoritos (Corazón)**, **Enviar Mensaje (Chat)** y **Reservar**. Si un perfil no registrado (invitado) intenta hacer clic en ellos, la interfaz bloquea la acción de forma amigable y le indica que debe iniciar sesión y le redirigue directamente a **`/pages/sign-in.html`**.
* **Gestión y Cálculo Dinámico de Reservas:** El formulario de reservas ahora calcula en tiempo real el precio total, aplicando el **porcentaje de descuento** al activar el *switch* de modalidad en grupo (**`/pages/booking.html`**). Además, los datos introducidos en el formulario coinciden de forma exacta con los que se muestran posteriormente en la tarjeta generada en la lista de reservas (**`/pages/my-bookings.html`**).
* **Confirmar Cancelación de Reserva:** Para evitar borrados accidentales, se ha diseñado un *Modal* (Pop-up) interactivo que muestra los datos de la clase y exige confirmación explícita del usuario antes de cancelar la reserva definitivamente (**`/pages/my-bookings.html`**).
* **Mensajes de Estado Vacío:** Si el usuario entra a su lista de favoritos o reservas y no tiene ninguna guardada, la interfaz muestra un mensaje claro e incorpora botones de llamada a la acción (ej. "Explorar profesores") para reconducir la navegación.
* **Foto de Perfil y Formato de Información:** Se ha rediseñado la vista de "Mi Perfil". Ahora se puede hacer una subida de imagen (vía **FileReader API**) y la tarjeta de información del usuario presenta los datos de forma más estructurada y legible (**`/pages/profile.html`**).
* **Cerrar Sesión:** Implementación de un menú desplegable en el *header* asociado a la foto de perfil. Permite acceder a los ajustes personales o "Cerrar Sesión" limpiando los datos de autenticación correctamente.
* **Arreglos sobre el Sprint 1:** El botón del icono del ojo (👁/🔒) presente en los formularios (Inicio de sesión, Registro y Modificar Perfil) ya es completamente funcional. Al pulsarlo, alterna el tipo de input para permitir al usuario revisar la contraseña que está escribiendo. Y también la funcionalidad del corazón (♡/♥) ha sido implementada al 100%. Ahora permite añadir y cancelar favoritos de manera dinámica sin recargar la página. Estos cambios se guardan de forma persistente y actualizan automáticamente la sección "Mis Favoritos" dentro del perfil del usuario.

<img width="1235" height="689" alt="image" src="https://github.com/user-attachments/assets/fbe56fc5-c71d-4e92-a1bf-ff3356bfdb3d" />


---

## 💻 Mockups RWD
El prototipado final que incluye las vistas de **Tablet y Móvil** se ha realizado en **Figma**. Todos los detalles, textos e interacciones se encuentran detallados en el archivo **`sprint2-mockupsRWD.pdf`**, diseñado para visualizarse con total claridad mediante el uso de zoom.

<img width="1556" height="594" alt="Captura de pantalla Mockups" src="https://github.com/user-attachments/assets/1733bcc5-6658-453b-b423-a2d09db7e55e" />

Los cambios de diseño más significativos realizados respecto al Desktop son los siguientes:

#### Vistas Tablet (~701px - 1100px)
El objetivo en tablet es mantener la estructura general pero compactar elementos para pantallas más estrechas, asegurando que nada se desborde.

* **`Header & Navegación Global`**:
    * Navegación Desktop se oculta. Aparece un icono de menú lateral (**Menú Hamburguesa**). Al pulsarlo, se despliega un `aside-nav` que ocupa todo el alto de la pantalla para acceder a las secciones.
* **`Profile`**:
    * La tarjeta central de perfil se compacta, ajustando alineaciones de texto e iconos de chat y favoritos que te redirigen directamente a esa zona de la página.
    * La cuadrícula de favoritos se reduce de 4 a 2 columnas para mantener el tamaño de las tarjetas legible.
    * Los botones de acción ("Modificar perfil", "Ver Reservas") se apilan verticalmente al lado de la foto de perfil.
* **`Teacher`**:
    * La sección lateral derecha (reservas/vídeo) se desplaza debajo de la información principal si el ancho es insuficiente para 3 columnas. 
* **`Sign-up`**:
    * Los _inputs_ se adaptan al ancho disponible, manteniendo el diseño de columnas si es posible, pero priorizando la facilidad de lectura.

#### Vistas Móvil (<700px)
En móvil, el diseño se transforma radicalmente hacia un **apilamiento vertical total**. Se prioriza la legibilidad y la interacción táctil con botones de gran tamaño.

* **`Layout de Listas (Profesores/Reservas)`**:
    * Todas las listas que usaban cuadrículas (Grid) en desktop pasan a un **apilamiento vertical de columna única**. Las tarjetas (profesores, reservas) se estiran al 100% del ancho del contenedor.
    * En la lista de profesores, los elementos interactivos (corazón de favoritos, botones) se reorganizan para estar al alcance del pulgar.
* **`Profile`**:
    * La cuadrícula de favoritos pasa a 1 sola columna vertical.
    * La sección de calendario se simplifica o se desplaza hacia abajo para no interrumpir el flujo visual principal.
    * Los botones de acción ("Modificar perfil", "Ver Reservas") se apilan verticalmente y escalan a tamaño completo para facilitar el clic.
* **`Sign-up`** y **`Edit-profile`**:
    * Todos los campos que en desktop estaban lado a lado se apilan verticalmente en una sola columna con inputs al 100% de ancho, facilitando el relleno desde el teclado móvil.
* **`My-bookings`**:
    * Ventanas modales, como la confirmación de cancelación se adaptan para ocupar casi la totalidad del ancho de la pantalla móvil, evitando que el usuario pierda el contexto por elementos demasiado pequeños.

---

## 📱 Diseño Responsive
El sitio web ofrece una experiencia fluida mediante tres **breakpoints** clave:

* **Desktop:** Layout completo con navegación horizontal y menús desplegables.
* **Tablet:** Ajuste de rejillas (**CSS Grid**) y escalado de imágenes de perfil. Breakpoints en **950px** y **1100px**.
* **Phone:** Menú lateral (**Hamburguesa**) implementado en `aside-nav.css`, optimización de formularios a una sola columna y botones de acción de gran tamaño. Breakpoint en **700px**.

Se ha utilizado **Flexbox** para las tarjetas de contenido y **CSS Grid** para las estructuras de página complejas, como el Perfil del Profesor.

---

## Carga Dinámica y Datos (JSON)
**Ubicación del contenido JSON:** Los datos se encuentran alojados de forma **local** dentro del directorio `/data`.

La plataforma funciona como una **SPA (Single Page Application) híbrida**:

1. **Ficheros Fuente:** Utilizamos `professors.json`, `users.json`, `languages.json` y `opinions.json`.
2. **Consumo de Datos:** Mediante la **Fetch API** en `src/utils.js`, inyectamos la información en los templates sin recargar la página.
3. **Sistema de Templates:** Los componentes se cargan dinámicamente, garantizando la **reutilización de código** y coherencia visual.

<img width="230" height="153" alt="Captura de pantalla 2026-03-27 025356" src="https://github.com/user-attachments/assets/dd55df34-cc07-470c-9081-e183361f7a8d" />


---

## 📝 Formularios
Hemos implementado persistencia en el lado del cliente:

* **Sign-Up:** Valida **mayoría de edad** y contraseñas seguras. Almacena los datos en `LocalStorage`.
* **Sign-In:** Compara credenciales tanto con el JSON estático como con los nuevos registros del `LocalStorage`.
* **Favoritos y Reservas:** Persistencia vinculada al usuario activo mediante claves únicas en el almacenamiento local.

### Validaciones 
* Feedback inmediato en campos obligatorios o formatos de fecha (**DD-MM-YYYY**) erróneos.
* Muestra seguridad tras la comprobación de robustez de contraseña (mínimo **8 caracteres**) y coincidencia de campos.
* Bloqueo de reservas en fechas pasadas y avisos mediante **Toasts** informativos para usuarios no autenticados.

### 🔑 Credenciales de Prueba
| Usuario | Contraseña |
| :--- | :--- |
| `mariagarcia` | `12345678` |
| `carloslopez` | `12345678` |
> *O bien, cualquier usuario existente en el archivo local **`data/users.json`** o uno nuevo creado a través de registro.*

---

## Detalle de Páginas y Funcionalidades RWD
| Página | Aspectos Responsive Implementados | Carga Dinámica (JSON/LS) | Validaciones y Datos |
| :--- | :--- | :--- | :--- |
| **Home / Public Home** *(Página de Inicio)* | Hero Image adaptativa y menú hamburguesa lateral. | Carga de **"Mejor valorados"**. | Inicio de la aplicación. |
| **List of Teachers** | Tarjetas de profesores pasan de horizontal a apilamiento vertical. | Filtro dinámico por **lenguaje**. | Sistema de **Favoritos**. |
| **Teacher** | Layout de 3 columnas a 1 columna. Botones de acción y chat ocupan el 100% del ancho. | Info y **opiniones reales**. | Verifica sesión activa. |
| **Booking** | Formulario adaptativo a una columna y reordenación de precio. | Cálculo de precio dinámico y descuentos al igual que la info del profesor correspondiente. | **Validación fecha/hora.** |
| **My Bookings** | Lista con scroll optimizado y modales de confirmación de borrado. | Reservas desde `LocalStorage`. | Confirmación explícita. |
| **Chat** | Interfaz de mensajería adaptada a pantalla completa en dispositivos móviles. | Carga de tutor por **ID**. | Requiere autenticación. |
| **Profile** | Sidebar lateral se convierte en botones de acceso apilados verticalmente. | Foto de perfil (**FileReader**). | Vista de favoritos. |
| **Edit Profile** | Los campos paralelos se apilan en una sola columna con inputs al 100% de ancho. | Sincronización con **Header**. | **Validación +18 años.** |
| **Sign In / Sign Up** | Centrado, campos paralelos y ajuste al 100% de ancho. | Creación/Verificación usuarios. | Registro funcional. |

---
