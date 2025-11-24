# 📱 Passo a Passo: Configurar Z-API no FlowGest

## ⚠️ PROBLEMA ATUAL

O erro **"your client-token is not configured"** significa que o token precisa ser **configurado no painel da Z-API primeiro**.

---

## ✅ SOLUÇÃO: Configurar no Painel Z-API

### Passo 1: Acessar Painel

1. **Acesse:** https://developer.z-api.io
2. **Faça login** na sua conta Z-API

### Passo 2: Configurar Client-Token

1. **Vá em:** Instâncias → Sua instância (3EAAFE5FE9E5C1E3453A1E9814A1DE6D)
2. **Abra a aba:** "Segurança" ou "Configurações"
3. **Configure o Client-Token:**
   - Token: `23B770EAD3D54B9C0816D645`
   - Marque como **"Ativo"** ou **"Habilitado"**
   - Salve as configurações

### Passo 3: Verificar Status da Instância

1. **Verifique se a instância está:**
   - ✅ **Ativa**
   - ✅ **Conectada** ao WhatsApp
   - ✅ **Client-Token configurado e ativo**

### Passo 4: Obter QR Code (Se Necessário)

Se a instância não estiver conectada:

1. **Vá em:** QR Code na instância
2. **Escaneie** com seu WhatsApp (+55 81 994201799)
3. **Aguarde** status mudar para "Conectado"

---

## 🔧 Configurar no FlowGest

O `.env` já foi atualizado com:

```env
# WhatsApp Configuration - Z-API
WHATSAPP_PROVIDER=zapi
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=23B770EAD3D54B9C0816D645
WHATSAPP_INSTANCE=3EAAFE5FE9E5C1E3453A1E9814A1DE6D
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Não precisa mudar nada no .env!** ✅

---

## 🧪 Testar Depois de Configurar

Depois de configurar o Client-Token no painel:

```bash
cd server
node testar-z-api-com-numero-correto.js
```

**Você deve receber a mensagem no WhatsApp: +55 81 994201799** ✅

---

## 📋 Resumo

1. ✅ **.env configurado** - Já está pronto!
2. ⏳ **Configurar Client-Token no painel** - Você precisa fazer isso
3. ⏳ **Testar envio** - Depois de configurar

---

## 💡 Importante

**O Client-Token DEVE estar:**
- ✅ Configurado no painel da Z-API
- ✅ Ativo/Habilitado
- ✅ Associado à instância correta

**Sem isso, a API sempre retornará erro 400!**

---

**Configure o Client-Token no painel Z-API e depois teste novamente!** 🚀

