# 🔧 Solução: "Root Directory 'client' does not exist"

## ❌ Erro
```
The specified Root Directory "client" does not exist. 
Please update your Project Settings
```

## 🔍 Possíveis Causas

1. **Branch diferente:** O Vercel pode estar olhando para um branch que não tem a pasta `client`
2. **Estrutura do repositório:** O repositório pode ter uma estrutura diferente no GitHub
3. **Cache do Vercel:** O Vercel pode estar usando cache antigo

## ✅ SOLUÇÕES

### Solução 1: Verificar Branch no Vercel

1. No Vercel Dashboard, vá em **Settings** → **Git**
2. Verifique qual **branch** está configurado
3. Deve estar como `main` ou `master`
4. Se estiver diferente, mude para `main`

### Solução 2: Remover Root Directory (Deixar Vazio)

1. No Vercel Dashboard, vá em **Settings** → **General**
2. Encontre **"Root Directory"**
3. **Deixe o campo VAZIO** (não coloque nada)
4. Salve
5. O `vercel.json` na raiz vai direcionar para `client`

### Solução 3: Usar Caminho Relativo

1. No Vercel Dashboard, vá em **Settings** → **General**
2. **Root Directory:** Deixe vazio OU tente `./client`
3. Salve

### Solução 4: Recriar Projeto do Zero

1. **Delete o projeto atual no Vercel**
2. **Crie um novo projeto**
3. **Importe o repositório:** `ViniGabrielBorba/Agenda`
4. **NÃO configure Root Directory** (deixe vazio)
5. O `vercel.json` na raiz vai fazer o trabalho
6. Adicione a variável `NEXT_PUBLIC_API_URL`
7. Faça o deploy

### Solução 5: Verificar Estrutura no GitHub

1. Acesse: https://github.com/ViniGabrielBorba/Agenda
2. Verifique se a pasta `client` existe na raiz
3. Se não existir, pode ser que o repositório tenha estrutura diferente
4. Nesse caso, você pode precisar ajustar o `vercel.json`

## 🎯 Solução Recomendada

**Deixe o Root Directory VAZIO no Vercel e use o `vercel.json` na raiz!**

O `vercel.json` que criamos já está configurado para:
- Usar `client/package.json` como fonte
- Fazer build do Next.js
- Rotear corretamente

## 📋 Checklist

- [ ] Branch no Vercel = `main`
- [ ] Root Directory = **VAZIO** (ou `./client`)
- [ ] `vercel.json` existe na raiz do repositório
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Build Cache limpo
- [ ] Redeploy feito

## 🔍 Verificar Estrutura do Repositório

No GitHub, a estrutura deve ser:
```
Agenda/
├── client/
│   ├── app/
│   ├── package.json
│   └── ...
├── server/
├── vercel.json
└── README.md
```

Se a estrutura for diferente, ajuste o `vercel.json` conforme necessário.

## 💡 Dica

Se nada funcionar, tente:
1. Deixar Root Directory vazio
2. Usar apenas o `vercel.json` para configurar tudo
3. O Vercel vai detectar automaticamente o Next.js na pasta `client`

---

**A solução mais simples: Deixe Root Directory VAZIO e use vercel.json!**

