<p align="center">
  <img src="./images/logo_verde.png" alt="Logo de Codify" width="200"/>
</p>

# Codify -  Sprint 2
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
* **`/src`**: Lógica central (`loader.js` para componentes, `utils.js` para autenticación y favoritos).
* **`/pages`**: Vistas principales de la aplicación.
* **`/templates`**: Fragmentos HTML reutilizables.
* **`/styles`**: Hojas de estilo modulares con **Media Queries**.

---

## Evolución de la Interfaz
> en proceso

---

## 💻 Mockups RWD
El prototipado final que incluye las vistas de **Tablet y Móvil** se ha realizado en **Figma**. Todos los detalles, textos e interacciones se encuentran detallados en el archivo **`sprint2-mockups.pdf`**, diseñado para visualizarse con total claridad mediante el uso de zoom.

<img width="1556" height="594" alt="Captura de pantalla Mockups" src="https://github.com/user-attachments/assets/1733bcc5-6658-453b-b423-a2d09db7e55e" />

---

## 📱 Diseño Responsive
El sitio web ofrece una experiencia fluida mediante tres **breakpoints** clave:

* **Desktop:** Layout completo con navegación horizontal y menús desplegables.
* **Tablet:** Ajuste de rejillas (**CSS Grid**) y escalado de imágenes de perfil. Breakpoints en **950px** y **1100px**.
* **Mobile:** Menú lateral (**Hamburguesa**) implementado en `aside-nav.css`, optimización de formularios a una sola columna y botones de acción de gran tamaño. Breakpoint en **700px**.

Se ha utilizado **Flexbox** para las tarjetas de contenido y **CSS Grid** para las estructuras de página complejas, como el Perfil del Profesor.

---

## Carga Dinámica y Datos (JSON)
La plataforma funciona como una **SPA (Single Page Application) híbrida**:

1. **Ficheros Fuente:** Utilizamos `professors.json`, `users.json`, `languages.json` y `opinions.json`.
2. **Consumo de Datos:** Mediante la **Fetch API** en `utils.js`, inyectamos la información en los templates sin recargar la página.
3. **Sistema de Templates:** Los componentes se cargan dinámicamente, garantizando la **reutilización de código** y coherencia visual.

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
> Por ejemplo, aunque puede ser cualquiera del archio **`data/users.json`**. O también una nuevo a través del registro.

---

## Detalle de Páginas y Funcionalidades RWD
> en prooceso

---
