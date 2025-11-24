# 🎯 Configuração FINAL do Vercel - Passo a Passo

## ⚠️ PROBLEMA: Erro 404 após deploy

## ✅ SOLUÇÃO PASSO A PASSO

### Passo 1: Verificar/Configurar Root Directory

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **Settings** → **General**
4. Role até encontrar **"Root Directory"**
5. **IMPORTANTE:** O campo deve estar como `client`
   - Se estiver vazio → Digite `client`
   - Se estiver como `/` → Mude para `client`
   - Se estiver como `./` → Mude para `client`
6. Clique em **Save** (no final da página)

### Passo 2: Verificar Build Settings

Na mesma página (Settings → General), verifique:

- **Framework Preset:** `Next.js` (deve estar automático)
- **Build Command:** `npm run build` (ou vazio para auto)
- **Output Directory:** `.next` (ou vazio para auto)
- **Install Command:** `npm install` (ou vazio para auto)

### Passo 3: Configurar Variáveis de Ambiente

1. Vá em **Settings** → **Environment Variables**
2. Clique em **Add New**
3. Adicione:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://seu-backend.onrender.com` (URL do seu backend no Render)
   - **Environment:** Production, Preview, Development (marque todos)
4. Clique em **Save**

### Passo 4: Limpar Cache

1. Vá em **Settings** → **General**
2. Role até o final
3. Clique em **"Clear Build Cache"**
4. Confirme

### Passo 5: Redeploy

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o build (2-5 minutos)

## 🔍 Como Verificar se Está Correto

### Nos Build Logs, você deve ver:

✅ **CORRETO:**
```
Installing dependencies from client/package.json
Building in client directory
```

❌ **ERRADO:**
```
Installing dependencies from package.json
Building in root directory
```

## 🐛 Se Ainda Der 404

### Opção A: Recriar Projeto

1. **Delete o projeto atual:**
   - Settings → General → Delete Project

2. **Crie novo projeto:**
   - Add New → Project
   - Importe: `ViniGabrielBorba/Agenda`

3. **ANTES de clicar em Deploy:**
   - Configure **Root Directory** como `client`
   - Adicione variável `NEXT_PUBLIC_API_URL`
   - Verifique Framework = Next.js

4. **Depois clique em Deploy**

### Opção B: Usar Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ir para pasta client
cd client

# Fazer deploy
vercel --prod
```

Isso força o Vercel a usar o diretório atual.

## 📋 Checklist Final

Antes de considerar resolvido:

- [ ] Root Directory = `client` (não vazio!)
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Build Cache limpo
- [ ] Redeploy feito
- [ ] Build Logs mostram "client/package.json"
- [ ] Site carrega sem erro 404

## 💡 Dica Importante

O **Root Directory** é a configuração MAIS IMPORTANTE. Sem ela configurada corretamente, nada funciona!

---

**A solução é: Root Directory = `client` (apenas essa palavra, sem aspas, sem barras)**

