# SCREENORA

Aplicación web Full-Stack para explorar y gestionar películas y series. Esta rama contiene la implementación del **Producto Académico 4 (PA4)**, con páginas de Directores y Catálogo, una relación maestro-detalle, autenticación y administración de contenidos.

## 1. Información del proyecto

- **Proyecto:** SCREENORA
- **Evaluación:** Producto Académico N.º 4 (PA4)
- **Rama de desarrollo:** `pa4`
- **Plantilla de referencia:** [StreamVid — ThemeForest](https://themeforest.net/item/streamvid-streaming-video-wordpress-theme/46440024)
- **Frontend publicado:** [https://screenora-pa4.netlify.app](https://screenora-pa4.netlify.app)
- **Backend publicado:** [https://screenora-pa4-api.onrender.com](https://screenora-pa4-api.onrender.com)
- **Repositorio:** [https://github.com/AlemXY/SCREENORA](https://github.com/AlemXY/SCREENORA)

Para esta entrega se utiliza MongoDB Atlas y Render, conforme a la autorización del docente para continuar con la infraestructura del proyecto.

## 2. Descripción y objetivo

SCREENORA permite explorar películas y series, consultar directores, navegar por categorías y administrar contenidos. También incorpora registro e inicio de sesión de usuarios, autenticación de administradores y listas personales.

El objetivo es integrar una interfaz responsiva desarrollada con React y Tailwind CSS con una API REST construida en Node.js y Express, persistiendo la información en MongoDB Atlas mediante Mongoose.

## 3. Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- React Router

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- express-rate-limit

### Base de datos y despliegue

- MongoDB Atlas
- Render
- Netlify
- Git y GitHub

## 4. Funcionalidades

### Inicio

- Banner principal con carrusel de contenidos y reproducción de tráilers.
- Secciones de tendencias, estrenos y contenido destacado.
- Acceso al catálogo y a la cuenta de usuario.

### Directores

- Consulta de directores almacenados en MongoDB.
- Presentación de fotografía, nombre, obra relacionada y tipo de producción.
- Diseño adaptable a diferentes tamaños de pantalla.

### Catálogo maestro-detalle

- Consulta de las categorías disponibles.
- Selección de una categoría.
- Consulta de las películas y series asociadas a la categoría seleccionada.
- Visualización de póster, título, tipo, año y descripción.

### Autenticación de usuarios

- Registro mediante correo y contraseña.
- Hash de contraseñas con bcryptjs.
- Inicio de sesión y emisión de tokens JWT.
- Verificación de sesión mediante endpoint protegido.

### Administración de contenidos

- Inicio de sesión administrativo.
- Consulta de películas y series.
- Registro, edición y eliminación de contenidos.
- Protección de las operaciones de escritura mediante autenticación JWT de administrador.

### Mi lista

- Agregar películas y series a una lista personal.
- Consultar los elementos guardados.
- Cambiar el estado entre Pendiente y Visto.
- Eliminar elementos.
- Asociar los registros al usuario autenticado.

### Navegación

- Rutas para Inicio, Directores y Catálogo.
- Página 404 para rutas no encontradas.
- Navegación adaptable a dispositivos móviles.

## 5. Estructura del proyecto

```text
SCREENORA/
├── client/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── home/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── routes.tsx
│   └── package.json
│
├── server/
│   ├── public/
│   │   └── imagenes/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 6. Base de datos y relación maestro-detalle

SCREENORA utiliza MongoDB Atlas. Mongoose define los esquemas y realiza las consultas a las colecciones.

### Colección Directores

Contiene seis registros y almacena:

- `nombre`
- `obraRelacionada`
- `tipoProduccion`
- `imagen`

El campo `imagen` contiene la ruta del archivo servido por el backend.

### Colección Categorías

Contiene tres registros. Sus campos principales son:

- `nombre`
- `descripcion`
- `foto`

### Colección Productos

Contiene doce registros: cuatro productos relacionados con cada categoría. Sus campos principales son:

- `titulo`
- `tipo`
- `año`
- `descripcion`
- `imagen`
- `categoria`

El campo `categoria` almacena un ObjectId que referencia a un documento de la colección Categorías. El backend utiliza Mongoose `populate()` para recuperar el nombre de la categoría relacionada.

### Otras colecciones

La aplicación también utiliza las colecciones `contenidos`, `usuarios`, `administradores` y `listas_personales`.

Las imágenes se sirven desde la carpeta `server/public/imagenes` mediante la ruta estática `/imagenes`.

## 7. Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js y npm.
- Git.
- Visual Studio Code u otro editor.
- Una cuenta y un clúster de MongoDB Atlas.
- Una cadena de conexión válida de MongoDB.
- Una clave secreta para JWT de al menos 32 caracteres.

## 8. Instalación y ejecución local

### Clonar la rama PA4

```bash
git clone --branch pa4 --single-branch https://github.com/AlemXY/SCREENORA.git
cd SCREENORA
```

### Configurar y ejecutar el backend

Desde la raíz del proyecto:

```bash
cd server
npm install
```

Crear el archivo local `.env` a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Configurar las variables de entorno en `server/.env`:

```env
MONGODB_URI=TU_CADENA_DE_CONEXION
MONGODB_DB_NAME=screenora_pa3_desarrollo
JWT_SECRET=TU_CLAVE_SECRETA_ALEATORIA_DE_32_CARACTERES_O_MAS
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

La URI y la clave son valores privados. No deben publicarse ni compartirse. El archivo `.env` debe permanecer fuera del control de versiones.

Iniciar el backend:

```bash
npm run dev
```

La API local estará disponible en [http://localhost:3000](http://localhost:3000).

### Configurar y ejecutar el frontend

Abrir una segunda terminal desde la raíz del repositorio:

```bash
cd client
npm install
npm run dev
```

El frontend estará disponible normalmente en [http://localhost:5173](http://localhost:5173).

Para trabajar localmente, deben permanecer activos el frontend y el backend en sus respectivas terminales. En modo desarrollo, el frontend utiliza `http://localhost:3000` como dirección de la API.

## 9. Datos iniciales

El repositorio contiene scripts de inicialización en `server/src/scripts` para registrar directores, categorías y productos. Los scripts de categorías y productos deben ejecutarse en el orden previsto por el proyecto: inicializar categorías, actualizar sus nombres definitivos, inicializar directores e inicializar productos.

Los scripts de inicialización comprueban que `MONGODB_DB_NAME` sea `screenora_pa3_desarrollo` antes de modificar datos. Ejecútalos desde la carpeta `server`, con el archivo `.env` configurado y en este orden:

```bash
npx tsx src/scripts/inicializarCategorias.ts
npx tsx src/scripts/actualizarCategorias.ts
npx tsx src/scripts/inicializarDirectores.ts
npx tsx src/scripts/inicializarProductos.ts
```

Estos scripts crean o actualizan registros de las colecciones correspondientes. No los ejecutes sobre una base de datos con información que no quieras modificar.

La cuenta administrativa debe estar configurada previamente en la colección `administradores`. El proyecto incluye el script `src/scripts/crearAdministrador.ts` para preparar esa cuenta.

## 10. Endpoints de la API

La API responde mediante HTTP y JSON.

### Directores

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/directores` | Lista los directores registrados. |

### Categorías y productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias` | Lista las categorías y su cantidad de productos. |
| GET | `/api/productos?categoria=ID` | Lista los productos relacionados con el ObjectId de una categoría. |

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registra un usuario. |
| POST | `/api/auth/login-usuario` | Inicia sesión como usuario. |
| GET | `/api/auth/me-usuario` | Verifica la sesión de usuario. Requiere JWT de usuario. |
| POST | `/api/auth/login` | Inicia sesión como administrador. |
| GET | `/api/auth/me` | Verifica la sesión de administrador. Requiere JWT de administrador. |

### Contenidos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/contenidos` | Lista películas y series. |
| GET | `/api/contenidos/:id` | Consulta un contenido por su ID. |
| POST | `/api/contenidos` | Registra un contenido. Requiere JWT de administrador. |
| PUT | `/api/contenidos/:id` | Actualiza un contenido. Requiere JWT de administrador. |
| DELETE | `/api/contenidos/:id` | Elimina un contenido. Requiere JWT de administrador. |

### Mi lista

Todas las rutas de Mi lista requieren JWT de usuario.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/mi-lista` | Consulta la lista personal. |
| POST | `/api/mi-lista` | Agrega un elemento a la lista. |
| PUT | `/api/mi-lista/:id` | Actualiza el estado de un elemento. |
| DELETE | `/api/mi-lista/:id` | Elimina un elemento de la lista. |

### Imágenes y estado del servidor

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/imagenes/:ruta` | Sirve imágenes almacenadas en `server/public/imagenes`. |
| GET | `/estado-mongodb` | Informa si el backend tiene conexión activa con MongoDB. |

Las solicitudes a endpoints protegidos deben incluir el encabezado:

```http
Authorization: Bearer TOKEN_JWT
```

## 11. Seguridad

- Contraseñas almacenadas como hashes mediante bcryptjs.
- Autenticación basada en JWT con expiración.
- Middleware independiente para usuarios y administradores.
- Protección de operaciones administrativas.
- Validación de datos en el backend y en los modelos de Mongoose.
- Limitación de intentos en endpoints de autenticación.
- Variables de entorno para credenciales y secretos.
- Verificación de que cada usuario acceda a sus propios registros de Mi lista.

## 12. Compilación

### Backend

```bash
cd server
npm install
npm run build
npm start
```

El comando `npm run build` genera el JavaScript compilado en `server/dist`.

### Frontend

```bash
cd client
npm install
npm run build
```

Vite genera la versión de producción en `client/dist`.

## 13. Despliegue

### Frontend — Netlify

- **URL:** [https://screenora-pa4.netlify.app](https://screenora-pa4.netlify.app)
- **Repositorio:** `AlemXY/SCREENORA`
- **Rama:** `pa4`
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

El archivo `client/public/_redirects` permite que las rutas de React Router funcionen al acceder directamente o recargar una página.

### Backend — Render

- **URL:** [https://screenora-pa4-api.onrender.com](https://screenora-pa4-api.onrender.com)
- **Repositorio:** `AlemXY/SCREENORA`
- **Rama:** `pa4`
- **Root directory:** `server`
- **Build command:** `npm install --include=dev && npm run build`
- **Start command:** `npm start`

Variables de entorno configuradas en Render:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `NODE_ENV=production`

Render proporciona la variable `PORT` para el servicio desplegado.

### Estado de MongoDB

[https://screenora-pa4-api.onrender.com/estado-mongodb](https://screenora-pa4-api.onrender.com/estado-mongodb)

## 14. Enlaces del proyecto

1. **Servicio web:** [https://screenora-pa4-api.onrender.com](https://screenora-pa4-api.onrender.com)
2. **Plantilla ThemeForest:** [StreamVid](https://themeforest.net/item/streamvid-streaming-video-wordpress-theme/46440024)
3. **Sitio web:** [https://screenora-pa4.netlify.app](https://screenora-pa4.netlify.app)
4. **Repositorio GitHub:** [https://github.com/AlemXY/SCREENORA](https://github.com/AlemXY/SCREENORA)

## 15. Proyecto académico

**Proyecto:** SCREENORA  
**Evaluación:** Producto Académico N.º 4 (PA4)  
**Asignatura:** Programación Web  
**Stack:** React, TypeScript, Tailwind CSS, Node.js, Express y MongoDB Atlas.
