# Guia de Deploy

Este documento fornece instruções detalhadas para fazer o deploy do Sistema de Agendamento Online em diferentes plataformas.

## 📋 Pré-requisitos

- Conta em um serviço de hospedagem (Heroku, Railway, Vercel, etc.)
- Banco de dados PostgreSQL (pode ser do mesmo serviço ou externo)
- Conta no Stripe (para pagamentos)
- Servidor SMTP configurado (para emails)

## 🚀 Deploy do Backend

### Opção 1: Heroku

1. **Instale o Heroku CLI** e faça login:
```bash
heroku login
```

2. **Crie um novo app**:
```bash
cd server
heroku create seu-app-backend
```

3. **Adicione o addon do PostgreSQL**:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. **Configure as variáveis de ambiente**:
```bash
heroku config:set JWT_SECRET="seu_jwt_secret_super_seguro"
heroku config:set JWT_EXPIRES_IN="7d"
heroku config:set NODE_ENV="production"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_PORT="587"
heroku config:set EMAIL_USER="seu_email@gmail.com"
heroku config:set EMAIL_PASS="sua_senha_app"
heroku config:set STRIPE_SECRET_KEY="sk_live_sua_chave"
heroku config:set FRONTEND_URL="https://seu-frontend.vercel.app"
```

5. **Execute as migrations**:
```bash
heroku run npm run migrate
```

6. **Faça o deploy**:
```bash
git push heroku main
```

### Opção 2: Railway

1. **Conecte seu repositório** no Railway
2. **Adicione um serviço PostgreSQL**
3. **Configure as variáveis de ambiente** no painel do Railway
4. **Adicione um script de build**:
   - Build Command: `cd server && npm install && npm run generate`
   - Start Command: `cd server && npm start`

### Opção 3: Render

1. **Crie um novo Web Service**
2. **Conecte seu repositório**
3. **Configure**:
   - Build Command: `cd server && npm install && npm run generate`
   - Start Command: `cd server && npm start`
4. **Adicione um banco PostgreSQL** no Render
5. **Configure as variáveis de ambiente**

## 🎨 Deploy do Frontend

### Opção 1: Vercel (Recomendado)

1. **Instale o Vercel CLI**:
```bash
npm i -g vercel
```

2. **No diretório do cliente**:
```bash
cd client
vercel
```

3. **Configure as variáveis de ambiente** no painel da Vercel:
   - `NEXT_PUBLIC_API_URL`: URL do seu backend
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe

4. **Ou conecte via GitHub**:
   - Vá para vercel.com
   - Conecte seu repositório
   - Configure o diretório raiz como `client`
   - Adicione as variáveis de ambiente

### Opção 2: Netlify

1. **Conecte seu repositório** no Netlify
2. **Configure**:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/.next`
3. **Adicione as variáveis de ambiente**

## 🗄️ Configuração do Banco de Dados

### PostgreSQL no Heroku

O Heroku já cria a variável `DATABASE_URL` automaticamente quando você adiciona o addon PostgreSQL.

### PostgreSQL Externo (Supabase, Neon, etc.)

1. **Crie um banco de dados** no serviço escolhido
2. **Obtenha a string de conexão**
3. **Configure no backend**:
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?schema=public"
```

4. **Execute as migrations**:
```bash
cd server
npm run migrate
```

## 📧 Configuração de Email

### Gmail

1. **Ative a verificação em duas etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Email" e "Outro (nome personalizado)"
   - Use essa senha no `EMAIL_PASS`

### SendGrid

1. **Crie uma conta** no SendGrid
2. **Crie uma API Key**
3. **Configure**:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=sua_api_key_sendgrid
```

## 💳 Configuração do Stripe

1. **Crie uma conta** no Stripe (https://stripe.com)
2. **Obtenha as chaves de API**:
   - Teste: Dashboard > Developers > API keys
   - Produção: Mesmo local, mas ative o modo produção

3. **Configure o webhook**:
   - Dashboard > Developers > Webhooks
   - Adicione endpoint: `https://seu-backend.com/api/payments/webhook`
   - Selecione eventos: `payment_intent.succeeded`
   - Copie o `Signing secret` e adicione como `STRIPE_WEBHOOK_SECRET`

## 🔒 Segurança

### Checklist de Segurança

- [ ] Use variáveis de ambiente para todas as credenciais
- [ ] Use HTTPS em produção
- [ ] Configure CORS corretamente
- [ ] Use senhas fortes para JWT_SECRET
- [ ] Ative rate limiting
- [ ] Configure CSP headers (já incluído com Helmet)
- [ ] Use banco de dados com SSL
- [ ] Mantenha dependências atualizadas

## 📊 Monitoramento

### Logs

- **Heroku**: `heroku logs --tail`
- **Railway**: Painel do serviço > Logs
- **Vercel**: Dashboard > Deployments > Logs

### Health Check

O backend expõe um endpoint de health check:
```
GET /api/health
```

Use este endpoint para monitoramento (UptimeRobot, Pingdom, etc.)

## 🔄 Atualizações

### Backend

```bash
cd server
git pull
heroku run npm run migrate  # se houver novas migrations
git push heroku main
```

### Frontend

O Vercel/Netlify atualiza automaticamente quando você faz push para o repositório.

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco aceita conexões externas
- Verifique firewall/whitelist de IPs

### Erro de CORS

- Verifique se `FRONTEND_URL` está correto no backend
- Verifique se o frontend está usando a URL correta da API

### Emails não são enviados

- Verifique credenciais SMTP
- Teste com um serviço como Mailtrap primeiro
- Verifique logs do servidor

### Pagamentos não funcionam

- Verifique chaves do Stripe
- Configure webhook corretamente
- Verifique logs do Stripe Dashboard

## 📞 Suporte

Para problemas específicos de deploy, consulte a documentação da plataforma escolhida ou abra uma issue no repositório.

