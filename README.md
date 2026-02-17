# 🚉 Biotren App - Horarios Offline

<div align="center">

![Biotren](https://img.shields.io/badge/Biotren-Concepción-red?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge)
![Offline](https://img.shields.io/badge/Offline-First-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Consulta los horarios del Biotren de Concepción de forma rápida, sin conexión y con tus rutas favoritas.**

[🚀 Demo](#) • [📱 Instalar](#instalación) • [🛠️ Desarrollo](#desarrollo)

</div>

---

## ✨ Características

### 🌟 Funcionalidades Principales

- **📍 Rutas Favoritas**: Guarda tus rutas más frecuentes y consúltalas con un solo toque
- **📶 Funciona Offline**: Toda la información disponible sin conexión a internet
- **⚡ Tiempo Real**: Consulta horarios basados en la hora actual
- **🔄 Actualizaciones Automáticas**: La app se actualiza automáticamente cuando hay nuevos horarios
- **📅 Detecta Feriados**: Te avisa cuando el Biotren no opera por feriados
- **🔀 Rutas con Combinación**: Encuentra automáticamente rutas que requieren hacer combinación en Concepción

### 🎨 Experiencia de Usuario

- ✅ Diseño oscuro moderno y elegante
- ✅ Responsive - funciona en móviles, tablets y desktop
- ✅ PWA instalable como app nativa
- ✅ Interfaz intuitiva y rápida
- ✅ Scroll infinito en resultados de favoritos
- ✅ Modal adaptable al teclado en dispositivos móviles

---

## 🚀 Uso Rápido

### 📱 Consulta Manual

1. Selecciona **cuándo viajas** (Hoy, Lunes-Viernes, Sábado, Domingo/Feriado)
2. Elige tu **estación de origen**
3. Elige tu **estación de destino**
4. Presiona **"Consultar Horarios"**

### ⭐ Rutas Favoritas

1. Toca **"+ Nueva ruta"**
2. Dale un nombre (ej: "Trabajo", "Casa", "Universidad")
3. Selecciona origen y destino
4. Guarda y ¡listo! Ahora puedes consultar con un toque en **"Consultar"**

---

## 📦 Instalación

### Como PWA (Recomendado)

#### En iOS (iPhone/iPad):
1. Abre la app en Safari
2. Toca el botón **Compartir** (⬆️)
3. Selecciona **"Añadir a pantalla de inicio"**
4. ¡Listo! Ahora tienes la app instalada

#### En Android:
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**
4. ¡Listo!

### Desarrollo Local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/biotren-app.git

# Entra al directorio
cd biotren-app

# Abre con Live Server o cualquier servidor local
# No requiere instalación de dependencias
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Diseño responsive con variables CSS |
| **JavaScript (Vanilla)** | Lógica de la aplicación |
| **Service Worker** | Caché offline y actualizaciones |
| **LocalStorage** | Persistencia de datos y favoritos |
| **PWA** | Instalación como app nativa |

---

## 📂 Estructura del Proyecto

```
biotren-app/
│
├── index.html              # Página principal
├── style.css              # Estilos de la aplicación
├── app.js                 # Lógica principal
├── estaciones.js          # Datos de las estaciones
├── horarios.json          # Base de datos de horarios
├── service-worker.js      # Service Worker para PWA
├── manifest.json          # Manifiesto PWA
│
└── icons/                 # Iconos de la aplicación
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── ...
```

---

## 🎯 Características Técnicas

### Offline-First
- Toda la app funciona sin conexión
- Service Worker cachea todos los recursos
- Datos almacenados en LocalStorage
- Actualizaciones automáticas cuando hay conexión

### Optimizaciones Móviles
- Modal adaptable al teclado virtual
- Scroll táctil optimizado
- Media queries para diferentes dispositivos
- Viewport configurado para mejor experiencia

### Gestión de Datos
- Detección automática de actualizaciones
- Sistema de versionado de horarios
- Caché inteligente
- Manejo de feriados chilenos

---

## 🔧 Desarrollo

### Actualizar Horarios

Edita el archivo `horarios.json`:

```json
{
  "ultima_update": "2025-02-17",
  "rutas": {
    "16-35": {
      "laboral": [
        {"s": "06:00", "ll": "06:45", "d": "45min", "v": 880}
      ]
    }
  },
  "feriados": ["2025-05-01", "2025-09-18"],
  "feriados_info": [
    {"fecha": "2025-05-01", "nombre": "Día del Trabajo"}
  ]
}
```

### Service Worker

El Service Worker se actualiza automáticamente:
- Verifica nuevas versiones cada hora
- Actualiza en segundo plano
- Recarga la página cuando hay nueva versión

---

## 🌐 Líneas Disponibles

### Línea 1
Alameda - Concepción - Hualqui - Chiguayante

### Línea 2
Concepción - Talcahuano - Coronel - Lota - Laraquete

---

## 📊 Horarios Disponibles

- 🕐 **Lunes a Viernes**: Horario laboral completo
- 🕑 **Sábados**: Horario reducido
- 🕒 **Domingos y Feriados**: Servicio no disponible

---

## 🤝 Contribuir

¿Encontraste un bug o tienes una idea?

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

- [ ] Notificaciones push para próximos trenes
- [ ] Historial de viajes
- [ ] Compartir rutas con amigos
- [ ] Widget de pantalla de inicio
- [ ] Modo oscuro/claro
- [ ] Integración con mapas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Twitter: [@tu-usuario](https://twitter.com/tu-usuario)

---

## 🙏 Agradecimientos

- Datos de horarios provistos por EFE (Empresa de los Ferrocarriles del Estado)
- Iconos de [Lucide Icons](https://lucide.dev/)
- Inspiración de la comunidad de Concepción

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

Hecho con ❤️ para la comunidad de Concepción

</div>
