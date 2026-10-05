// SAIMO — service worker (mode hors ligne)
//
// Pages (navigation)  : réseau d'abord ; si le réseau ne répond pas à temps
//                       ou est absent, dernière version enregistrée.
// Fichiers /_next/static : cache d'abord (noms de fichiers immuables).
// Images, polices      : cache puis mise à jour en arrière-plan.
// Requêtes RSC / API / POST : jamais interceptées. Hors ligne, l'échec d'une
// requête RSC fait basculer Next.js en navigation classique, servie ici.
//
// Les pages sont propres à l'utilisateur connecté : l'application vide
// CACHE_PAGES à la déconnexion et au changement d'utilisateur.

const CACHE_PAGES = "saimo-pages";
const CACHE_STATIC = "saimo-static";
const CACHE_SHELL = "saimo-shell-v2";
const PAGE_HORS_LIGNE = "/hors-ligne.html";
const DELAI_RESEAU_MS = 8000;
const MAX_STATIC = 1500;
const PAGES_NON_ENREGISTREES = ["/connexion", "/login", "/invitation"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_SHELL)
      .then((c) => c.addAll([PAGE_HORS_LIGNE, "/saimo-logo.png"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const noms = await caches.keys();
      await Promise.all(
        noms
          .filter((n) => n.startsWith("saimo-shell-") && n !== CACHE_SHELL)
          .map((n) => caches.delete(n)),
      );
      await elaguerStatic();
      await self.clients.claim();
    })(),
  );
});

// Les fichiers des anciens déploiements s'accumulent : on garde les plus récents.
async function elaguerStatic() {
  const cache = await caches.open(CACHE_STATIC);
  const cles = await cache.keys();
  const surplus = cles.length - MAX_STATIC;
  for (let i = 0; i < surplus; i++) await cache.delete(cles[i]);
}

function estRequeteRSC(req, url) {
  return req.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
}

function cleDePage(url) {
  const u = new URL(url);
  u.searchParams.delete("_rsc");
  u.hash = "";
  return u.toString();
}

function pageEnregistrable(url, resp) {
  if (!resp || !resp.ok || resp.redirected || resp.type !== "basic") return false;
  const type = resp.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) return false;
  const chemin = new URL(url).pathname;
  return !PAGES_NON_ENREGISTREES.some((p) => chemin === p || chemin.startsWith(p + "/"));
}

async function pageEnCache(url) {
  const cache = await caches.open(CACHE_PAGES);
  return (
    (await cache.match(cleDePage(url))) ||
    // Même page avec d'autres filtres (?classeId=…) : mieux que rien hors ligne.
    (await cache.match(cleDePage(url), { ignoreSearch: true }))
  );
}

async function pageHorsLigne() {
  const cache = await caches.open(CACHE_SHELL);
  return (
    (await cache.match(PAGE_HORS_LIGNE)) ||
    new Response("<h1>Hors ligne</h1>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } })
  );
}

function navigation(event) {
  const req = event.request;
  const reseau = fetch(req).then(async (resp) => {
    if (pageEnregistrable(req.url, resp)) {
      const cache = await caches.open(CACHE_PAGES);
      await cache.put(cleDePage(req.url), resp.clone());
    }
    return resp;
  });
  // La mise à jour du cache continue même si on a déjà répondu avec l'ancienne version.
  event.waitUntil(reseau.catch(() => undefined));

  return (async () => {
    const delai = new Promise((_, reject) => setTimeout(() => reject(new Error("delai")), DELAI_RESEAU_MS));
    try {
      return await Promise.race([reseau, delai]);
    } catch {
      /* réseau absent ou trop lent */
    }
    const enCache = await pageEnCache(req.url);
    if (enCache) return enCache;
    try {
      return await reseau; // pas de copie locale : on attend quand même le réseau
    } catch {
      return pageHorsLigne();
    }
  })();
}

async function cacheDabord(req) {
  const cache = await caches.open(CACHE_STATIC);
  const enCache = await cache.match(req);
  if (enCache) return enCache;
  const resp = await fetch(req);
  if (resp.ok) await cache.put(req, resp.clone());
  return resp;
}

async function cachePuisMaj(event) {
  const cache = await caches.open(CACHE_STATIC);
  const enCache = await cache.match(event.request);
  const reseau = fetch(event.request)
    .then(async (resp) => {
      if (resp.ok) await cache.put(event.request, resp.clone());
      return resp;
    })
    .catch(() => undefined);
  event.waitUntil(reseau);
  return enCache || (await reseau) || new Response(null, { status: 503 });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || estRequeteRSC(req, url)) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheDabord(req));
    return;
  }
  if (req.mode === "navigate") {
    event.respondWith(navigation(event));
    return;
  }
  if (
    url.pathname.startsWith("/_next/image") ||
    /\.(png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(cachePuisMaj(event));
  }
});

// ─── Préparation du hors-ligne (demandée par l'application) ────────────

const RE_FICHIERS = /\/_next\/static\/[^"'\s)\\<>]+/g;

async function enregistrerPage(chemin) {
  const url = new URL(chemin, self.location.origin).toString();
  const resp = await fetch(url, { credentials: "same-origin", headers: { Accept: "text/html" } });
  if (!pageEnregistrable(url, resp)) return false;
  const html = await resp.clone().text();
  await (await caches.open(CACHE_PAGES)).put(cleDePage(url), resp);

  // Fichiers JS/CSS de la page : sans eux, elle s'afficherait sans fonctionner.
  const statique = await caches.open(CACHE_STATIC);
  const fichiers = [...new Set(html.match(RE_FICHIERS) || [])];
  for (const f of fichiers) {
    if (await statique.match(f)) continue;
    try {
      const r = await fetch(f);
      if (r.ok) await statique.put(f, r);
    } catch {
      /* fichier manquant : la page reste lisible */
    }
  }
  return true;
}

async function preparer(chemins, client) {
  let faites = 0;
  let echecs = 0;
  const file = [...chemins];
  const PARALLELE = 3;
  const travailleur = async () => {
    while (file.length) {
      const chemin = file.shift();
      try {
        if (!(await enregistrerPage(chemin))) echecs++;
      } catch {
        echecs++;
      }
      faites++;
      client?.postMessage({ type: "PREPARATION_PROGRES", faites, total: chemins.length });
    }
  };
  await Promise.all(Array.from({ length: PARALLELE }, travailleur));
  client?.postMessage({ type: "PREPARATION_TERMINEE", faites, echecs });
}

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PREPARER" && Array.isArray(msg.pages)) {
    event.waitUntil(preparer(msg.pages, event.source));
  }
});
