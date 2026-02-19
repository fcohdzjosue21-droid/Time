# 🌍 World Day & Night Map

Mapa mundial interactivo que muestra en tiempo real las zonas de **día** y **noche** en la Tierra, con animación suave, ciudades con hora local, y controles de velocidad.

## ✨ Características

- **Mapa completo** — Imagen NASA Blue Marble con proyección equirectangular
- **Zona de noche** — Sombra oscura calculada con geometría solar real
- **Crepúsculo** — Gradiente suave de 6° de transición (crepúsculo civil)
- **29 ciudades** — Puntos brillantes con hora local al hacer hover
- **Sol animado** ☀️ — Marca el punto sub-solar donde es mediodía exacto
- **Controles de velocidad** — 1×, 1min/s, 6min/s, 1h/s
- **Reset** — Botón para volver al tiempo real

## 🚀 Cómo usar

1. Abre `index.html` en tu navegador, o ejecuta un servidor local:

```bash
npx -y http-server . -p 3000 -o
```

2. El mapa se carga automáticamente
3. Pasa el cursor sobre una ciudad para ver su hora local
4. Usa los botones de velocidad para ver la animación del terminador solar

## 🛠️ Tecnologías

- **HTML5 Canvas** para renderizado en tiempo real
- **JavaScript puro** — sin dependencias externas
- **CSS3** con glassmorphism y diseño responsivo
- **Algoritmos astronómicos** — Cálculo real de declinación solar y ecuación del tiempo
