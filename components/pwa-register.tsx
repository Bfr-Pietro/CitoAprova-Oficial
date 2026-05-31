'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[PWA] Service worker registrado:', reg.scope))
        .catch((err) => console.error('[PWA] Erro ao registrar service worker:', err))
    }
  }, [])

  return null
}
