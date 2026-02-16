# 🚂 EFE Biotrén

Script automático para obtener horarios actualizados del Biotrén.

## 📁 Archivos

- `index.js` - Script principal del scraper
- `estaciones.html` - Lista de estaciones (origen de datos)
- `feriados.json` - Feriados de Chile 2026
- `package.json` - Dependencias Node.js

## 🔄 Funcionamiento

1. El scraper se ejecuta **automáticamente cada lunes a las 6:00 AM** (hora Chile)
2. Obtiene horarios para el **próximo fin de semana** (viernes, sábado, domingo)
3. Genera `horarios.json` en la **raíz del proyecto** (no en `/efe`)
4. Notifica al webhook de Discord el resultado

## 🚀 Ejecución manual
```bash
cd efe
npm install
node index.js
```

## 📊 Salida

El archivo `horarios.json` se genera en la raíz del repositorio con la estructura:
```json
{
  "ultima_update": "17-02-2026, 06:00:15",
  "fechas_scrapeadas": {
    "viernes": "2026-02-20",
    "sabado": "2026-02-21",
    "domingo": "2026-02-22"
  },
  "feriados": ["2026-01-01", ...],
  "rutas": { ... }
}
```

## ⚙️ Configuración GitHub Actions

Ver `.github/workflows/scraper-semanal.yml`

### Secretos necesarios:
- `DISCORD_WEBHOOK_URL` - Webhook de Discord para notificaciones
