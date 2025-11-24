# 🔧 Solução DEFINITIVA para Erro de Função Serverless

## ❌ Erro
```
A Serverless Function has an invalid name: "'site 05/client/___next_launcher.cjs'". 
They must be less than 128 characters long and must not contain any space
```

## 🎯 Causa Raiz
O Vercel está detectando o diretório raiz com espaço ("site 05") ao invés de usar apenas "client".

## ✅ SOLUÇÃO DEFINITIVA

### Opção 1: Configurar Root Directory no Vercel (RECOMENDADO)

1. **Acesse o Vercel Dashboard**
2. Vá no seu projeto
3. **Settings** → **General**
4. Procure **"Root Directory"**
5. **Digite:** `client` (sem aspas, apenas a palavra client)
6. **Salve** (botão Save no final da página)
7. **IMPORTANTE:** O campo não pode estar vazio!

### Opção 2: Recriar o Projeto (Se Opção 1 não funcionar)

1. **Delete o projeto atual no Vercel:**
   - Settings → General → Delete Project

2. **Crie um novo projeto:**
   - Add New → Project
   - Importe o repositório: `ViniGabrielBorba/Agenda`

3. **ANTES de clicar em Deploy:**
   - Configure **Root Directory** como `client`
   - Configure **Framework Preset** como `Next.js`
   - Adicione a variável `NEXT_PUBLIC_API_URL`

4. **Depois clique em Deploy**

### Opção 3: Usar .vercelignore (Alternativa)

Crie um arquivo `.vercelignore` na raiz do projeto:

```
!client
*
```

Isso diz ao Vercel para ignorar tudo exceto a pasta `client`.

## 📋 Checklist Obrigatório

Antes de fazer deploy, certifique-se:

- [ ] **Root Directory** está configurado como `client` (não vazio!)
- [ ] **Framework Preset** está como `Next.js`
- [ ] **Build Command** está como `npm run build` (ou vazio para auto-detect)
- [ ] **Output Directory** está como `.next` (ou vazio para auto-detect)
- [ ] **Install Command** está como `npm install` (ou vazio para auto-detect)
- [ ] Variável `NEXT_PUBLIC_API_URL` está configurada

## 🔍 Como Verificar se Está Correto

1. No Vercel, vá em **Deployments**
2. Clique no último deploy
3. Veja os **Build Logs**
4. Procure por: `Installing dependencies from client/package.json`
5. Se aparecer `Installing dependencies from package.json` (sem client), está errado!

## ⚠️ Erros Comuns

### ❌ ERRADO:
- Root Directory: (vazio)
- Root Directory: `/`
- Root Directory: `./`
- Root Directory: `site 05/client`

### ✅ CORRETO:
- Root Directory: `client`

## 🐛 Se Nada Funcionar

1. **Verifique o nome do repositório no GitHub:**
   - Se o repositório tiver espaço no nome, pode causar problemas
   - Considere renomear o repositório (sem espaços)

2. **Use a CLI do Vercel:**
   ```bash
   npm i -g vercel
   cd client
   vercel --prod
   ```
   Isso força o Vercel a usar o diretório atual.

3. **Crie um projeto separado:**
   - Crie um branch `vercel-deploy` apenas com a pasta `client`
   - Faça deploy desse branch

## 💡 Por Que Isso Acontece?

O Vercel detecta automaticamente o framework. Se o Root Directory não estiver configurado:
- Ele tenta usar o diretório raiz do repositório
- O diretório raiz tem um espaço no nome ("site 05")
- Funções serverless não podem ter espaços
- Resultado: Erro!

## ✅ Solução Garantida

**SEMPRE configure o Root Directory como `client` ANTES do primeiro deploy!**

Isso é a configuração mais importante e deve ser feita manualmente no dashboard do Vercel.

---

**A solução é simples: Root Directory = `client` (não vazio, não raiz, apenas "client")**

