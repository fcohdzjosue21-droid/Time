# 🌍 World Clock — Comparador de Zonas Horarias

Aplicación web que permite comparar la hora actual de diferentes ciudades del mundo en tiempo real.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Características

- ⏱️ **Reloj local en vivo** — muestra tu hora, fecha y zona horaria actual
- 🌎 **+30 ciudades** — Nueva York, Londres, Tokio, Sídney, Buenos Aires, y muchas más
- 🔍 **Buscador inteligente** — filtra ciudades por nombre, país o zona horaria
- 🃏 **Tarjetas interactivas** — cada ciudad muestra hora en vivo, fecha, indicador día/noche, diferencia horaria y offset UTC
- 📊 **Tabla comparativa** — vista general de todas las ciudades seleccionadas
- 💾 **Persistencia** — tus ciudades se guardan en `localStorage`
- 🔄 **Actualización en tiempo real** — se actualiza cada segundo
- 🎨 **Diseño premium** — tema oscuro con orbes animados, glassmorphism y micro-animaciones

## 📸 Vista previa

| Reloj local | Tarjetas de ciudades | Tabla comparativa |
|:-----------:|:-------------------:|:-----------------:|
| Hora, fecha y zona horaria detectada automáticamente | Hora en vivo con badges de día/noche ☀️🌙 | Comparación de todas las ciudades en una tabla |

## 🚀 Inicio rápido

### Opción 1 — Abrir directamente

Simplemente abre `index.html` en tu navegador.

### Opción 2 — Servidor local

```bash
# Con npx (no necesitas instalar nada)
npx http-server . -p 8080

# O con Python
python -m http.server 8080
```

Luego abre [http://localhost:8080](http://localhost:8080) en tu navegador.

## 🏙️ Ciudades disponibles

| Región | Ciudades |
|--------|----------|
| 🌎 América | Ciudad de México, Nueva York, Los Ángeles, Chicago, Toronto, Vancouver, Bogotá, Lima, Buenos Aires, São Paulo, Santiago, Honolulú, Anchorage |
| 🌍 Europa | Londres, París, Madrid, Berlín, Roma, Moscú, Estambul |
| 🌏 Asia | Dubái, Mumbai, Bangkok, Shanghái, Hong Kong, Tokio, Seúl |
| 🌏 Oceanía | Sídney, Auckland |
| 🌍 África | El Cairo, Lagos, Nairobi, Johannesburgo |

## 🛠️ Tecnologías

- **HTML5** — estructura semántica
- **CSS3** — animaciones, gradientes, glassmorphism, diseño responsivo
- **JavaScript (Vanilla)** — lógica de zonas horarias con `Intl.DateTimeFormat`
- **Google Fonts** — tipografía Inter

## 📁 Estructura del proyecto

```
time/
├── index.html   # Página principal
├── style.css    # Estilos y animaciones
├── app.js       # Lógica de relojes y gestión de ciudades
└── README.md    # Este archivo
```

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea tu rama (`git checkout -b feature/nueva-ciudad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar nueva ciudad'`)
4. Push a la rama (`git push origin feature/nueva-ciudad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">Hecho con ☕ &amp; 🌎</p>
