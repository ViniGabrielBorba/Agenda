# 📱 Como Configurar Z-API no FlowGest

## 📋 Credenciais Fornecidas

- **Base URL:** https://api.z-api.io
- **Instance ID:** 3EAAFE5FE9E5C1E3453A1E9814A1DE6D
- **Token:** 23B770EAD3D54B9C0816D645
- **Endpoint:** `/instances/{instanceId}/token/{token}/send-text`

---

## ⚠️ Problema Atual

O erro "your client-token is not configured" significa que:
- O token precisa ser **configurado no painel da Z-API**
- Ou o token não está **ativado/habilitado**

---

## ✅ SOLUÇÃO: Configurar no Painel Z-API

### Passo 1: Acessar Painel

1. **Acesse:** https://developer.z-api.io
2. **Faça login** na sua conta
3. **Vá para:** Instâncias → Sua instância

### Passo 2: Configurar Client-Token

1. **Na aba "Segurança" ou "Configurações":**
2. **Configure o Client-Token:**
   - Token: `23B770EAD3D54B9C0816D645`
   - Marque como **"Ativo"** ou **"Habilitado"**
   - Salve as configurações

### Passo 3: Verificar Status

1. **Verifique se a instância está:**
   - ✅ **Ativa**
   - ✅ **Conectada** ao WhatsApp
   - ✅ **Client-Token configurado**

### Passo 4: Obter QR Code (Se Necessário)

1. **Se não estiver conectado:**
   - Vá em "QR Code" na instância
   - Escaneie com seu WhatsApp
   - Aguarde "Conectado"

---

## 🔧 Configurar no FlowGest

Depois de configurar no painel, atualize o `.env`:

```env
# WhatsApp Configuration - Z-API
WHATSAPP_PROVIDER=zapi
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=23B770EAD3D54B9C0816D645
WHATSAPP_INSTANCE=3EAAFE5FE9E5C1E3453A1E9814A1DE6D
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## 🧪 Testar

Depois de configurar no painel:

```bash
cd server
node testar-z-api.js
```

---

## 💡 Importante

**O Client-Token precisa estar:**
- ✅ Configurado no painel da Z-API
- ✅ Ativo/Habilitado
- ✅ Associado à instância correta

**Sem isso, a API retorna erro 400!**

---

**Configure no painel primeiro e depois teste novamente!** 🚀

