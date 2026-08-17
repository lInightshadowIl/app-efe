#!/usr/bin/env node
// Sincroniza el frontend de la PWA (raíz del monorepo) hacia apps/efe/www/,
// que es lo que Capacitor empaqueta dentro del IPA.
//
// Por qué existe este script:
// Antes, apps/efe/www/ contenía COPIAS A MANO de index.html/app.js/etc,
// que con el tiempo se desincronizaban de la PWA real (distinta lógica,
// distintos datos). Este script hace que apps/efe/www/ sea siempre un
// espejo exacto y automático de la fuente de la PWA en cada build,
// eliminando esa clase de bug por completo.
//
// Uso:
//   node scripts/sync-efe-www.mjs
//
// Se ejecuta automáticamente en el workflow build-efe-ipa.yml, pero
// también podés correrlo localmente antes de abrir el proyecto en Xcode.

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const WWW = path.join(RAIZ, "apps", "efe", "www");

// Archivos de la app (mismo código para PWA e IPA, sin excepciones)
const ARCHIVOS_APP = [
  "index.html",
  "app.js",
  "style.css",
  "estaciones.js",
  "manifest.json",
  "service-worker.js",
];

// Datos: se copian con el MISMO nombre/ruta relativa que ya usa app.js
// (fetch("version.json"), fetch("horarios.json")) — antes se copiaban a
// www/data/, una ruta que app.js nunca pidió, y por eso la carga inicial
// fallaba en la app nativa.
const ARCHIVOS_DATOS = ["horarios.json", "version.json"];

function copiarArchivo(nombre) {
  const origen = path.join(RAIZ, nombre);
  const destino = path.join(WWW, nombre);
  if (!fs.existsSync(origen)) {
    throw new Error(`No existe el archivo fuente: ${origen}`);
  }
  fs.copyFileSync(origen, destino);
  console.log(`  ✓ ${nombre}`);
}

function copiarDirectorio(nombre) {
  const origen = path.join(RAIZ, nombre);
  const destino = path.join(WWW, nombre);
  fs.rmSync(destino, { recursive: true, force: true });
  fs.cpSync(origen, destino, { recursive: true });
  console.log(`  ✓ ${nombre}/`);
}

console.log("📦 Sincronizando apps/efe/www/ desde la fuente de la PWA...\n");

fs.mkdirSync(WWW, { recursive: true });

console.log("App (index.html/app.js/etc):");
for (const archivo of ARCHIVOS_APP) copiarArchivo(archivo);

console.log("\nÍconos:");
copiarDirectorio("icons");

console.log("\nDatos (mismas rutas que usa app.js — sin subcarpeta 'data/'):");
for (const archivo of ARCHIVOS_DATOS) copiarArchivo(archivo);

console.log("\n✅ apps/efe/www/ actualizado.");
