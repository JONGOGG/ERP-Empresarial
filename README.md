# ERP Empresarial

Sistema ERP full-stack para la gestión de ventas, compras, inventario, clientes, proveedores, productos y usuarios.

El proyecto permite centralizar las operaciones principales de una empresa mediante una aplicación web con autenticación JWT, control de acceso basado en roles, administración de inventario y generación de reportes.

---

## 📋 Descripción

ERP Empresarial es una aplicación web desarrollada con **React, TypeScript, Node.js, Express, Prisma y PostgreSQL**.

El sistema permite administrar diferentes áreas de una empresa desde una interfaz centralizada, incluyendo:

- Productos
- Categorías
- Clientes
- Proveedores
- Ventas
- Compras
- Inventario
- Usuarios
- Reportes

La aplicación cuenta con autenticación mediante **JSON Web Tokens (JWT)** y un sistema de autorización basado en roles para diferenciar las operaciones disponibles para administradores y empleados.

---

# 🚀 Funcionalidades

## 🔐 Autenticación y seguridad

- Inicio de sesión mediante correo y contraseña.
- Contraseñas cifradas con bcrypt.
- Autenticación mediante JWT.
- Expiración de sesión.
- Rutas protegidas en frontend.
- Rutas protegidas en backend.
- Control de acceso basado en roles.
- Activación y desactivación de usuarios.
- Cambio de contraseña administrado por usuarios con rol ADMIN.

### Roles

#### ADMIN

Tiene acceso completo al sistema.

Puede:

- Administrar productos.
- Administrar categorías.
- Administrar clientes.
- Registrar ventas.
- Consultar historial de ventas.
- Administrar proveedores.
- Registrar compras.
- Consultar historial de compras.
- Consultar inventario.
- Realizar ajustes de inventario.
- Administrar usuarios.
- Cambiar contraseñas de usuarios.
- Consultar reportes.
- Exportar reportes.

#### EMPLEADO

Tiene acceso limitado a las operaciones necesarias para ventas.

Puede:

- Consultar productos.
- Consultar categorías.
- Administrar clientes según los permisos configurados.
- Registrar ventas.
- Consultar historial de ventas.
- Consultar inventario.

Las operaciones administrativas permanecen protegidas tanto desde el frontend como desde la API.

---

# 📦 Gestión de productos

El módulo de productos permite:

- Registrar productos.
- Editar productos.
- Eliminar productos.
- Consultar productos.
- Asignar categorías.
- Administrar precios.
- Administrar SKU.
- Consultar stock disponible.
- Detectar productos con stock bajo.

Los SKU son únicos dentro del sistema.

---

# 🗂️ Categorías

Permite organizar los productos mediante categorías.

Funciones:

- Crear categorías.
- Editar categorías.
- Eliminar categorías.
- Consultar categorías.
- Asociar productos con categorías.

---

# 👥 Clientes

Módulo para administrar los clientes de la empresa.

Permite almacenar:

- Nombre.
- Correo electrónico.
- Teléfono.
- Ciudad.

Incluye operaciones de creación, consulta, edición y eliminación de acuerdo con los permisos del usuario.

---

# 🏭 Proveedores

Permite administrar los proveedores utilizados para las compras de mercancía.

Los proveedores pueden asociarse a las compras registradas dentro del ERP.

---

# 💰 Ventas

El módulo de ventas permite registrar operaciones con múltiples productos.

El sistema permite:

- Seleccionar cliente.
- Agregar múltiples productos.
- Seleccionar cantidades.
- Validar stock disponible.
- Calcular subtotales.
- Calcular el total de la venta.
- Registrar el vendedor responsable.
- Actualizar automáticamente el inventario.
- Consultar ventas registradas.

Cada venta almacena sus productos mediante detalles de venta.

---

# 🧾 Historial de ventas

Permite consultar las ventas registradas.

La información incluye:

- Folio.
- Fecha.
- Cliente.
- Vendedor.
- Cantidad de productos.
- Total.

También es posible consultar el detalle individual de una venta.

---

# 🛒 Compras

El módulo de compras permite registrar entrada de mercancía proveniente de proveedores.

Permite:

- Seleccionar proveedor.
- Agregar productos.
- Registrar cantidades.
- Registrar costos.
- Calcular totales.
- Actualizar existencias.
- Consultar historial de compras.
- Consultar el detalle de cada compra.

---

# 📦 Inventario

El módulo de inventario permite consultar las existencias actuales de los productos.

También incluye operaciones administrativas para realizar ajustes de inventario.

El sistema mantiene el stock actualizado mediante las operaciones realizadas en ventas y compras.

---

# 👤 Administración de usuarios

Los administradores pueden gestionar los usuarios que tienen acceso al ERP.

Funciones:

- Consultar usuarios.
- Crear usuarios.
- Editar usuarios.
- Asignar roles.
- Activar usuarios.
- Desactivar usuarios.
- Restablecer contraseñas.

Los roles disponibles actualmente son:

```text
ADMIN
EMPLEADO
```

---

# 📊 Dashboard

El sistema incluye un dashboard conectado al backend que muestra información obtenida desde PostgreSQL.

Incluye indicadores como:

- Ventas del día.
- Ingresos del día.
- Número de productos.
- Número de categorías.
- Número de clientes.
- Productos con stock bajo.
- Valor del inventario.
- Ingresos de los últimos 7 días.
- Productos más vendidos.

Las estadísticas se presentan mediante tarjetas, tablas y gráficas.

---

# 📈 Reportes

El módulo de reportes permite seleccionar un rango de fechas y consultar información del negocio.

Incluye:

- Número de ventas.
- Ingresos.
- Número de compras.
- Egresos.
- Resultado aproximado del periodo.
- Clientes registrados.
- Productos registrados.
- Productos más vendidos.
- Ventas del periodo.
- Compras del periodo.

Los reportes pueden exportarse a:

- Excel.
- PDF.

> El resultado aproximado mostrado en reportes se calcula utilizando los ingresos y egresos registrados en el periodo y no pretende sustituir un cálculo contable completo de utilidad.

---

# 🛠️ Tecnologías

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Recharts
- Fetch API
- SheetJS / XLSX
- jsPDF
- jsPDF AutoTable

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- bcrypt
- JSON Web Token (JWT)

## Base de datos

- PostgreSQL

## Herramientas

- Git
- GitHub
- npm
- Postman
- Prisma Studio
- Visual Studio Code

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura separada entre frontend, backend y base de datos.

```text
                    ┌─────────────────────┐
                    │       Usuario       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     TypeScript      │
                    │    Tailwind CSS     │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Express.js     │
                    │       Node.js       │
                    │     TypeScript      │
                    └──────────┬──────────┘
                               │
                    JWT / Middlewares / Roles
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Prisma        │
                    │        ORM          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    └─────────────────────┘
```

---

# 📁 Estructura del proyecto

```text
ERP-Empresarial/
│
├── Frontend/
│   └── erp-profesional/
│       │
│       ├── src/
│       │   ├── layouts/
│       │   ├── paginas/
│       │   ├── rutas/
│       │   ├── servicios/
│       │   ├── tipos/
│       │   ├── utilidades/
│       │   ├── App.tsx
│       │   └── main.tsx
│       │
│       ├── package.json
│       └── vite.config.ts
│
├── backend/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── server.ts
│   │
│   ├── prisma.config.ts
│   └── package.json
│
└── README.md
```

---

# 🔄 Flujo de la aplicación

```text
Usuario
   │
   ▼
React
   │
   │ HTTP Request
   ▼
Express API
   │
   ▼
verificarToken
   │
   ▼
Control de roles
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

---

# 🔐 Autenticación

Cuando un usuario inicia sesión:

```text
Correo + contraseña
        │
        ▼
      Backend
        │
        ▼
Validación de usuario
        │
        ▼
 bcrypt.compare()
        │
        ▼
     JWT generado
        │
        ▼
     Frontend
        │
        ▼
   localStorage
```

Las peticiones protegidas utilizan:

```http
Authorization: Bearer <token>
```

El backend valida el token antes de permitir acceso a los recursos protegidos.

---

# 🗃️ Modelo de datos

Entre las principales entidades del sistema se encuentran:

```text
Usuario
Cliente
Producto
Categoria
Proveedor
Venta
DetalleVenta
Compra
DetalleCompra
Inventario / Movimientos
```

Ejemplo de relaciones principales:

```text
Categoria
    │
    └──────< Producto

Cliente
    │
    └──────< Venta
                │
                └──────< DetalleVenta >────── Producto

Proveedor
    │
    └──────< Compra
                │
                └──────< DetalleCompra >───── Producto

Usuario
    │
    ├──────< Venta
    │
    └──────< operaciones administrativas
```

---

# ⚙️ Instalación

## Requisitos

Antes de ejecutar el proyecto necesitas:

- Node.js
- npm
- PostgreSQL
- Git

---

## 1. Clonar repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
```

Entrar al proyecto:

```bash
cd ERP-Empresarial
```

---

# 🖥️ Backend

Entrar a:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo:

```text
.env
```

Configurar las variables de entorno necesarias para la conexión a PostgreSQL y autenticación.

Ejemplo:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/erp_manager?schema=public"

JWT_SECRET="CAMBIA_ESTA_CLAVE_POR_UNA_SEGURA"
```

> Nunca subas el archivo `.env` al repositorio.

---

## Configurar Prisma

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Opcionalmente puedes abrir Prisma Studio:

```bash
npx prisma studio
```

---

## Ejecutar backend

```bash
npm run dev
```

Por defecto, durante el desarrollo la API puede ejecutarse en:

```text
http://localhost:3001
```

---

# 🌐 Frontend

Desde la raíz del proyecto:

```bash
cd Frontend/erp-profesional
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Vite mostrará la dirección local de la aplicación, normalmente:

```text
http://localhost:5173
```

---

# 🔌 API

La aplicación consume una API REST.

Algunos de los recursos disponibles son:

```text
/api/auth
/api/productos
/api/categorias
/api/clientes
/api/ventas
/api/proveedores
/api/compras
/api/inventario
/api/usuarios
/api/dashboard
/api/reportes
```

Las rutas privadas requieren autenticación.

Ejemplo:

```http
Authorization: Bearer <JWT>
```

---

# 📷 Cómo agregar las capturas

Crea esta estructura:

```text
ERP-Empresarial/
│
├── docs/
│   └── images/
│       ├── login.png
│       ├── dashboard.png
│       ├── productos.png
│       ├── nueva-venta.png
│       ├── inventario.png
│       └── reportes.png
│
└── README.md
```

Después toma capturas reales de cada pantalla y guárdalas con esos nombres.

GitHub las mostrará automáticamente dentro del README.

---

# 🧪 Pruebas manuales recomendadas

Antes de desplegar el proyecto es recomendable verificar:

- Inicio de sesión correcto.
- Rechazo de credenciales incorrectas.
- Restricciones ADMIN/EMPLEADO.
- Creación y modificación de productos.
- Validación de SKU duplicado.
- Creación de clientes.
- Registro de ventas.
- Validación de stock.
- Actualización de inventario después de una venta.
- Registro de compras.
- Actualización de inventario después de una compra.
- Activación/desactivación de usuarios.
- Cambio de contraseña.
- Reportes por rango de fechas.
- Exportación a Excel.
- Exportación a PDF.

---

# 🔒 Seguridad

El proyecto implementa diferentes medidas de seguridad:

- Contraseñas almacenadas mediante hash.
- bcrypt para validación de contraseñas.
- Autenticación JWT.
- Tokens con expiración.
- Middleware de autenticación.
- Middleware de autorización por roles.
- Validaciones en backend.
- Rutas protegidas en frontend.
- Variables sensibles mediante `.env`.

La seguridad de las operaciones no depende únicamente de ocultar elementos en React. Los permisos también son comprobados por el backend.

---

# 🎯 Objetivo del proyecto

Este proyecto fue desarrollado con el objetivo de aplicar conceptos utilizados en aplicaciones empresariales reales:

- Arquitectura frontend/backend.
- Diseño de APIs REST.
- Autenticación.
- Autorización.
- Control de roles.
- Modelado de bases de datos relacionales.
- ORM.
- Transacciones.
- Gestión de inventario.
- Manejo de estados en React.
- Consumo de APIs.
- Reportes.
- Exportación de información.
- Manejo de errores.

---

# 🔮 Posibles mejoras futuras

El alcance actual del proyecto está completo para su objetivo. Algunas extensiones posibles serían:

- Recuperación de contraseña mediante correo.
- Auditoría avanzada de operaciones.
- Pruebas automatizadas de integración.
- Contenedores Docker.
- CI/CD.
- Notificaciones.
- Facturación electrónica.
- Sistema multiempresa.

---


Desarrollado como proyecto Full Stack para portafolio profesional.

Tecnologías principales:

**React · TypeScript · Node.js · Express · Prisma · PostgreSQL · Tailwind CSS**

---

## ⭐ Estado del proyecto

🟢 Funcional / En etapa de preparación para despliegue y portafolio.
