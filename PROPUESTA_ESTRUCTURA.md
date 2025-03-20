# Propuesta de Reorganización de Estructura de Directorios

## Estructura Actual

Actualmente, el proyecto Separa tiene la siguiente estructura básica:

```
src/
  app/
    dashboard/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
    ui/
  config/
    env.json
  context/
    UIContext.tsx
  services/
    api.ts
  utils/
    dateUtils.ts
    helpers.ts
```

## Propuesta de Nueva Estructura

Propongo reorganizar la estructura de directorios de la siguiente manera para mejorar la escalabilidad, mantenimiento y separación de responsabilidades:

```
src/
  app/                      # Directorio de páginas (Next.js App Router)
    (auth)/                 # Grupo de rutas para autenticación
      login/
      register/
      forgot-password/
    dashboard/              # Página de dashboard
    reservations/           # Páginas relacionadas con reservas
    users/                  # Páginas relacionadas con usuarios
    layout.tsx              # Layout principal
    page.tsx                # Página principal
  components/               # Componentes reutilizables
    common/                 # Componentes comunes (Header, Footer, etc.)
    dashboard/              # Componentes específicos del dashboard
    forms/                  # Componentes de formularios
    layouts/                # Componentes de layout
    modals/                 # Componentes de modales
    tables/                 # Componentes de tablas
    ui/                     # Componentes UI básicos
  config/                   # Configuraciones
    env.json                # Variables de entorno
    constants.ts            # Constantes globales
    routes.ts               # Definición de rutas
  context/                  # Contextos de React
    auth/                   # Contexto de autenticación
    ui/                     # Contexto de UI
  features/                 # Características organizadas por dominio
    users/                  # Todo lo relacionado con usuarios
      components/           # Componentes específicos de usuarios
      hooks/                # Hooks específicos de usuarios
      services/             # Servicios de API para usuarios
      types/                # Tipos e interfaces para usuarios
    reservations/           # Todo lo relacionado con reservas
      components/
      hooks/
      services/
      types/
  hooks/                    # Hooks personalizados globales
    useForm.ts
    useLocalStorage.ts
    useMediaQuery.ts
  lib/                      # Bibliotecas y utilidades
    api/                    # Cliente API y configuración
      client.ts             # Configuración de Axios
      endpoints.ts          # Definición de endpoints
    validators/             # Funciones de validación
  services/                 # Servicios organizados por dominio
    auth.service.ts         # Servicios de autenticación
    users.service.ts        # Servicios de usuarios
    reservations.service.ts # Servicios de reservas
  styles/                   # Estilos globales
    globals.css
    variables.css
  types/                    # Tipos e interfaces globales
    index.ts                # Exportación de tipos
    models.ts               # Modelos de datos
  utils/                    # Utilidades
    date.utils.ts           # Utilidades de fecha
    format.utils.ts         # Utilidades de formato
    validation.utils.ts     # Utilidades de validación
  tests/                    # Pruebas
    mocks/                  # Datos de prueba
    utils/                  # Utilidades para pruebas
```

## Beneficios de la Nueva Estructura

1. **Organización por Dominio**: La carpeta `features` agrupa todo lo relacionado con un dominio específico (usuarios, reservas, etc.), facilitando la navegación y el mantenimiento.

2. **Separación Clara de Responsabilidades**: Cada carpeta tiene un propósito específico y bien definido.

3. **Escalabilidad**: La estructura propuesta facilita la adición de nuevas características sin afectar las existentes.

4. **Mejor Organización de Componentes**: Los componentes están organizados por función y dominio, lo que facilita encontrar y reutilizar componentes.

5. **Organización de Servicios API**: Los servicios están organizados por dominio, lo que facilita la gestión de las llamadas a la API.

6. **Tipos Centralizados**: Los tipos e interfaces están centralizados, lo que facilita su reutilización y mantenimiento.

## Recomendaciones Adicionales

1. **Implementar Barrel Files**: Utilizar archivos index.ts para exportar componentes y funciones, lo que simplifica las importaciones.

2. **Convenciones de Nomenclatura**:
   - Componentes: PascalCase (UserTable.tsx)
   - Hooks: camelCase con prefijo "use" (useAuth.ts)
   - Utilidades: camelCase con sufijo descriptivo (dateUtils.ts)
   - Servicios: camelCase con sufijo ".service" (users.service.ts)

3. **Documentación**: Añadir comentarios JSDoc a funciones y componentes importantes para facilitar su uso.

4. **Pruebas**: Organizar las pruebas siguiendo la misma estructura que el código fuente.

5. **Constantes**: Centralizar constantes en archivos dedicados para facilitar su mantenimiento.

Esta propuesta de reorganización mejorará significativamente la mantenibilidad y escalabilidad del proyecto Separa, facilitando el desarrollo y la colaboración entre el equipo.