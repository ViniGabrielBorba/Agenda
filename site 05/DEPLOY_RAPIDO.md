# ⚡ Deploy Rápido - FlowGest

## 🎯 Resumo Rápido

### Backend (Render)
1. Criar conta: https://render.com
2. New → Web Service
3. Conectar GitHub: `ViniGabrielBorba/Agenda`
4. Configurar:
   - Root Directory: `server`
   - Build: `npm install && npx prisma generate`
   - Start: `npm start`
5. Adicionar variáveis de ambiente (ver DEPLOY_VERCEL_RENDER.md)
6. Deploy!

### Frontend (Vercel)
1. Criar conta: https://vercel.com
2. Add New → Project
3. Importar: `ViniGabrielBorba/Agenda`
4. Configurar:
   - Root Directory: `client`
   - Framework: Next.js
5. Adicionar variável: `NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com`
6. Deploy!

## 📋 Variáveis Essenciais

### Render (Backend)
```
DATABASE_URL=sua_url_mongodb
JWT_SECRET=seu_secret
FRONTEND_URL=https://seu-app.vercel.app
WHATSAPP_PROVIDER=zapi
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=seu_token
WHATSAPP_INSTANCE=seu_instance_id
WHATSAPP_CLIENT_TOKEN=seu_client_token
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

## ✅ Teste Rápido
1. Backend: `https://seu-backend.onrender.com/api/health`
2. Frontend: `https://seu-app.vercel.app`
3. Login e criar agendamento

---

**Para detalhes completos, veja: `DEPLOY_VERCEL_RENDER.md`**

