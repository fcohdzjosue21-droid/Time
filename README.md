# 🌍 World Clock — Comparador de Zonas Horarias

Aplicación web interactiva que permite comparar la hora actual de diferentes ciudades del mundo en tiempo real, con **relojes analógicos animados**, efectos visuales dinámicos y una interfaz premium.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Características

### 🎨 Interfaz Premium
- Tema oscuro con **orbes de color animados** y grid sutil de fondo
- **Glassmorphism** en tarjetas y componentes
- Tipografía profesional (Inter + JetBrains Mono para dígitos)
- Diseño 100% responsivo (desktop, tablet, móvil)

### ⏱️ Relojes Animados
- **Reloj analógico principal** con manecillas en tiempo real (horas, minutos, segundos)
- **Mini reloj analógico** en cada tarjeta de ciudad
- **Dígitos con animación pop** — cada cambio de segundo genera un efecto visual
- **Dos puntos parpadeantes** `:` entre horas, minutos y segundos
- Indicador de **pulso verde** (en vivo)

### 🌎 Comparación Global
- **+30 ciudades** de 6 continentes
- **Buscador inteligente** con vista previa de hora en el dropdown
- **Chips de acceso rápido** para ciudades populares
- **Tarjetas interactivas** con:
  - Hora digital + analógica en vivo
  - Indicador de día/noche ☀️🌙 con degradado visual
  - Diferencia horaria desde tu ubicación
  - Offset UTC
  - Animación de entrada escalonada
- **Tabla comparativa** con todas las ciudades seleccionadas
- **Persistencia** — tus ciudades se guardan automáticamente

### �️ Micro-interacciones
- Hover con elevación y borde luminoso en tarjetas
- Barra superior de gradiente al pasar el cursor
- Botón de eliminar con rotación animada
- Dropdown con animación de deslizamiento
- Tecla `Esc` para cerrar la búsqueda

## 🚀 Inicio rápido

### Opción 1 — Abrir directamente

Abre `index.html` en tu navegador.

### Opción 2 — Servidor local

```bash
# Con npx (no necesitas instalar nada)
npx http-server . -p 8080

# O con Python
python -m http.server 8080
```

Luego abre [http://localhost:8080](http://localhost:8080).

## 🏙️ Ciudades disponibles

| Región | Ciudades |
|--------|----------|
| 🌎 América | Ciudad de México, Nueva York, Los Ángeles, Chicago, Toronto, Vancouver, Bogotá, Lima, Buenos Aires, São Paulo, Santiago, Honolulú, Anchorage |
| 🌍 Europa | Londres, París, Madrid, Berlín, Roma, Moscú, Estambul |
| 🌏 Asia | Dubái, Mumbai, Bangkok, Shanghái, Hong Kong, Tokio, Seúl |
| 🌏 Oceanía | Sídney, Auckland |
| 🌍 África | El Cairo, Lagos, Nairobi, Johannesburgo |

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Animaciones, gradientes, glassmorphism, responsivo |
| JavaScript (Vanilla) | Zonas horarias con `Intl.DateTimeFormat`, relojes analógicos |
| Google Fonts | Inter (UI) + JetBrains Mono (dígitos) |

## 📁 Estructura

```
time/
├── index.html   # Página principal
├── style.css    # Estilos, animaciones y tema
├── app.js       # Lógica de relojes y gestión
└── README.md    # Documentación
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crea tu rama (`git checkout -b feature/nueva-ciudad`)
3. Commit de tus cambios (`git commit -m 'Agregar nueva ciudad'`)
4. Push (`git push origin feature/nueva-ciudad`)
5. Abre un Pull Request

## 📄 Licencia

MIT — Consulta el archivo [LICENSE](LICENSE) para detalles.

---

<p align="center">Hecho con ☕ &amp; 🌎</p>
