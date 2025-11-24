# 🚀 Guia Completo de Deploy - FlowGest

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Deploy do Backend no Render](#deploy-do-backend-no-render)
3. [Deploy do Frontend no Vercel](#deploy-do-frontend-no-vercel)
4. [Configuração do MongoDB Atlas](#configuração-do-mongodb-atlas)
5. [Configuração do WhatsApp (Z-API)](#configuração-do-whatsapp-z-api)
6. [Testes Pós-Deploy](#testes-pós-deploy)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

### Contas Necessárias:
- ✅ GitHub (já configurado)
- ✅ MongoDB Atlas (já configurado)
- ✅ Render (criar conta em: https://render.com)
- ✅ Vercel (criar conta em: https://vercel.com)
- ✅ Z-API (já configurado)

### Informações que você precisa:
- URL do MongoDB Atlas
- Credenciais do Z-API
- Número do WhatsApp profissional

---

## 🔧 Deploy do Backend no Render

### Passo 1: Criar Conta no Render
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub (recomendado)

### Passo 2: Criar Novo Web Service
1. No Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub: `ViniGabrielBorba/Agenda`
3. Configure o serviço:
   - **Name:** `flowgest-backend`
   - **Region:** `Oregon (US West)` ou `São Paulo (se disponível)`
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`

### Passo 3: Configurar Variáveis de Ambiente
No Render, vá em **"Environment"** e adicione:

```env
# Database
DATABASE_URL=sua_url_mongodb_atlas_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app

# WhatsApp - Z-API
WHATSAPP_PROVIDER=zapi
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=23B770EAD3D54B9C0816D645
WHATSAPP_INSTANCE=3EAAFE5FE9E5C1E3453A1E9814A1DE6D
WHATSAPP_CLIENT_TOKEN=F890b1a79d33e434f9daabc2b4a9cdd43S
PROFESSIONAL_WHATSAPP=+5581994201799

# Email (opcional - para produção)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
EMAIL_FROM=seu_email@gmail.com
```

### Passo 4: Atualizar package.json do Backend
Certifique-se de que o `server/package.json` tem:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "migrate": "npx prisma db push"
  }
}
```

### Passo 5: Deploy
1. Clique em **"Create Web Service"**
2. Aguarde o build (pode levar 5-10 minutos)
3. Anote a URL gerada: `https://flowgest-backend.onrender.com`

### Passo 6: Atualizar MongoDB Atlas
1. Acesse: https://cloud.mongodb.com
2. Vá em **Network Access**
3. Adicione o IP `0.0.0.0/0` (permite acesso de qualquer lugar)
   - Ou adicione o IP específico do Render (mais seguro)

---

## 🎨 Deploy do Frontend no Vercel

### Passo 1: Criar Conta no Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Faça login com GitHub (recomendado)

### Passo 2: Importar Projeto
1. No Dashboard, clique em **"Add New..."** → **"Project"**
2. Importe o repositório: `ViniGabrielBorba/Agenda`
3. Configure o projeto:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (deve estar automático)
   - **Output Directory:** `.next` (deve estar automático)
   - **Install Command:** `npm install`

### Passo 3: Configurar Variáveis de Ambiente
No Vercel, vá em **"Settings"** → **"Environment Variables"** e adicione:

```env
# API Backend (URL do Render)
NEXT_PUBLIC_API_URL=https://flowgest-backend.onrender.com
```

### Passo 4: Atualizar lib/api.ts
Certifique-se de que `client/lib/api.ts` está assim:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 3-5 minutos)
3. Anote a URL gerada: `https://seu-app.vercel.app`

### Passo 6: Atualizar CORS no Backend
No Render, atualize a variável de ambiente:

```env
FRONTEND_URL=https://seu-app.vercel.app
```

E reinicie o serviço no Render.

---

## 🗄️ Configuração do MongoDB Atlas

### Passo 1: Verificar Cluster
1. Acesse: https://cloud.mongodb.com
2. Verifique se o cluster está **"Running"**
3. Se estiver pausado, clique em **"Resume"**

### Passo 2: Network Access
1. Vá em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Adicione:
   - `0.0.0.0/0` (para permitir acesso de qualquer lugar)
   - Ou adicione IPs específicos do Render e Vercel

### Passo 3: Database Access
1. Vá em **"Database Access"**
2. Verifique se o usuário existe
3. Se não existir, crie um usuário com permissões de leitura/escrita

### Passo 4: Connection String
1. Vá em **"Database"** → **"Connect"**
2. Escolha **"Connect your application"**
3. Copie a connection string
4. Substitua `<password>` pela senha do usuário
5. Use essa string no Render como `DATABASE_URL`

---

## 📱 Configuração do WhatsApp (Z-API)

### Passo 1: Verificar Instância
1. Acesse: https://developer.z-api.io
2. Verifique se a instância está **"Conectada"**
3. Se não estiver, conecte via QR Code

### Passo 2: Verificar Credenciais
Confirme que tem:
- **Instance ID:** `3EAAFE5FE9E5C1E3453A1E9814A1DE6D`
- **Token:** `23B770EAD3D54B9C0816D645`
- **Client-Token:** `F890b1a79d33e434f9daabc2b4a9cdd43S`

### Passo 3: Configurar no Render
Adicione as variáveis de ambiente no Render (já mencionado acima).

---

## ✅ Testes Pós-Deploy

### Teste 1: Backend
1. Acesse: `https://flowgest-backend.onrender.com/api/health`
2. Deve retornar: `{"status":"OK","message":"API funcionando"}`

### Teste 2: Frontend
1. Acesse: `https://seu-app.vercel.app`
2. Deve carregar a página inicial
3. Tente fazer login

### Teste 3: Integração
1. Faça login no frontend
2. Tente criar um agendamento
3. Verifique se o WhatsApp recebe a mensagem

### Teste 4: Database
1. Crie um usuário novo
2. Verifique no MongoDB Atlas se o usuário foi criado

---

## 🔧 Troubleshooting

### Problema: Backend não inicia no Render
**Solução:**
- Verifique os logs no Render
- Confirme que `DATABASE_URL` está correto
- Verifique se o MongoDB permite conexões externas

### Problema: Frontend não conecta ao Backend
**Solução:**
- Verifique `NEXT_PUBLIC_API_URL` no Vercel
- Confirme que o CORS está configurado no backend
- Verifique se `FRONTEND_URL` no Render está correto

### Problema: Erro 401 Unauthorized
**Solução:**
- Verifique se `JWT_SECRET` está configurado
- Confirme que o token está sendo enviado nas requisições

### Problema: WhatsApp não envia mensagens
**Solução:**
- Verifique se a instância Z-API está conectada
- Confirme que `WHATSAPP_CLIENT_TOKEN` está correto
- Verifique os logs do backend no Render

### Problema: Build falha no Vercel
**Solução:**
- Verifique se `rootDirectory` está como `client`
- Confirme que `package.json` está no diretório correto
- Verifique os logs de build no Vercel

---

## 📝 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Backend rodando no Render
- [ ] Frontend rodando no Vercel
- [ ] MongoDB Atlas acessível
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] WhatsApp conectado e funcionando
- [ ] Login funcionando
- [ ] Agendamentos funcionando
- [ ] Notificações WhatsApp funcionando

---

## 🔗 URLs Importantes

Após o deploy, você terá:
- **Frontend:** `https://seu-app.vercel.app`
- **Backend:** `https://flowgest-backend.onrender.com`
- **API Health:** `https://flowgest-backend.onrender.com/api/health`

---

## 💡 Dicas Finais

1. **Render Free Tier:**
   - Serviços podem "dormir" após 15 minutos de inatividade
   - Primeira requisição após dormir pode demorar ~30 segundos
   - Considere upgrade para plano pago se precisar de uptime 24/7

2. **Vercel Free Tier:**
   - Excelente para frontend
   - Deploy automático a cada push no GitHub
   - SSL automático

3. **MongoDB Atlas Free Tier:**
   - 512MB de storage
   - Suficiente para começar
   - Upgrade quando necessário

4. **Monitoramento:**
   - Use os logs do Render e Vercel
   - Configure alertas se possível
   - Monitore o uso do MongoDB Atlas

---

## 🎉 Pronto!

Seu sistema FlowGest está pronto para produção! 🚀

Qualquer dúvida, consulte os logs ou entre em contato com o suporte.

