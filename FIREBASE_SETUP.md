# Configuracao Firebase - CitoAprova

## Configuracao Rapida do Administrador

### Metodo MAIS FACIL - Por Email

1. No Firebase Console, va em **Firestore Database**
2. Clique em **"Iniciar colecao"**
3. Preencha:
   - **ID da colecao:** `admin_emails`
4. Clique em "Proximo"
5. Preencha o documento:
   - **ID do documento:** `smapietro_gmail_com` (substitua @ por _ e . por _)
   - **Campo:** `email`
   - **Tipo:** `string`
   - **Valor:** `smapietro@gmail.com`
6. Adicione outro campo:
   - **Campo:** `role`
   - **Tipo:** `string`
   - **Valor:** `admin`
7. Clique em **"Salvar"**

**Pronto!** Agora faca logout e login novamente no site com esse email.

---

## Regras do Firestore

Copie e cole estas regras no console do Firebase > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to check if user is admin by email
    function isAdminByEmail() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admin_emails/$(request.auth.token.email.replace('@', '_').replace('.', '_')));
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read basic user data (for ranking)
      allow read: if true;
      
      // Users can only write their own data
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) && 
        // Prevent users from modifying admin flag
        (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['_r']));
      allow delete: if false; // Prevent deletion
      
      // User's game data subcollection
      match /gameData/{document=**} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Admin emails (read only)
    match /admin_emails/{document=**} {
      allow read: if isAuthenticated();
      allow write: if false; // Only editable via Firebase Console
    }
    
    // System config (admin only)
    match /_system_config/{document=**} {
      allow read: if isAuthenticated();
      allow write: if false; // Only editable via Firebase Console
    }
  }
}
```

## Configuracao do Authentication

### Habilitar provedores

1. Va em Firebase Console > Authentication > Sign-in method
2. Habilite:
   - **Email/Password** - Ativar
   - **Google** - Ativar e configurar

### Configurar Google Sign-In

1. Clique em "Google" na lista de provedores
2. Ative o toggle
3. Adicione seu email como suporte
4. Salve

### Dominios autorizados

1. Va em Authentication > Settings > Authorized domains
2. Adicione seus dominios:
   - localhost (ja deve estar)
   - seu-projeto.vercel.app
   - seu-dominio-personalizado.com (se tiver)

## Estrutura do Banco de Dados

```
firestore/
├── admin_emails/
│   └── smapietro_gmail_com/     (ID = email com _ em vez de @ e .)
│       ├── email: "smapietro@gmail.com"
│       └── role: "admin"
│
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string | null (base64 para foto de perfil)
│       ├── bio: string | null
│       ├── provider: "email" | "google"
│       ├── createdAt: timestamp
│       ├── lastLoginAt: timestamp
│       ├── totalScore: number
│       ├── completedPhases: number[]
│       ├── currentPhase: number
│       ├── streak: number
│       │
│       └── gameData/
│           └── progress/
│               ├── currentPhase: number
│               ├── currentMinigame: number
│               ├── completedPhases: number[]
│               ├── phaseScores: map
│               ├── totalScore: number
│               ├── lives: number
│               ├── unlockedBlocks: number[]
│               ├── streak: number
│               ├── lastPlayedDate: string
│               └── updatedAt: timestamp
```

## Checklist de Configuracao

- [ ] Criar projeto no Firebase Console
- [ ] Habilitar Firestore Database
- [ ] Habilitar Authentication
- [ ] Habilitar Email/Password provider
- [ ] Habilitar Google provider
- [ ] Copiar regras do Firestore
- [ ] **Criar colecao `admin_emails`**
- [ ] **Criar documento com ID do email (trocando @ e . por _)**
- [ ] Adicionar dominios autorizados
- [ ] Testar login com email/senha
- [ ] Testar login com Google
- [ ] Testar acesso admin em `/painel-de-controle-secreto`

## Funcionalidades do Perfil

Os usuarios podem:
- Adicionar foto de perfil (redimensionada automaticamente para caber no Firestore)
- Definir nome de exibicao
- Escrever uma bio (max 150 caracteres)
- Ver estatisticas (pontos, fases, sequencia)
- Ver posicao no ranking global
