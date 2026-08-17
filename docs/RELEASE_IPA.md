# Cómo integrar esto en app-efe

## 1. Copiar carpetas

Del zip, copiá dentro de tu repo `app-efe` (raíz):

```
apps/efe/                                -> pegar tal cual en la raíz del repo (nueva carpeta)
scripts/merge-source.mjs                 -> pegar tal cual en la raíz del repo (nueva carpeta scripts/)
.github/workflows/build-efe-ipa.yml      -> pegar junto a scraper-semanal.yml
```

## 2. Copiar el frontend actual dentro de apps/efe/www/

Estos archivos, que hoy están en la raíz de app-efe, se COPIAN (no se mueven, la raíz
sigue sirviendo la PWA en Vercel) dentro de `apps/efe/www/`:

```
index.html
app.js
style.css
estaciones.js
manifest.json
service-worker.js
icons/
```

`horarios.json`, `efe/estaciones.json`, `efe/feriados.json` y `version.json` NO hace falta
copiarlos a mano — el workflow los copia automáticamente a `www/data/` en cada build.

## 3. Secret ya existente

El workflow reutiliza el mismo secret que ya tenías en `testGeneratorIp`:

- `DIST_REPO_TOKEN`: Personal Access Token con permiso `contents:write` sobre el repo `testIpa`.

Agregalo también en `app-efe` si no está (Settings → Secrets and variables → Actions).

## 4. Cuándo se dispara

Corre automáticamente en push a `main` que toque `apps/efe/**`, y manualmente desde
Actions ("Run workflow").

## 5. Verificación de bundle ID

`PRODUCT_BUNDLE_IDENTIFIER` en `apps/efe/ios/App/App.xcodeproj/project.pbxproj` y
`appId` en `apps/efe/capacitor.config.json` DEBEN coincidir (`com.night.efe`). Si en
algún momento cambiás uno, cambiá el otro a mano — `cap sync` no los sincroniza entre sí.
