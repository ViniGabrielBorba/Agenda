# Guia Rápido de Início

Este guia te ajudará a colocar o sistema funcionando rapidamente.

## ⚡ Início Rápido (5 minutos)

### 1. Instale as dependências

```bash
npm run install:all
```

### 2. Configure o banco de dados

Crie um banco PostgreSQL e configure a URL no arquivo `server/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamento_db?schema=public"
```

Veja `server/ENV_SETUP.md` para todas as variáveis necessárias.

### 3. Execute as migrations

```bash
cd server
npm run migrate
npm run generate
```

### 4. Inicie os servidores

```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend na porta 5000
- Frontend na porta 3000

### 5. Acesse o sistema

Abra seu navegador em: http://localhost:3000

## 🎯 Próximos Passos

1. **Crie uma conta de profissional**:
   - Acesse http://localhost:3000/register
   - Selecione "Profissional" no tipo de conta

2. **Configure seus horários de trabalho**:
   - Após login, vá em "Horários"
   - Defina os horários para cada dia da semana

3. **Cadastre seus serviços**:
   - Vá em "Meus Serviços"
   - Adicione serviços com preço e duração

4. **Crie uma conta de cliente**:
   - Faça logout e crie uma nova conta como "Cliente"

5. **Faça um agendamento**:
   - Como cliente, vá em "Novo Agendamento"
   - Selecione serviço, data e horário

## 🔧 Configurações Importantes

### Email (Opcional mas recomendado)

Para receber confirmações por email, configure no `server/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

### Pagamentos (Opcional)

Para habilitar pagamentos, configure o Stripe:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

E no `client/.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📚 Documentação Completa

- **README.md** - Visão geral e funcionalidades
- **API_DOCS.md** - Documentação completa da API
- **DEPLOY.md** - Guia de deploy em produção
- **server/ENV_SETUP.md** - Configuração de variáveis de ambiente

## 🐛 Problemas Comuns

### Erro de conexão com banco

- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Teste a conexão: `psql $DATABASE_URL`

### Erro ao executar migrations

- Certifique-se de que o banco existe
- Verifique permissões do usuário do banco
- Tente: `npm run generate` antes de `npm run migrate`

### Porta já em uso

- Backend: Altere `PORT` no `.env`
- Frontend: Use `npm run dev -- -p 3001`

## 💡 Dicas

- Use o Prisma Studio para visualizar dados: `cd server && npm run studio`
- Teste a API com Postman ou Insomnia
- Veja os logs no terminal para debug

## 🆘 Precisa de Ajuda?

- Consulte a documentação completa
- Abra uma issue no repositório
- Verifique os logs de erro

