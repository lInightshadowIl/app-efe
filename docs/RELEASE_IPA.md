# Cómo se genera el IPA

## Fuente única de verdad

`apps/efe/www/` **ya no se mantiene a mano**. En cada build, el workflow
corre `node scripts/sync-efe-www.mjs`, que copia automáticamente hacia
`apps/efe/www/`:

- `index.html`, `app.js`, `style.css`, `estaciones.js`, `manifest.json`,
  `service-worker.js`, `icons/` — tal cual están en la raíz del monorepo
  (la misma PWA que se sirve en Vercel).
- `horarios.json` y `version.json` — a la raíz de `www/`, la MISMA ruta
  relativa que `app.js` usa en `fetch("horarios.json")` /
  `fetch("version.json")`. Antes se copiaban a `www/data/`, una ruta que
  `app.js` nunca pedía, y por eso la app nativa no tenía datos en el
  primer arranque y toda la inicialización (selects de estaciones, botón
  "+ Nueva ruta", GPS) se caía en silencio.

Si necesitás abrir el proyecto en Xcode localmente, corré primero:

```bash
node scripts/sync-efe-www.mjs
```

**No edites nada dentro de `apps/efe/www/` directamente** — se sobreescribe
en cada build/sync. Cualquier cambio de lógica o UI va en los archivos de
la raíz (`index.html`, `app.js`, etc.), y automáticamente se refleja tanto
en la PWA como en el IPA.

## Diferencias PWA vs IPA (mismo código, comportamiento adaptado)

`index.html` incluye un bloque `PUENTE NATIVO` que detecta si corre dentro
de Capacitor (`window.Capacitor.isNativePlatform()`). En el navegador esto
es un no-op total; en la app nativa:

- **Geolocalización**: `navigator.geolocation.getCurrentPosition` se
  redirige al plugin nativo `@capacitor/geolocation`, que gestiona el
  permiso del sistema operativo de forma confiable (a diferencia de la
  Geolocation API del WebView, que en iOS puede fallar sin mostrar el
  diálogo si falta la key correspondiente en `Info.plist`). El resto de
  `app.js` no necesita saber la diferencia — sigue llamando a la misma API
  del navegador.
- **Service Worker**: no se registra en la app nativa. No hace falta: los
  archivos ya viajan empaquetados dentro del `.ipa`, así que no hay nada
  que cachear offline vía Service Worker (que además tiene soporte muy
  limitado en WKWebView).

Esto significa que **no hay dos lógicas distintas que mantener** — hay una
sola, con un par de puntos de adaptación explícitos y aislados.

## Requisitos nativos adicionales

- `apps/efe/ios/App/App/Info.plist` incluye
  `NSLocationWhenInUseUsageDescription`, obligatorio para que iOS muestre
  el diálogo de permiso de ubicación. Sin esta key, iOS deniega la
  geolocalización sin avisar.
- `apps/efe/package.json` incluye `@capacitor/geolocation` como
  dependencia.

## Secret ya existente

El workflow reutiliza el mismo secret que ya tenías en `testGeneratorIp`:

- `DIST_REPO_TOKEN`: Personal Access Token con permiso `contents:write` sobre el repo `testIpa`.

## Cuándo se dispara

Corre automáticamente en push a `main` que toque `apps/efe/**` **o**
cualquiera de los archivos fuente de la PWA de los que ahora depende el
sync (`index.html`, `app.js`, `horarios.json`, etc. — ver la lista
completa de `paths` en `build-efe-ipa.yml`), y manualmente desde
Actions ("Run workflow").

## Verificación de bundle ID

`PRODUCT_BUNDLE_IDENTIFIER` en `apps/efe/ios/App/App.xcodeproj/project.pbxproj` y
`appId` en `apps/efe/capacitor.config.json` DEBEN coincidir (`com.night.efe`). Si en
algún momento cambiás uno, cambiá el otro a mano — `cap sync` no los sincroniza entre sí.
