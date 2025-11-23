# 🍃 Como Iniciar o MongoDB

## Opção 1: Docker (Mais Fácil) ⭐

1. **Inicie o Docker Desktop** (se ainda não estiver rodando)

2. **Execute este comando:**
   ```bash
   docker run --name mongodb-agendamento -p 27017:27017 -d mongo:7
   ```

3. **Pronto!** O MongoDB está rodando. Agora execute:
   ```bash
   cd server
   npx prisma db push
   ```

## Opção 2: MongoDB Local

1. **Instale o MongoDB:**
   - Download: https://www.mongodb.com/try/download/community
   - Ou use o MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Se instalou localmente:**
   - Inicie o serviço MongoDB no Windows
   - Ou execute: `mongod` no terminal

3. **Se usar MongoDB Atlas:**
   - Crie uma conta gratuita
   - Crie um cluster
   - Obtenha a connection string
   - Atualize o `server/.env`:
     ```env
     DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/agendamento_db"
     ```

4. **Execute o push do schema:**
   ```bash
   cd server
   npx prisma db push
   ```

## Verificar se o MongoDB está rodando

**Docker:**
```bash
docker ps
```

**MongoDB local:**
- Verifique o serviço no Windows: Serviços > MongoDB
- Ou teste a conexão: `mongosh` ou `mongo`

## Depois de configurar o MongoDB

Execute o push do schema:
```bash
cd server
npx prisma db push
```

E então inicie o sistema:
```bash
npm run dev
```

## Nota Importante

O arquivo `server/.env` já está configurado com:
```env
DATABASE_URL=mongodb://localhost:27017/agendamento_db
```

Se usar MongoDB Atlas, atualize essa URL com sua connection string.

