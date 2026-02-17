# 🖥️ Retro CRT Terminal Website

Un sitio web personal estilo terminal retro con efectos CRT (tubo de rayos catódicos), construido con React, Vite y TypeScript.

## ✨ Características

- 🎨 **Interfaz Terminal Retro**: Diseño inspirado en terminales clásicas con efectos de pantalla CRT
- ⚡ **Secuencia de Inicio Animada**: Simulación de arranque del sistema con mensajes de consola
- 🔄 **Página de Mantenimiento**: Pantalla interactiva con animaciones de escritura tipo máquina
- 🎯 **Efectos Visuales**: Efectos de parpadeo (flicker) y escaneo característicos de monitores CRT
- 🌐 **Enlaces Sociales**: Integración con redes sociales (GitHub, Facebook, LinkedIn)
- 📱 **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- 🎨 **UI Moderna**: Construida con componentes Radix UI para una experiencia de usuario fluida

## 🛠️ Tecnologías Utilizadas

- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite 6.3.5** - Herramienta de construcción rápida
- **Radix UI** - Componentes de UI accesibles y sin estilos
- **Lucide React** - Iconos
- **Tailwind CSS** - Framework de CSS (configurado con clsx y tailwind-merge)
- **React Hook Form** - Manejo de formularios
- **Embla Carousel** - Carruseles responsivos
- **Recharts** - Gráficos para React

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 20 o superior recomendada)
- npm o yarn

### Pasos de Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ChrisAle117/Cmd.git
cd Cmd
```

2. Instala las dependencias:
```bash
npm install
```

## 🚀 Uso

### Modo Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

El sitio se abrirá automáticamente en `http://localhost:3000`

### Construcción para Producción

Construye la aplicación para producción:
```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `build/`

### Vista Previa de Producción

Previsualiza la construcción de producción:
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
Cmd/
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── components/        # Componentes de React
│   │   ├── ui/           # Componentes de UI reutilizables (Radix UI)
│   │   ├── FileExplorer.tsx
│   │   ├── MaintenancePage.tsx
│   │   ├── StartupSequence.tsx
│   │   └── Terminal.tsx
│   ├── styles/           # Estilos personalizados
│   ├── App.tsx           # Componente principal de la aplicación
│   ├── main.tsx          # Punto de entrada de la aplicación
│   └── index.css         # Estilos globales
├── index.html            # HTML principal
├── vite.config.ts        # Configuración de Vite
├── package.json          # Dependencias y scripts
└── README.md            # Este archivo

```

## 🎯 Componentes Principales

### StartupSequence
Muestra una secuencia de inicio animada con mensajes de terminal que simulan el arranque del sistema. Incluye efectos de cursor parpadeante y permite al usuario saltar la animación.

### MaintenancePage
Página de mantenimiento con efecto de escritura tipo máquina y enlaces a redes sociales. Incluye reloj en tiempo real y animaciones fluidas.

### Terminal
Componente de terminal interactivo (en desarrollo) para simular comandos y respuestas de consola.

### FileExplorer
Explorador de archivos con interfaz retro para navegar por el contenido (en desarrollo).

## ⚙️ Configuración

El proyecto utiliza Vite con las siguientes configuraciones personalizadas:

- **Puerto del servidor de desarrollo**: 3000
- **Directorio de salida**: `build/`
- **Base path configurable**: Se puede configurar mediante la variable de entorno `BASE_PATH` en producción
- **Alias de importación**: `@` apunta a `./src`
- **Target de construcción**: `esnext`

## 🎨 Características de Diseño

- Efectos de pantalla CRT con escaneo y parpadeo
- Paleta de colores retro inspirada en terminales clásicas
- Tipografía monoespaciada para el aspecto de terminal auténtico
- Animaciones suaves y transiciones
- Cursor animado parpadeante

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias y mejoras son bienvenidas. Si encuentras algún problema o tienes una idea para mejorar el proyecto, no dudes en abrir un issue o enviar un pull request.

## 📄 Licencia

Este proyecto es privado y está destinado para uso personal.

## 👤 Autor

**Chell's Corner**

- GitHub: [@ChrisAle117](https://github.com/ChrisAle117)

## 🙏 Agradecimientos

- Inspirado en terminales retro y diseños de pantallas CRT clásicas
- Construido con componentes de código abierto de la comunidad de React

---

**Estado**: 🚧 En mantenimiento - Trabajo en progreso

> *"Currently tinkering with things behind the scenes... Probably chasing CG or getting distracted by yet another side project."*
