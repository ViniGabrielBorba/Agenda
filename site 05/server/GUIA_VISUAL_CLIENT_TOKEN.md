# 📱 Guia Visual: Configurar Client-Token Z-API

## ⚠️ Importante

O Client-Token **NÃO pode ser configurado via API**. Precisa ser feito **MANUALMENTE no painel web**.

---

## ✅ PASSO A PASSO NO PAINEL Z-API

### 1️⃣ Acessar o Painel

1. **Abra o navegador**
2. **Acesse:** https://developer.z-api.io
3. **Faça login** na sua conta

### 2️⃣ Ir para a Instância

1. **No menu lateral, clique em:** "Instâncias"
2. **Clique na instância:** "+55 81 994201799"
   - Ou procure pela instância com ID: `3EAAFE5FE9E5C1E3453A1E9814A1DE6D`

### 3️⃣ Encontrar Configuração do Client-Token

Procure por uma das seguintes opções:

**Opção A: Aba "Segurança"**
- Clique na aba **"Segurança"** ou **"Security"**
- Procure por **"Client-Token"** ou **"Token de Cliente"**
- Deve ter um campo para inserir o token

**Opção B: Aba "Configurações"**
- Clique na aba **"Configurações"** ou **"Settings"**
- Procure por **"Client-Token"** ou **"API Token"**
- Deve ter um campo para configurar

**Opção C: Menu "Tokens"**
- Procure um menu ou seção chamada **"Tokens"** ou **"API Tokens"**
- Deve ter opção para configurar Client-Token

**Opção D: Configurações Avançadas**
- Procure por **"Configurações Avançadas"** ou **"Advanced Settings"**
- O Client-Token pode estar lá

### 4️⃣ Configurar o Token

1. **Encontre o campo "Client-Token"**
2. **Cole o token:** `23B770EAD3D54B9C0816D645`
3. **Marque como "Ativo"** ou **"Habilitado"** (se houver checkbox)
4. **Clique em "Salvar"** ou **"Aplicar"** ou **"Salvar Configurações"**

### 5️⃣ Verificar

1. **Verifique se o token aparece como "Configurado"** ou **"Ativo"**
2. **A instância deve continuar "Conectada"**

---

## 🧪 Depois de Configurar

Execute:
```bash
cd server
node testar-z-api-com-numero-correto.js
```

**Você deve receber a mensagem no WhatsApp!** ✅

---

## 💡 Dica

Se não encontrar o campo "Client-Token":
- Procure por **"API Token"**, **"Token de API"**, **"Chave de API"**
- Ou entre em contato com o suporte Z-API
- Ou verifique a documentação: https://developer.z-api.io/docs

---

**Infelizmente, isso precisa ser feito manualmente no painel web!** 🚀

