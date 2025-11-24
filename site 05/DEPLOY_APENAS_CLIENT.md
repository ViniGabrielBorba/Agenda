# 🎯 Deploy Apenas da Pasta Client - Solução Definitiva

## ✅ Solução: Usar Vercel CLI Diretamente da Pasta Client

Quando você usa o Vercel CLI **dentro da pasta `client`**, o Vercel:
- ✅ Usa apenas essa pasta
- ✅ Ignora o diretório pai
- ✅ Não precisa configurar Root Directory
- ✅ Não tem erro de espaço no nome

## 🚀 Opção 1: Script Automático (Mais Fácil)

**Dê duplo clique em:** `DEPLOY_CLIENT_ONLY.bat`

O script vai:
1. Ir para a pasta `client`
2. Verificar/instalar Vercel CLI
3. Fazer login (se necessário)
4. Fazer deploy em produção

## 📋 Opção 2: Manual (PowerShell)

Execute estes comandos:

```powershell
# 1. Ir para pasta client
cd "C:\Users\vinicius\Desktop\site 05\client"

# 2. Verificar Vercel CLI
vercel --version

# 3. Fazer login (primeira vez)
vercel login

# 4. Adicionar variável de ambiente (primeira vez)
vercel env add NEXT_PUBLIC_API_URL production
# Quando perguntar, digite: https://seu-backend.onrender.com

# 5. Deploy em produção
vercel --prod
```

## 🎯 Por Que Isso Funciona?

Quando você executa `vercel --prod` **dentro da pasta `client`**:
- O Vercel usa o diretório atual como raiz
- Não precisa configurar Root Directory
- Ignora completamente o diretório pai ("site 05")
- Não tem problema com espaços no nome

## 🔄 Para Atualizar Depois

Sempre que fizer mudanças:

```powershell
cd "C:\Users\vinicius\Desktop\site 05\client"
vercel --prod
```

Ou dê duplo clique em `DEPLOY_CLIENT_ONLY.bat`

## 💡 Vantagens

- ✅ Não precisa configurar Root Directory no dashboard
- ✅ Funciona independente do nome do diretório pai
- ✅ Mais rápido e confiável
- ✅ Deploy direto da pasta `client`

## 📋 Checklist

- [ ] Vercel CLI instalado (`npm install -g vercel`)
- [ ] Login feito (`vercel login`)
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Executar `vercel --prod` dentro da pasta `client`

---

**Esta é a solução mais simples e confiável! Use o script ou execute os comandos manualmente dentro da pasta `client`.**

