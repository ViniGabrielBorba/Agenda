# 🚀 Deploy Manual no Vercel - Passo a Passo

## 📋 Comandos para Executar

Abra o PowerShell ou Terminal e execute os comandos abaixo **na ordem**:

### 1. Ir para a pasta client

```powershell
cd "C:\Users\vinicius\Desktop\site 05\client"
```

### 2. Verificar se Vercel CLI está instalado

```powershell
vercel --version
```

Se não estiver instalado:
```powershell
npm install -g vercel
```

### 3. Fazer Login

```powershell
vercel login
```

**O que vai acontecer:**
- Uma URL será exibida (ex: `https://vercel.com/oauth/device?user_code=XXXX-XXXX`)
- Pressione ENTER para abrir no navegador
- OU copie a URL e cole no navegador
- Faça login na sua conta Vercel
- Autorize o acesso
- Volte ao terminal - deve mostrar "Success!"

### 4. Adicionar Variável de Ambiente

```powershell
vercel env add NEXT_PUBLIC_API_URL production
```

Quando perguntar o valor, digite:
```
https://seu-backend.onrender.com
```
(Substitua pela URL real do seu backend no Render)

### 5. Fazer Deploy em Produção

```powershell
vercel --prod
```

**O Vercel vai perguntar:**
- **Set up and deploy?** → Digite `Y` e pressione ENTER
- **Which scope?** → Escolha sua conta (geralmente só tem uma opção)
- **Link to existing project?** → Digite `N` (primeira vez) ou `Y` (se já tiver projeto)
- **Project name?** → Digite: `flowgest` e pressione ENTER
- **Directory?** → Apenas pressione ENTER (já está em `client`)

### 6. Aguardar Deploy

O Vercel vai:
- Instalar dependências
- Fazer build
- Fazer deploy
- Mostrar a URL do seu site

## ✅ Pronto!

Seu site estará no ar em: `https://flowgest.vercel.app` (ou similar)

## 🔄 Para Atualizar Depois

Sempre que fizer mudanças e quiser atualizar:

```powershell
cd "C:\Users\vinicius\Desktop\site 05\client"
vercel --prod
```

## 💡 Dica

Você também pode usar o arquivo `DEPLOY_VERCEL.bat` que criei - basta dar duplo clique nele!

---

**Siga os passos acima e seu site estará no ar!** 🚀

