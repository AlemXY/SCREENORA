# SCREENORA

## 1. Descripción del proyecto

SCREENORA es una aplicación web Full-Stack para la exploración
y gestión de películas y series.

Cuenta con un catálogo interactivo, autenticación de usuarios,
administración de contenidos y listas personales.

El proyecto integra React y TypeScript en el frontend,
Node.js y Express en el backend, y MongoDB Atlas como
base de datos, utilizando Mongoose.

## 2. Objetivo

Desarrollar una aplicación web Full-Stack que permita:

- Registrar usuarios mediante formularios.
- Almacenar contraseñas de forma segura utilizando bcrypt.
- Iniciar sesión y generar tokens JWT.
- Proteger rutas mediante autenticación.
- Gestionar registros mediante operaciones CRUD.
- Asociar listas personales a usuarios autenticados.
- Integrar frontend, backend y base de datos mediante una API REST.

## 3. Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- express-rate-limit

### Base de datos

- MongoDB Atlas

### Servicios de despliegue

- Netlify
- Render

### Control de versiones

- Git y GitHub

## 4. Estructura del proyecto

SCREENORA/
├── client/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── home/
│ │ ├── layouts/
│ │ └── services/
│ └── package.json
│
├── server/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── scripts/
│ │ └── utils/
│ ├── .env.example
│ └── package.json
│
├── Evidencias/
└── README.md

## 5. Funcionalidades principales

### Catálogo

- Visualización de películas y series.
- Consulta de contenidos almacenados en MongoDB.
- Interfaz adaptable a dispositivos móviles y computadoras.
- Reproducción de tráileres y contenido audiovisual.

### Autenticación de usuarios

- Registro de nuevas cuentas.
- Inicio de sesión mediante correo y contraseña.
- Contraseñas protegidas con bcrypt.
- Generación de tokens JWT.
- Verificación de sesiones mediante rutas protegidas.

### Administración

- Inicio de sesión administrativo.
- Creación de películas y series.
- Consulta del catálogo.
- Actualización de contenidos.
- Eliminación de contenidos.
- Protección de operaciones mediante JWT y permisos.

### Mi lista

- Agregar películas y series.
- Consultar contenidos personales.
- Marcar elementos como Pendiente o Visto.
- Eliminar elementos.
- Restringir el acceso a los registros del usuario autenticado.

## 6. Requisitos previos

Para ejecutar SCREENORA localmente se necesita:

- Node.js y npm instalados.
- Visual Studio Code u otro editor.
- Acceso a una base de datos MongoDB Atlas.
- Una cadena de conexión MongoDB válida.
- Git para clonar el repositorio.

## 7. Instalación del proyecto

### Clonar el repositorio

git clone URL_DEL_REPOSITORIO

cd SCREENORA

### Instalar el backend

cd server

npm install

### Configurar variables de entorno

Dentro de server/ existe un archivo llamado .env.example.

Crear una copia con el nombre .env:

PowerShell:

Copy-Item .env.example .env

Editar el archivo .env y configurar:

MONGODB_URI=TU_CADENA_DE_CONEXION
MONGODB_DB_NAME=TU_BASE_DE_DATOS
JWT_SECRET=TU_CLAVE_SECRETA_SEGURA
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

La clave JWT_SECRET debe ser aleatoria y contener
al menos 32 caracteres.

Nunca publicar el archivo .env en GitHub.

### Ejecutar el backend

npm run dev

La API estará disponible normalmente en:

http://localhost:3000

### Instalar el frontend

Desde la carpeta principal del proyecto:

cd client

npm install

### Ejecutar el frontend

npm run dev

La aplicación estará disponible normalmente en:

http://localhost:5173

Es necesario mantener el backend ejecutándose
mientras se utiliza el frontend localmente.

## 8. Configuración de MongoDB Atlas

1. Crear un proyecto en MongoDB Atlas.
2. Crear o seleccionar un clúster.
3. Configurar un usuario de base de datos.
4. Asignar permisos readWrite sobre la base elegida.
5. Autorizar el acceso de red desde el equipo de desarrollo.
6. Obtener la cadena de conexión del clúster.
7. Configurar MONGODB_URI dentro de server/.env.
8. Configurar MONGODB_DB_NAME con el nombre de la base.
9. Iniciar el backend para comprobar la conexión.

La aplicación utiliza Mongoose para definir esquemas
y realizar operaciones sobre MongoDB.

Los datos de ejemplo no se incluyen automáticamente.
Para gestionar el catálogo desde la interfaz se requiere
una cuenta administrativa configurada previamente.

## 9. Principales endpoints de la API

### Autenticación

POST /api/auth/register
Registrar un usuario.

POST /api/auth/login-usuario
Iniciar sesión como usuario normal.

GET /api/auth/me-usuario
Verificar el JWT de un usuario normal.

POST /api/auth/login
Iniciar sesión como administrador.

GET /api/auth/me
Verificar el JWT de administrador.

### Contenidos

GET /api/contenidos
Listar películas y series.

GET /api/contenidos/:id
Consultar un contenido por ID.

POST /api/contenidos
Crear un contenido. Requiere JWT de administrador.

PUT /api/contenidos/:id
Actualizar un contenido. Requiere JWT de administrador.

DELETE /api/contenidos/:id
Eliminar un contenido. Requiere JWT de administrador.

### Mi lista

GET /api/mi-lista
Consultar la lista personal.

POST /api/mi-lista
Agregar un contenido a la lista personal.

PUT /api/mi-lista/:id
Actualizar el estado de un elemento.

DELETE /api/mi-lista/:id
Eliminar un elemento de la lista personal.

Todas las rutas de Mi lista requieren JWT de usuario.

### Estado del servidor

GET /estado-mongodb
Consultar el estado de conexión con MongoDB.

## 10. Autenticación y seguridad

SCREENORA implementa las siguientes medidas:

- Hashing de contraseñas mediante bcryptjs.
- Autenticación basada en tokens JWT.
- Tokens con tiempo de expiración.
- Verificación de JWT mediante middleware.
- Separación entre permisos de usuarios y administradores.
- Protección de endpoints sensibles.
- Validación de datos en el backend.
- Limitación de intentos de autenticación.
- Almacenamiento de secretos mediante variables de entorno.
- Restricción de acceso a registros personales por usuario.

Las solicitudes a rutas protegidas deben incluir:

Authorization: Bearer TOKEN_JWT

## 11. Arquitectura de la aplicación

Frontend
React + TypeScript
|
| HTTP / JSON
v
Backend
Node.js + Express
|
| Mongoose
v
Base de datos
MongoDB Atlas

El backend está organizado en controladores, rutas,
modelos, middlewares y funciones auxiliares.

## 12. Compilación

### Backend

cd server

npm run build

npm start

### Frontend

cd client

npm run build

La compilación de producción del frontend
se genera en la carpeta dist.

## 13. Despliegue

SCREENORA utiliza Netlify para el frontend
y Render para ejecutar el backend Express.

Frontend original:
https://screenora.netlify.app

Backend original:
https://screenora-backend.onrender.com

La versión actualizada con las funcionalidades
del PA3 se publicará después de completar su despliegue.

## 14. Repositorio de GitHub

Repositorio público del proyecto:

PENDIENTE_DE_AGREGAR_ENLACE_DE_GITHUB

## 15. Evidencias

La carpeta Evidencias contiene capturas del
funcionamiento de la aplicación, las operaciones
de gestión y la integración con MongoDB.

## 16. Proyecto académico

Asignatura: Desarrollo Web Full-Stack / Programación Web.

Evaluación: Producto Académico N.º 3 (PA3).

Proyecto: SCREENORA.

Desarrollado con React, TypeScript, Node.js,
Express y MongoDB.
