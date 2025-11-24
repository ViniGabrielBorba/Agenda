# 🔍 Verificar Conexão MongoDB Atlas

## ⚠️ Erro Atual
```
Server selection timeout: No available servers
InternalError: received fatal alert
```

## ✅ Checklist de Verificação

### 1. Verificar se o Cluster está Ativo
1. No MongoDB Atlas, vá em **"Database"** (menu lateral)
2. Verifique se o cluster está **"Running"** (verde)
3. Se estiver **"Paused"**, clique em **"Resume"** e aguarde alguns minutos

### 2. Verificar Network Access (Whitelist)
1. No menu lateral, clique em **"Network Access"**
2. Verifique se há IPs na lista
3. **Opções:**
   - **Adicionar seu IP atual:**
     - Clique em **"Add IP Address"**
     - Clique em **"Add Current IP Address"**
     - Clique em **"Confirm"**
   
   - **OU permitir todos (apenas para desenvolvimento):**
     - Clique em **"Add IP Address"**
     - Digite: `0.0.0.0/0`
     - Descrição: "Allow all IPs (dev only)"
     - Clique em **"Confirm"**

### 3. Verificar Database User
Na tela que você está vendo (Database Users):

✅ **Verificar:**
- O usuário `vinigabriellborba_db_user` existe
- O método de autenticação está correto (SCRAM)
- As permissões estão corretas (atlasAdmin@admin)

⚠️ **Se necessário, criar novo usuário:**
1. Clique em **"+ ADD NEW DATABASE USER"**
2. **Authentication Method:** Password
3. **Username:** (use o mesmo do .env)
4. **Password:** (use a mesma senha do .env)
5. **Database User Privileges:** Atlas admin (ou Read and write to any database)
6. Clique em **"Add User"**

### 4. Verificar String de Conexão
1. No MongoDB Atlas, vá em **"Database"**
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Copie a string de conexão
5. Verifique se está igual no arquivo `server/.env`:

```env
DATABASE_URL=mongodb+srv://vinigabriellborba_db_user:SENHA@agenda.dqy5zgq.mongodb.net/agendamento_db?retryWrites=true&w=majority&appName=Agenda
```

**Importante:** Substitua `<password>` pela senha real do usuário!

### 5. Testar Conexão
Depois de verificar tudo, teste:

```bash
cd server
npx prisma db push
```

---

## 🔧 Solução Alternativa: Usar MongoDB Local

Se o problema persistir, você pode usar MongoDB local:

1. **Instalar MongoDB localmente:**
   ```bash
   # Windows: Baixar do site oficial
   # https://www.mongodb.com/try/download/community
   ```

2. **Atualizar .env:**
   ```env
   DATABASE_URL=mongodb://localhost:27017/agendamento_db
   ```

3. **Tentar novamente:**
   ```bash
   npx prisma db push
   ```

---

## 📋 O que Verificar Agora

1. ✅ Cluster está "Running"?
2. ✅ Seu IP está na whitelist?
3. ✅ Usuário do banco existe e tem permissões?
4. ✅ String de conexão no .env está correta?
5. ✅ Senha no .env está correta?

---

**Depois de verificar tudo, tente novamente!** 🚀

