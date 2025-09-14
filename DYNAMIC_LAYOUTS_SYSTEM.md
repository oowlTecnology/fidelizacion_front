# Sistema de Layouts Dinámicos

## 🎯 Objetivo
Crear un sistema de layouts que permita cambiar automáticamente entre diferentes layouts según el rol del usuario (admin, user, default).

## 🏗️ Arquitectura Implementada

### 1. Servicio de Layout (`LayoutService`)
**Archivo:** `src/app/shared/services/layout.service.ts`

- **Funcionalidad:** Maneja la lógica de selección de layout basada en el rol del usuario
- **Tipos de Layout:** `'admin' | 'user' | 'default'`
- **Reactivo:** Se actualiza automáticamente cuando cambia el usuario autenticado

```typescript
export class LayoutService {
  private currentLayoutSubject = new BehaviorSubject<LayoutType>('default');
  public currentLayout$ = this.currentLayoutSubject.asObservable();

  updateLayout(user: User | null): void {
    switch (user?.role) {
      case 'admin':
      case 'moderator':
        this.setLayout('admin');
        break;
      case 'user':
        this.setLayout('user');
        break;
      default:
        this.setLayout('default');
    }
  }
}
```

### 2. Componente Base (`BaseLayoutComponent`)
**Archivo:** `src/app/shared/layouts/base-layout/base-layout.component.ts`

- **Funcionalidad:** Layout base reutilizable con header, navegación y área de contenido
- **Características:**
  - Header con logo y título configurable
  - Navegación dinámica basada en `navigationItems`
  - Información del usuario
  - Botón de logout
  - Router outlet para contenido

### 3. Layouts Específicos

#### Admin Layout (`AdminLayoutComponent`)
**Archivo:** `src/app/shared/layouts/admin-layout/admin-layout.component.ts`

- **Navegación:** Dashboard, Usuarios, Configuración, Reportes
- **Título:** "Panel de Administración"
- **Usuarios:** Admin y Moderator

#### User Layout (`UserLayoutComponent`)
**Archivo:** `src/app/shared/layouts/user-layout/user-layout.component.ts`

- **Navegación:** Mi Dashboard, Mi Perfil, Mis Actividades, Configuración
- **Título:** "Mi Cuenta"
- **Usuarios:** User

#### Default Layout (`DefaultLayoutComponent`)
**Archivo:** `src/app/shared/layouts/default-layout/default-layout.component.ts`

- **Funcionalidad:** Layout simple para usuarios no autenticados
- **Características:** Header básico sin navegación específica

### 4. Componente Dinámico (`DynamicLayoutComponent`)
**Archivo:** `src/app/shared/layouts/dynamic-layout/dynamic-layout.component.ts`

- **Funcionalidad:** Cambia automáticamente entre layouts según el estado actual
- **Reactivo:** Se suscribe a cambios en el `LayoutService`
- **Lógica:** Renderiza el layout apropiado usando `@if` de Angular 17+

```typescript
template: `
  @if (currentLayout === 'admin') {
    <app-admin-layout></app-admin-layout>
  }
  @else if (currentLayout === 'user') {
    <app-user-layout></app-user-layout>
  }
  @else {
    <app-default-layout></app-default-layout>
  }
`
```

### 5. Componente Wrapper (`AppLayoutComponent`)
**Archivo:** `src/app/shared/components/app-layout/app-layout.component.ts`

- **Funcionalidad:** Wrapper principal que contiene el sistema de layouts
- **Integración:** Conecta el sistema de layouts con el routing de Angular

## 🛣️ Configuración de Rutas

**Archivo:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard]
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
      }
    ]
  }
];
```

## 🔄 Flujo de Funcionamiento

1. **Usuario se autentica** → `AuthState` se actualiza
2. **LayoutService detecta cambio** → Actualiza el layout según el rol
3. **DynamicLayoutComponent reacciona** → Cambia el layout renderizado
4. **Navegación específica** → Se muestra según el rol del usuario
5. **Contenido dinámico** → Router outlet renderiza las páginas correspondientes

## 🎨 Características de Diseño

### Admin Layout
- **Colores:** Azul/Indigo para elementos administrativos
- **Navegación:** Dashboard, Usuarios, Configuración, Reportes
- **Información:** Muestra rol completo (Admin/Moderator)

### User Layout
- **Colores:** Verde para elementos de usuario
- **Navegación:** Mi Dashboard, Mi Perfil, Mis Actividades, Configuración
- **Información:** Solo nombre del usuario

### Default Layout
- **Diseño:** Minimalista para usuarios no autenticados
- **Navegación:** Solo logo/título
- **Uso:** Páginas públicas o de error

## 🚀 Beneficios del Sistema

- ✅ **Layouts específicos** para cada tipo de usuario
- ✅ **Cambio automático** según el rol
- ✅ **Reutilización** de componentes base
- ✅ **Mantenibilidad** fácil de layouts
- ✅ **Escalabilidad** para nuevos roles
- ✅ **Consistencia** en la experiencia de usuario

## 🧪 Cómo Probar

1. **Ejecuta la aplicación:** `npm start`
2. **Login como Admin:** `admin@admin.com` / `admin`
   - Deberías ver el layout de administración
   - Navegación: Dashboard, Usuarios, Configuración, Reportes
3. **Cambia a usuario normal** (si tienes uno configurado)
   - Deberías ver el layout de usuario
   - Navegación: Mi Dashboard, Mi Perfil, etc.

## 📁 Estructura de Archivos

```
src/app/shared/
├── services/
│   └── layout.service.ts
├── layouts/
│   ├── base-layout/
│   │   └── base-layout.component.ts
│   ├── admin-layout/
│   │   └── admin-layout.component.ts
│   ├── user-layout/
│   │   └── user-layout.component.ts
│   ├── default-layout/
│   │   └── default-layout.component.ts
│   └── dynamic-layout/
│       └── dynamic-layout.component.ts
└── components/
    └── app-layout/
        └── app-layout.component.ts
```

---

**¡El sistema de layouts dinámicos está completamente implementado y funcionando!** 🎉

Ahora puedes tener diferentes experiencias de usuario según su rol, con navegación y diseño específicos para cada tipo de usuario.
