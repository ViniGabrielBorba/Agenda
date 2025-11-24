# 🔧 Solução: Erro de Nome de Função Serverless Inválido

## ❌ Erro
```
A Serverless Function has an invalid name: "'site 05/client/___next_launcher.cjs'". 
They must be less than 128 characters long and must not contain any space
```

## 🔍 Causa
O Vercel está tentando usar o caminho completo do diretório local, incluindo "site 05" que tem um espaço. Isso acontece quando o **Root Directory** não está configurado corretamente.

## ✅ Solução

### Passo 1: Verificar Root Directory no Vercel

1. Acesse o **Vercel Dashboard**
2. Vá no seu projeto
3. Clique em **Settings** → **General**
4. Procure por **Root Directory**
5. **DEVE estar configurado como:** `client`
6. Se não estiver, altere para `client` e salve

### Passo 2: Limpar e Reconfigurar

1. No Vercel, vá em **Settings** → **General**
2. Role até o final
3. Clique em **Clear Build Cache**
4. Confirme a limpeza

### Passo 3: Redeploy

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Redeploy**
4. Ou faça um novo commit e push (deploy automático)

### Passo 4: Verificar Configurações

Certifique-se de que está assim:

```
Root Directory: client
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## 🎯 Por Que Isso Acontece?

- O Vercel detecta automaticamente o framework
- Se o Root Directory não estiver configurado, ele tenta usar o diretório raiz
- O diretório raiz tem um espaço no nome ("site 05")
- Funções serverless não podem ter espaços no nome
- Resultado: Erro!

## ✅ Solução Definitiva

**SEMPRE configure o Root Directory como `client` no Vercel!**

Isso garante que:
- O Vercel use apenas o diretório `client`
- Não tente usar o caminho completo
- As funções serverless tenham nomes válidos
- O build funcione corretamente

## 📋 Checklist

- [ ] Root Directory = `client` (não vazio, não raiz)
- [ ] Framework = Next.js
- [ ] Build Cache limpo
- [ ] Redeploy feito
- [ ] Deploy bem-sucedido

## 🐛 Se Ainda Não Funcionar

1. **Delete o projeto no Vercel**
2. **Crie um novo projeto**
3. **Importe o repositório novamente**
4. **Configure Root Directory como `client` ANTES do primeiro deploy**
5. **Adicione as variáveis de ambiente**
6. **Faça o deploy**

---

**A causa raiz é sempre o Root Directory não configurado corretamente!**

