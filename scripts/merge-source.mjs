

import { readFileSync, writeFileSync, existsSync } from "fs";

const [, , sourcePath, appJsonPath] = process.argv;

if (!sourcePath || !appJsonPath) {
  console.error("Uso: node merge-source.mjs <source.json> <app.json>");
  process.exit(1);
}

const newApp = JSON.parse(readFileSync(appJsonPath, "utf-8"));

if (!newApp.bundleIdentifier) {
  console.error("El app.json debe incluir bundleIdentifier");
  process.exit(1);
}

let source;
if (existsSync(sourcePath)) {
  source = JSON.parse(readFileSync(sourcePath, "utf-8"));
} else {
  // Primer app que se publica: crea el source.json base
  source = {
    name: "Mi Fuente Personal",
    identifier: "com.tuusuario.source",
    apps: [],
  };
}

if (!Array.isArray(source.apps)) source.apps = [];

const idx = source.apps.findIndex(
  (a) => a.bundleIdentifier === newApp.bundleIdentifier,
);

if (idx >= 0) {
  source.apps[idx] = { ...source.apps[idx], ...newApp };
  console.log(`Actualizada entrada existente: ${newApp.bundleIdentifier}`);
} else {
  source.apps.push(newApp);
  console.log(`Agregada nueva app: ${newApp.bundleIdentifier}`);
}

// Orden estable por nombre, para que el diff en git sea limpio
source.apps.sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(sourcePath, JSON.stringify(source, null, 2) + "\n");
console.log(`source.json actualizado (${source.apps.length} apps totales)`);
