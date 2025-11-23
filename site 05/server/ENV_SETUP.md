# Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/` com as seguintes variáveis:

## Variáveis Obrigatórias

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamento_db?schema=public"

# JWT
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Variáveis Opcionais (mas recomendadas)

```env
# Email (Gmail exemplo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# WhatsApp (opcional - estrutura pronta)
WHATSAPP_API_KEY=sua_chave_api
WHATSAPP_API_URL=https://api.whatsapp.com

# Stripe (para pagamentos)
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_stripe
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook
```

## Como obter cada variável

### DATABASE_URL
- Formato: `postgresql://usuario:senha@host:porta/database?schema=public`
- Exemplo local: `postgresql://postgres:senha123@localhost:5432/agendamento_db?schema=public`
- Em produção: Fornecido pelo serviço de banco (Heroku, Railway, etc.)

### JWT_SECRET
- Gere uma string aleatória segura
- Pode usar: `openssl rand -base64 32`
- Ou um gerador online de strings aleatórias

### EMAIL (Gmail)
1. Ative verificação em duas etapas
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma senha de app
4. Use essa senha no `EMAIL_PASS`

### STRIPE
1. Crie conta em https://stripe.com
2. Acesse Dashboard > Developers > API keys
3. Copie as chaves de teste ou produção

## Exemplo de arquivo .env completo

```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/agendamento_db?schema=public"
JWT_SECRET="minha_chave_secreta_super_segura_123456789"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=meuemail@gmail.com
EMAIL_PASS=senha_app_gerada
STRIPE_SECRET_KEY=sk_test_51AbCdEf...
STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf...
FRONTEND_URL=http://localhost:3000
```

## Importante

- **NUNCA** commite o arquivo `.env` no Git
- Use `.env.example` como template
- Em produção, configure via painel do serviço de hospedagem

