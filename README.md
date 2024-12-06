# Delivery Dynamics - Technical Test

Este repositorio contiene una aplicación full-stack desarrollada como parte de una prueba técnica para Delivery Dynamics. El proyecto está compuesto por un Frontend construido con React y Next.js, y un Backend utilizando Express.js, Prisma, y PostgreSQL.

## 📱 Frontend

### Lenguaje y Frameworks

- **TypeScript**: Un superconjunto de JavaScript que facilita el desarrollo mediante tipado estático, ayudando en la detección temprana de errores.
- **React**: Biblioteca para construir interfaces de usuario eficientes a través de componentes reutilizables.
- **Next.js**: Framework basado en React que optimiza el rendimiento, soporta renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG).

### Estilos

- **CSS**: Utilizado para estilizar la aplicación globalmente o por componente.
- **Tailwind CSS**: Framework utilitario de CSS para crear interfaces responsivas sin necesidad de escribir estilos adicionales. Usa clases predefinidas para aplicar estilos.

### UI y Componentes

- **Shadcn**: Librería de componentes UI para crear interfaces modernas y accesibles con diseño de alta calidad.
- **Zod**: Librería de validación de esquemas en JavaScript/TypeScript, utilizada tanto en el frontend como en el backend para asegurar que los datos sean válidos antes de procesarlos.
- **Axios**: Cliente HTTP para realizar solicitudes a servicios backend mediante API Rest (GET, POST, PUT, DELETE).

### Levantamiento del Frontend

1. Acceder a la carpeta frontend: `cd delivery-dynamics-frontend`

2. Instalar dependencias:
   ```bash
   npm i
   ```
3. Ejecutar la aplicación:
   ```bash
   npm run dev
   ```
   Esto levantará el servidor de desarrollo en `http://localhost:3000`.

### Estructura de Carpetas

- `/app`: Rutas y layout principal de la aplicación.
- `/protected/`: Páginas protegidas que requieren autenticación.
- `/actions`: Acciones para interactuar con el backend.
- `/components`: Componentes UI reutilizables.
- `/hooks`: Hooks personalizados de React.
- `/lib`: Funciones utilitarias y librerías compartidas.
- `/interfaces`: Interfaces TypeScript para describir la estructura de los datos.
- `/public`: Archivos estáticos como imágenes y fuentes.
- `/schemas`: Esquemas de validación de datos con Zod.
- `/constants`: Constantes utilizadas en toda la aplicación.

## 📦 Dependencias

- **react**, **react-dom**: Librerías base para la construcción de la UI.
- **next**: Framework para la creación de aplicaciones React optimizadas.
- **tailwindcss**: Framework CSS para crear interfaces de usuario responsivas.
- **shadcn**: Librería de componentes UI de alta calidad.
- **axios**: Cliente HTTP para interactuar con APIs.
- **zod**: Validación de esquemas de datos.

### Repositorios

Este proyecto está dividido en dos repositorios principales: uno para el **Frontend** y otro para el **Backend**.

- **Frontend**: [delivery-dynamics](https://github.com/Dev-Anyelo/delivery-dynamics)  
  El repositorio contiene la aplicación frontend, desarrollada con **React**, **Next.js** y **TypeScript**. Esta parte se encarga de la interfaz de usuario y la interacción con el backend.

- **Backend**: [delivery-dynamics-backend](https://github.com/Dev-Anyelo/delivery-dynamics-back)  
  El repositorio incluye el backend construido con \*
