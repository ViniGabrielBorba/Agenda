# 🔧 Solução para Erro 404 no Vercel

## ❌ Problema
Erro `404: NOT_FOUND` após deploy no Vercel.

## ✅ Soluções Aplicadas

### 1. Correção no `next.config.js`
- Removido `/api` do `NEXT_PUBLIC_API_URL` padrão
- Adicionado `output: 'standalone'` para melhor compatibilidade

### 2. Correção no `lib/api.ts`
- Agora adiciona `/api` automaticamente à URL base
- Funciona tanto em desenvolvimento quanto em produção

### 3. Criado `vercel.json`
- Configuração explícita para o Vercel
- Garante que o build seja feito corretamente

## 🔄 Próximos Passos

### No Vercel Dashboard:

1. **Verificar Configurações do Projeto:**
   - Vá em **Settings** → **General**
   - **Root Directory:** Deve estar como `client`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (deve estar automático)
   - **Output Directory:** `.next` (deve estar automático)

2. **Verificar Variáveis de Ambiente:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione: `NEXT_PUBLIC_API_URL`
   - Valor: URL do seu backend no Render (ex: `https://flowgest-backend.onrender.com`)
   - **IMPORTANTE:** Não inclua `/api` no final!

3. **Redeploy:**
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deploy
   - Selecione **Redeploy**
   - Ou faça um novo commit e push (deploy automático)

## 📋 Checklist

- [ ] Root Directory configurado como `client`
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada (sem `/api`)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Framework: Next.js

## 🐛 Se Ainda Não Funcionar

1. **Verificar Logs:**
   - No Vercel, vá em **Deployments**
   - Clique no deploy que falhou
   - Veja os **Build Logs** e **Function Logs**

2. **Verificar se o Build Funciona Localmente:**
   ```bash
   cd client
   npm run build
   npm start
   ```

3. **Limpar Cache:**
   - No Vercel, vá em **Settings** → **General**
   - Clique em **Clear Build Cache**
   - Faça um novo deploy

4. **Verificar Estrutura de Pastas:**
   - Certifique-se de que `client/app/page.tsx` existe
   - Certifique-se de que `client/package.json` está correto

## 💡 Dica

O erro 404 geralmente acontece quando:
- O Vercel não encontra o arquivo `app/page.tsx`
- O Root Directory está incorreto
- O build falhou silenciosamente

Verifique os logs de build no Vercel para mais detalhes!

