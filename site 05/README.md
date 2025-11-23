# FlowGest - Sistema de Agendamento Online

Sistema completo de agendamento online para profissionais de beleza (manicure, pedicure, cabelo, estética).

## 🎨 Características

- ✨ Interface moderna e elegante com tema rosa/roxo
- 🌓 Modo claro e escuro
- 📱 Design responsivo
- 💅 Gestão completa de serviços
- 📅 Sistema de agendamento com disponibilidade
- ⏰ Configuração de horários de trabalho
- 📊 Relatórios e estatísticas
- 💬 Integração com WhatsApp
- 🔐 Autenticação segura

## 🚀 Tecnologias

### Backend
- Node.js + Express
- Prisma ORM
- MongoDB
- JWT Authentication
- Nodemailer (emails)
- Axios (WhatsApp)

### Frontend
- Next.js 14
- React + TypeScript
- Tailwind CSS
- Context API
- React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/ViniGabrielBorba/Agenda.git
cd Agenda
```

### 2. Instale as dependências

```bash
# Instalar todas as dependências
npm install

# Ou instalar separadamente
cd server && npm install
cd ../client && npm install
```

### 3. Configure o banco de dados

Crie um arquivo `server/.env`:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/agendamento_db"
# ou MongoDB Atlas:
# DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/agendamento_db"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Configure o Prisma

```bash
cd server
npx prisma generate
npx prisma db push
```

### 5. Configure o frontend

Crie um arquivo `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 Como Usar

### Iniciar o servidor

```bash
# Na raiz do projeto
npm run dev

# Ou separadamente:
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Acessar o sistema

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 👤 Primeiro Acesso

1. Acesse http://localhost:3000/register
2. Crie uma conta como **PROFESSIONAL** ou **ADMIN**
3. Faça login
4. Configure seus serviços em "Serviços"
5. Configure seus horários em "Horários"
6. Compartilhe o link para clientes agendarem

## 📱 Configurar WhatsApp (Opcional)

Para receber notificações no WhatsApp quando houver novos agendamentos:

**👉 Comece aqui:** `server/PASSO_A_PASSO_WHATSAPP.md` (Guia mais fácil!)

Ou veja os outros guias:
- `server/COMO_USAR_EVOLUTION_API.md` - Baseado na documentação oficial
- `server/CONFIGURAR_EVOLUTION_API.md` - Guia completo
- `server/INICIO_RAPIDO_WHATSAPP.md` - Início rápido

**Recomendado:** Evolution API (gratuito e fácil de usar)

## 📁 Estrutura do Projeto

```
.
├── client/                 # Frontend Next.js
│   ├── app/               # Páginas e rotas
│   ├── components/       # Componentes React
│   ├── contexts/         # Context API
│   └── lib/              # Utilitários
├── server/               # Backend Express
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares
│   ├── utils/           # Utilitários
│   └── prisma/          # Schema do banco
└── package.json         # Scripts principais
```

## 🔐 Variáveis de Ambiente

### Backend (`server/.env`)
- `DATABASE_URL` - URL de conexão MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `PORT` - Porta do servidor (padrão: 5000)
- `WHATSAPP_API_URL` - URL da API WhatsApp (opcional)
- `WHATSAPP_API_KEY` - Chave da API WhatsApp (opcional)
- `PROFESSIONAL_WHATSAPP` - Seu número WhatsApp

### Frontend (`client/.env.local`)
- `NEXT_PUBLIC_API_URL` - URL da API backend

## 📚 Documentação

- `server/INICIO_RAPIDO_WHATSAPP.md` - Configurar WhatsApp
- `server/CONFIGURAR_WHATSAPP_REAL.md` - Guia completo WhatsApp
- `server/ENV_SETUP.md` - Configuração de variáveis

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend e backend

# Build
npm run build            # Build do frontend

# Banco de dados
cd server
npm run migrate          # Executar migrações
npx prisma studio        # Abrir Prisma Studio
```

## 🎨 Personalização

O sistema foi projetado para profissionais de beleza com:
- Cores rosa/roxo
- Tema feminino e elegante
- Serviços pré-configurados (manicure, pedicure, cabelo, etc.)

## 📝 Licença

Este projeto é de código aberto.

## 👨‍💻 Autor

Vinicius Gabriel Borba

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Desenvolvido com ❤️ para profissionais de beleza
