# 🎯 Solução DEFINITIVA: Root Directory "client" does not exist

## ❌ Erro
```
The specified Root Directory "client" does not exist. 
Please update your Project Settings
```

## ✅ SOLUÇÃO GARANTIDA

### Passo 1: Deixar Root Directory VAZIO

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto
3. **Settings** → **General**
4. Encontre **"Root Directory"**
5. **APAGUE qualquer valor que estiver lá** (deixe completamente vazio)
6. Clique em **Save**

### Passo 2: Verificar Branch

1. **Settings** → **Git**
2. Verifique qual **branch** está configurado
3. Deve estar como `main`
4. Se não estiver, mude para `main`

### Passo 3: Limpar Tudo

1. **Settings** → **General**
2. Role até o final
3. Clique em **"Clear Build Cache"**
4. Confirme

### Passo 4: Redeploy

1. **Deployments**
2. Clique nos três pontos (...) do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o build

## 🔍 Por Que Deixar Vazio?

O `vercel.json` na raiz do repositório já está configurado para:
- Fazer `cd client` antes de instalar
- Fazer `cd client` antes de buildar
- Usar `client/.next` como output
- Detectar Next.js automaticamente

**Não precisa configurar Root Directory!**

## 🐛 Se Ainda Não Funcionar

### Verificar Estrutura no GitHub

1. Acesse: https://github.com/ViniGabrielBorba/Agenda
2. Verifique se a pasta `client` existe na raiz
3. Clique na pasta `client`
4. Verifique se tem `package.json` dentro

### Se a Estrutura Estiver Diferente

Se o repositório no GitHub tiver estrutura diferente (ex: tudo dentro de "site 05"), você pode:

**Opção A:** Mover arquivos para a raiz do repositório
**Opção B:** Ajustar o `vercel.json` para o caminho correto

### Usar Vercel CLI (Alternativa)

Se o dashboard não funcionar, use a CLI:

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

- [ ] Root Directory = **VAZIO** (não "client", não "/", completamente vazio)
- [ ] Branch = `main`
- [ ] Build Cache limpo
- [ ] `vercel.json` existe na raiz do repositório
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Redeploy feito

## 💡 Importante

**O Root Directory deve estar VAZIO quando você usa vercel.json na raiz!**

O `vercel.json` já faz todo o trabalho de direcionar para a pasta `client`.

---

**Solução: Root Directory = VAZIO + vercel.json configurado = Funciona!**

