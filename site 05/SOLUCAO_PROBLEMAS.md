# 🔧 Solução de Problemas - FlowGest

## ❌ "Não está pegando" - O que fazer?

### 1️⃣ Verificar se os Servidores Estão Rodando

#### Backend (Porta 5000)
Abra um terminal e execute:
```bash
cd server
npm run dev
```

**Você deve ver:**
```
✅ Servidor rodando na porta 5000
✅ Conexão com banco de dados estabelecida
```

#### Frontend (Porta 3000)
Abra OUTRO terminal e execute:
```bash
cd client
npm run dev
```

**Você deve ver:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in Xs
```

---

### 2️⃣ Verificar Portas

#### Verificar se as portas estão livres:
```bash
# No PowerShell:
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5000"
```

**Se estiverem ocupadas:**
- Feche outros programas que usam essas portas
- Ou mude as portas no `.env`

---

### 3️⃣ Verificar Erros Comuns

#### Erro: "Cannot find module"
```bash
# Reinstalar dependências
cd server
npm install

cd ../client
npm install
```

#### Erro: "Port already in use"
```bash
# Matar processo na porta
# No PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

#### Erro: "Database connection failed"
- Verifique o `.env` do servidor
- Verifique se o MongoDB está acessível
- Verifique a string de conexão

---

### 4️⃣ Iniciar Manualmente (Passo a Passo)

#### Terminal 1 - Backend:
```bash
cd "C:\Users\vinicius\Desktop\site 05\server"
npm run dev
```

Aguarde aparecer: "Servidor rodando na porta 5000"

#### Terminal 2 - Frontend:
```bash
cd "C:\Users\vinicius\Desktop\site 05\client"
npm run dev
```

Aguarde aparecer: "Ready" e a URL

#### Terminal 3 - Abrir Navegador:
```bash
start http://localhost:3000
```

---

### 5️⃣ Usar o Script Automático

Duplo clique em: **`INICIAR_SISTEMA.bat`**

Este script:
- ✅ Inicia o backend
- ✅ Inicia o frontend
- ✅ Abre o navegador automaticamente

---

### 6️⃣ Verificar Logs

Se ainda não funcionar, verifique os logs nos terminais:

**Backend:**
- Erros de conexão com banco?
- Erros de porta?
- Dependências faltando?

**Frontend:**
- Erros de compilação?
- Erros de módulos?
- Porta ocupada?

---

## 🆘 Se Nada Funcionar

1. **Feche todos os terminais**
2. **Feche todos os navegadores**
3. **Execute o `INICIAR_SISTEMA.bat`**
4. **Aguarde 30 segundos**
5. **Acesse: http://localhost:3000**

---

## 📞 Informações para Diagnóstico

Se ainda não funcionar, me informe:

1. **O que aparece no terminal do backend?**
2. **O que aparece no terminal do frontend?**
3. **Qual erro aparece no navegador?**
4. **As portas 3000 e 5000 estão livres?**

---

**Tente executar o `INICIAR_SISTEMA.bat` primeiro!** 🚀

