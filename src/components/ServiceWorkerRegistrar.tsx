"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // N'enregistrer le service worker que en production
    if (process.env.NODE_ENV !== "production") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // registration successful
          // console.log('SW registered', reg);
        })
        .catch((err) => {
          // ignore registration errors in client
          // console.error('SW registration failed', err);
        });
    }
  }, []);

  return null;
}
