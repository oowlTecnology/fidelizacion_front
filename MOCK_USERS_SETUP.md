# Configuración de Usuarios Mockeados

## Usuario Administrador

Se ha configurado un usuario administrador mockeado para facilitar las pruebas de desarrollo:

### Credenciales de Acceso
- **Email:** `admin@admin.com`
- **Password:** `admin`

> **Nota:** La contraseña "admin" ahora es válida (mínimo 4 caracteres requeridos)

### Características del Usuario Admin
- **ID:** 1
- **Nombre:** Admin Usuario
- **Rol:** ADMIN
- **Estado:** Activo
- **Fecha de creación:** 15 de enero de 2024

## Funcionalidades Implementadas

### 1. Login Mockeado
- El `AuthService` detecta automáticamente las credenciales del admin
- Simula un delay de red de 1 segundo para realismo
- Genera tokens JWT mockeados
- Almacena la sesión en localStorage

### 2. Interfaz de Usuario Mejorada
- **Panel de credenciales:** Muestra las credenciales de prueba en la pantalla de login
- **Botón de autocompletado:** Permite llenar automáticamente los campos con las credenciales de prueba
- **Validación visual:** Indicadores de error en tiempo real con colores y mensajes
- **Indicadores visuales:** Diseño claro y profesional con Tailwind CSS

### 3. Datos Mockeados Completos

#### Dashboard
- **Total de usuarios:** 1,250
- **Usuarios activos:** 980
- **Nuevos usuarios:** 45
- **Ingresos totales:** $125,000.50

#### Lista de Usuarios
Se incluyen 10 usuarios de ejemplo con diferentes roles:
- 1 Admin (admin@admin.com)
- 3 Moderadores
- 6 Usuarios regulares
- Algunos usuarios inactivos para mostrar diferentes estados

### 4. Servicios Mockeados

#### AuthService
```typescript
// Detección automática de credenciales mock
private isMockLogin(credentials: LoginRequest): boolean {
  return credentials.email === 'admin@admin.com' && credentials.password === 'admin';
}
```

#### DashboardService
- Simula carga de estadísticas con delay de 800ms
- Retorna datos realistas para el dashboard

#### UsersService
- Simula paginación de usuarios
- Incluye operaciones CRUD mockeadas
- Delay de 600ms para simular llamadas de red

## Cómo Usar

### Opción 1: Autocompletado
1. Ve a la pantalla de login
2. Haz clic en "Usar Credenciales de Prueba"
3. Los campos se llenarán automáticamente
4. Haz clic en "Iniciar Sesión"

### Opción 2: Ingreso Manual
1. Ve a la pantalla de login
2. Ingresa manualmente:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Haz clic en "Iniciar Sesión"

## Navegación Post-Login

Después del login exitoso, serás redirigido automáticamente al dashboard donde podrás:
- Ver estadísticas generales
- Navegar a la gestión de usuarios
- Explorar todas las funcionalidades de la aplicación

## Notas Técnicas

- Los datos mock se almacenan en memoria durante la sesión
- Los tokens JWT son generados dinámicamente con timestamp
- La sesión persiste en localStorage hasta logout
- Todos los delays son configurables en los servicios

## Desarrollo Futuro

Para integrar con un backend real:
1. Remover la lógica de mock del `AuthService`
2. Configurar las URLs de API en `environment.ts`
3. Actualizar los servicios para usar `HttpClient` real
4. Implementar manejo de errores de red

---

**¡Tu aplicación está lista para pruebas con datos realistas!** 🚀
