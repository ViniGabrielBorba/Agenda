# 🗄️ Como Iniciar o Banco de Dados

## Opção 1: Docker (Mais Fácil) ⭐

1. **Inicie o Docker Desktop** (se ainda não estiver rodando)

2. **Execute este comando:**
   ```bash
   docker run --name postgres-agendamento -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=agendamento_db -p 5432:5432 -d postgres:15
   ```

3. **Pronto!** O banco está rodando. Agora execute:
   ```bash
   cd server
   npm run migrate
   ```

## Opção 2: PostgreSQL Local

1. **Instale o PostgreSQL:**
   - Download: https://www.postgresql.org/download/windows/
   - Durante a instalação, anote a senha do usuário `postgres`

2. **Ajuste o arquivo `server/.env`:**
   ```env
   DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/agendamento_db?schema=public
   ```
   (Substitua `SUA_SENHA` pela senha que você definiu)

3. **Crie o banco de dados:**
   - Abra o pgAdmin ou psql
   - Execute: `CREATE DATABASE agendamento_db;`

4. **Execute as migrations:**
   ```bash
   cd server
   npm run migrate
   ```

## Verificar se o PostgreSQL está rodando

**Docker:**
```bash
docker ps
```

**PostgreSQL local:**
- Verifique o serviço no Windows: Serviços > PostgreSQL
- Ou teste a conexão: `psql -U postgres -h localhost`

## Depois de configurar o banco

Execute as migrations:
```bash
cd server
npm run migrate
```

E então inicie o sistema:
```bash
npm run dev
```

