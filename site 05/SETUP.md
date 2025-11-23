# 🚀 Configuração Rápida do Sistema

## Passo 1: Configurar Banco de Dados PostgreSQL

1. **Instale o PostgreSQL** (se ainda não tiver):
   - Windows: https://www.postgresql.org/download/windows/
   - Ou use Docker: `docker run --name postgres-agendamento -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

2. **Crie o banco de dados**:
   ```sql
   CREATE DATABASE agendamento_db;
   ```

## Passo 2: Configurar Variáveis de Ambiente

### Backend (`server/.env`)

Crie o arquivo `server/.env` com o seguinte conteúdo:

```env
# Database - AJUSTE COM SUAS CREDENCIAIS
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/agendamento_db?schema=public"

# JWT - GERE UMA CHAVE SEGURA
JWT_SECRET="sua_chave_secreta_super_segura_aqui_123456789"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (opcional - deixe vazio se não for usar agora)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Stripe (opcional - deixe vazio se não for usar agora)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

### Frontend (`client/.env.local`)

Crie o arquivo `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Passo 3: Executar Migrations

```bash
cd server
npm run migrate
```

Isso criará todas as tabelas no banco de dados.

## Passo 4: Iniciar o Sistema

### Opção 1: Iniciar tudo junto (recomendado)

Na raiz do projeto:
```bash
npm run dev
```

### Opção 2: Iniciar separadamente

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## Passo 5: Acessar o Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## ✅ Pronto!

Agora você pode:

1. **Criar uma conta de profissional**:
   - Acesse http://localhost:3000/register
   - Selecione "Profissional"

2. **Configurar horários de trabalho**:
   - Após login, vá em "Horários"
   - Defina seus horários

3. **Cadastrar serviços**:
   - Vá em "Meus Serviços"
   - Adicione seus serviços

4. **Criar conta de cliente** e fazer agendamentos!

## 🔧 Problemas Comuns

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme usuário e senha no `DATABASE_URL`
- Teste: `psql -U postgres -d agendamento_db`

### Erro ao executar migrations
- Certifique-se de que o banco existe
- Verifique permissões do usuário
- Tente: `npm run generate` antes de `npm run migrate`

### Porta já em uso
- Backend: Altere `PORT` no `.env`
- Frontend: Use `npm run dev -- -p 3001`

## 📚 Mais Informações

- **README.md** - Documentação completa
- **QUICK_START.md** - Guia rápido
- **API_DOCS.md** - Documentação da API
- **DEPLOY.md** - Guia de deploy

