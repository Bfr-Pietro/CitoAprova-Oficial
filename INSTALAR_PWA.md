# Como instalar o CitoAprova como app (PWA)

## Arquivos alterados/adicionados no projeto

| Arquivo | Ação |
|---|---|
| `app/layout.tsx` | Substitui o existente |
| `components/pwa-register.tsx` | Arquivo novo |
| `public/manifest.json` | Arquivo novo |
| `public/sw.js` | Arquivo novo |
| `public/icons/icon-192x192.png` | Arquivo novo |
| `public/icons/icon-512x512.png` | Arquivo novo |
| `public/icons/apple-touch-icon.png` | Arquivo novo |

---

## Como o usuário instala o app

### Android (Chrome)
1. Acessa o site pelo Chrome
2. Aparece banner "Adicionar à tela inicial" — toca em Instalar
3. Ou: menu (⋮) → "Adicionar à tela inicial"

### iPhone (Safari)
1. Acessa o site pelo Safari
2. Toca no botão compartilhar (□↑)
3. "Adicionar à tela de início"

O app abre sem barra de endereço, igual a um app nativo.
Atualiza automaticamente sempre que o site for atualizado.
