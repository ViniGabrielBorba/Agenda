# 🚀 Deploy no Vercel usando CLI (Solução Mais Simples)

## ✅ Por Que Usar CLI?

- ✅ Ignora o nome do diretório local
- ✅ Usa apenas a pasta `client`
- ✅ Mais confiável que o dashboard
- ✅ Evita erros de caminho com espaço

## 📋 Passo a Passo

### 1. Instalar Vercel CLI

Abra o PowerShell ou Terminal e execute:

```bash
npm install -g vercel
```

### 2. Ir para a Pasta Client

```bash
cd "C:\Users\vinicius\Desktop\site 05\client"
```

### 3. Fazer Login no Vercel

```bash
vercel login
```

Isso vai abrir o navegador para você fazer login.

### 4. Fazer Deploy

```bash
vercel
```

O Vercel vai perguntar:
- **Set up and deploy?** → Digite `Y`
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → Digite `N` (primeira vez) ou `Y` (se já tiver projeto)
- **Project name?** → Digite um nome (ex: `flowgest`)
- **Directory?** → Pressione Enter (já está em `client`)

### 5. Adicionar Variável de Ambiente

```bash
vercel env add NEXT_PUBLIC_API_URL
```

Quando perguntar o valor, digite: `https://seu-backend.onrender.com`

### 6. Deploy em Produção

```bash
vercel --prod
```

## 🎉 Pronto!

Seu site estará no ar em: `https://seu-projeto.vercel.app`

## 🔄 Para Atualizar

Sempre que fizer mudanças:

```bash
cd client
vercel --prod
```

## 💡 Vantagens

- Não precisa configurar Root Directory
- Não tem problema com espaços no nome
- Mais rápido e confiável
- Deploy direto da pasta `client`

---

**Esta é a forma mais simples e confiável de fazer deploy!**

