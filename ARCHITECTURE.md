# Arquitectura del Proyecto Fidelización

## Estructura de Carpetas

```
src/app/
├── core/                    # Módulo core - Servicios base y funcionalidades esenciales
│   ├── guards/             # Guards de autenticación y autorización
│   ├── interceptors/       # Interceptors HTTP
│   ├── models/             # Modelos de datos base
│   ├── services/           # Servicios fundamentales
│   └── core.module.ts      # Módulo core
├── shared/                 # Módulo shared - Componentes reutilizables
│   ├── components/         # Componentes compartidos
│   ├── directives/         # Directivas personalizadas
│   ├── pipes/              # Pipes personalizados
│   ├── models/             # Modelos compartidos
│   └── shared.module.ts    # Módulo shared
├── features/               # Módulos de funcionalidades específicas
│   ├── auth/               # Módulo de autenticación
│   │   ├── components/     # Componentes de auth
│   │   ├── services/       # Servicios de auth
│   │   ├── models/         # Modelos de auth
│   │   └── auth.module.ts  # Módulo de auth
│   ├── dashboard/          # Módulo de dashboard
│   │   ├── components/     # Componentes del dashboard
│   │   ├── services/       # Servicios del dashboard
│   │   ├── models/         # Modelos del dashboard
│   │   └── dashboard.module.ts
│   └── users/              # Módulo de usuarios
│       ├── components/     # Componentes de usuarios
│       ├── services/       # Servicios de usuarios
│       ├── models/         # Modelos de usuarios
│       └── users.module.ts
├── store/                  # Store de NGXS
│   ├── actions/            # Acciones de NGXS
│   ├── states/             # Estados de NGXS
│   ├── models/             # Modelos del store
│   ├── store.config.ts     # Configuración del store
│   └── index.ts            # Exports del store
├── app.config.ts           # Configuración de la aplicación
├── app.routes.ts           # Rutas de la aplicación
├── app.ts                  # Componente principal
├── app.html                # Template principal
└── app.scss                # Estilos principales
```

## Tecnologías Utilizadas

- **Angular 20**: Framework principal
- **NGXS**: Gestión de estado
- **Tailwind CSS**: Framework de estilos
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva

## Módulos

### Core Module
Contiene servicios y funcionalidades esenciales que se cargan una sola vez:
- Servicios base (API, Auth)
- Guards de autenticación
- Interceptors HTTP
- Modelos base

### Shared Module
Componentes y funcionalidades reutilizables:
- Componentes UI (Button, Loading, etc.)
- Directivas personalizadas
- Pipes personalizados
- Modelos compartidos

### Feature Modules
Módulos específicos por funcionalidad:
- **Auth Module**: Autenticación y autorización
- **Dashboard Module**: Panel principal
- **Users Module**: Gestión de usuarios

## Store (NGXS)

### Estados
- **AuthState**: Gestión de autenticación
- **UsersState**: Gestión de usuarios
- **DashboardState**: Estadísticas del dashboard

### Acciones
Cada estado tiene sus propias acciones para:
- Cargar datos
- Crear/actualizar/eliminar entidades
- Manejo de errores
- Estados de carga

## Rutas

- `/` → Redirige a `/dashboard`
- `/auth/*` → Módulo de autenticación (solo para usuarios no autenticados)
- `/dashboard` → Panel principal (requiere autenticación)
- `/users` → Gestión de usuarios (requiere autenticación)
- `/**` → Redirige a `/dashboard`

## Guards

- **AuthGuard**: Protege rutas que requieren autenticación
- **GuestGuard**: Protege rutas que solo pueden acceder usuarios no autenticados

## Servicios

### ApiService
Servicio base para todas las llamadas HTTP con:
- Manejo de errores centralizado
- Interceptores automáticos
- Tipado fuerte

### AuthService
Gestión de autenticación con:
- Login/logout
- Gestión de tokens
- Estado de usuario actual

## Componentes

### Componentes Shared
- **ButtonComponent**: Botón reutilizable con diferentes estilos
- **LoadingComponent**: Indicador de carga

### Componentes de Features
- **LoginComponent**: Formulario de login
- **DashboardComponent**: Panel principal con estadísticas
- **UsersListComponent**: Lista de usuarios con paginación

## Estilos

El proyecto utiliza Tailwind CSS para los estilos, con clases utilitarias para:
- Layout y spacing
- Colores y tipografía
- Estados interactivos
- Responsive design

## Configuración

### Environment
- `environment.ts`: Configuración de desarrollo
- `environment.prod.ts`: Configuración de producción

### Store Config
Configuración de NGXS con:
- DevTools habilitado en desarrollo
- Logger habilitado en desarrollo
- Router plugin para sincronización de rutas

## Próximos Pasos

1. Implementar interceptores HTTP para tokens
2. Agregar más componentes shared
3. Implementar lazy loading para módulos
4. Agregar tests unitarios
5. Implementar manejo de errores global
6. Agregar validaciones de formularios
7. Implementar notificaciones toast
