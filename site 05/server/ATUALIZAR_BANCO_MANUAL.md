# 🔄 Como Atualizar o Banco de Dados

## ⚠️ Problema de Conexão

Se você recebeu erro de conexão ao tentar `npx prisma db push`, siga estes passos:

---

## ✅ Solução 1: Verificar MongoDB Atlas

### 1. Acesse o MongoDB Atlas
👉 https://cloud.mongodb.com

### 2. Verifique o Cluster
- O cluster está **pausado**? Se sim, clique em **"Resume"**
- Aguarde alguns minutos para o cluster iniciar

### 3. Verifique Network Access (Whitelist)
1. Vá em **"Network Access"** (menu lateral)
2. Verifique se seu IP está na lista
3. Se não estiver:
   - Clique em **"Add IP Address"**
   - Clique em **"Add Current IP Address"** (ou adicione `0.0.0.0/0` para permitir todos - apenas para desenvolvimento)
   - Clique em **"Confirm"**

### 4. Verifique a String de Conexão
- Vá em **"Database"** → **"Connect"**
- Verifique se a string no `.env` está correta
- Formato: `mongodb+srv://usuario:senha@cluster.mongodb.net/database`

---

## ✅ Solução 2: Tentar Novamente

Depois de verificar tudo acima, tente novamente:

```bash
cd server
npx prisma db push
```

---

## ✅ Solução 3: Gerar Prisma Client (Já Feito)

O Prisma Client já foi gerado com as novas tabelas:

```bash
npx prisma generate
```

Isso significa que o código já está pronto para usar as novas tabelas (`Review` e `PortfolioImage`).

---

## 📋 O que foi adicionado ao Schema

### 1. Modelo `Review` (Avaliações)
- `id` - ID único
- `appointmentId` - ID do agendamento
- `professionalId` - ID do profissional
- `clientId` - ID do cliente
- `rating` - Nota de 1 a 5
- `comment` - Comentário (opcional)
- `isVisible` - Se está visível
- `createdAt`, `updatedAt` - Datas

### 2. Modelo `PortfolioImage` (Galeria)
- `id` - ID único
- `professionalId` - ID do profissional
- `imageUrl` - URL da imagem
- `title` - Título (opcional)
- `description` - Descrição (opcional)
- `category` - Categoria (opcional)
- `isVisible` - Se está visível
- `order` - Ordem de exibição
- `createdAt`, `updatedAt` - Datas

---

## 🚀 Quando o Banco Estiver Acessível

Execute:

```bash
cd server
npx prisma db push
```

Você verá uma mensagem como:

```
✔ Generated Prisma Client
✔ Database synchronized successfully
```

---

## 💡 Dica

Se o problema persistir:
1. Verifique sua conexão de internet
2. Tente acessar o MongoDB Atlas pelo navegador
3. Verifique se não há firewall bloqueando
4. Tente novamente em alguns minutos

---

**O código já está pronto! Só falta sincronizar com o banco quando a conexão estiver OK.** ✅

