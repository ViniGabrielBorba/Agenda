# 🔧 Como Configurar Client-Token Z-API - Guia Visual

## ⚠️ Não Pode Ser Feito Via API

O Client-Token **precisa ser configurado MANUALMENTE no painel web** da Z-API.

---

## ✅ PASSO A PASSO NO PAINEL

### 1️⃣ Acessar

1. **Abra:** https://developer.z-api.io
2. **Faça login**

### 2️⃣ Ir para Instância

1. **Menu:** "Instâncias"
2. **Clique em:** "+55 81 994201799"

### 3️⃣ Encontrar Client-Token

Procure em uma destas abas/seções:

**📍 Aba "Segurança" ou "Security"**
- Procure por "Client-Token" ou "Token de Cliente"
- Campo para inserir o token

**📍 Aba "Configurações" ou "Settings"**
- Procure por "Client-Token" ou "API Token"
- Campo para configurar

**📍 Menu "Tokens" ou "API Tokens"**
- Seção específica para tokens
- Opção para Client-Token

**📍 Configurações Avançadas**
- Pode estar em configurações avançadas

### 4️⃣ Configurar

1. **Encontre o campo "Client-Token"**
2. **Cole:** `23B770EAD3D54B9C0816D645`
3. **Marque "Ativo"** (se houver)
4. **Clique em "Salvar"**

### 5️⃣ Testar

Depois de salvar, execute:
```bash
cd server
node testar-z-api-com-numero-correto.js
```

---

## 💡 Se Não Encontrar

Procure também por:
- "API Token"
- "Token de API"
- "Chave de API"
- "Client Token"
- "Token de Cliente"

---

**Infelizmente, isso precisa ser feito manualmente no painel!** 🚀

