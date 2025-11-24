# 📱 Conectar WhatsApp Agora - Passo a Passo

## ⚠️ Situação Atual

Você **NÃO escaneou o QR Code ainda**! Por isso as mensagens não estão chegando.

A instância está criada, mas o WhatsApp **não está conectado**.

---

## ✅ Passo a Passo para Conectar

### 1️⃣ Obter o QR Code

**Opção 1: Evolution Manager (RECOMENDADO)**
1. Acesse: **http://localhost:8080/manager**
2. Faça login com: `FlowGest2024SecretKey!`
3. Na instância "FlowGest":
   - Clique no botão verde **"RESTART"**
   - **Aguarde 20-30 segundos**
   - Clique no botão laranja **"Get QR Code"**
   - O QR Code deve aparecer no modal!

**Opção 2: URL Direta**
- Acesse: **http://localhost:8080/instance/connect/FlowGest?apikey=FlowGest2024SecretKey!**

**Opção 3: Página HTML**
- Abra: `server/conectar-whatsapp.html` no navegador

---

### 2️⃣ Escanear o QR Code

1. **Abra o WhatsApp no celular** (número: +55 81 994201799)
2. **Vá em:** Configurações → Aparelhos conectados
3. **Toque em:** "Conectar um aparelho"
4. **Escaneie o QR Code** que apareceu na tela
5. **Aguarde** até aparecer "Conectado" ✅

---

### 3️⃣ Verificar Conexão

Depois de escanear, verifique:

1. **No Evolution Manager:**
   - Status deve mudar para **"Conectado"** (verde)
   - Deve aparecer o número: **5581994201799**

2. **No WhatsApp:**
   - Deve aparecer "Aparelho conectado"
   - Você pode usar o WhatsApp Web normalmente

---

### 4️⃣ Testar Envio de Mensagem

Depois de conectar, execute:

```bash
cd server
node testar-whatsapp.js
```

Você deve receber a mensagem no WhatsApp! ✅

---

## ⚠️ Problemas Comuns

### QR Code não aparece:
1. Clique em "RESTART" primeiro
2. Aguarde 20-30 segundos
3. Clique em "Get QR Code" novamente

### QR Code expira:
- QR Codes expiram rápido (alguns minutos)
- Gere um novo QR Code se o anterior expirou

### Não conecta:
- Verifique se está usando o número correto: **+55 81 994201799**
- Tente desconectar e reconectar
- Reinicie a instância no Manager

---

## ✅ Depois de Conectar

Quando estiver conectado:
- ✅ Mensagens serão enviadas automaticamente
- ✅ Você receberá notificações de agendamentos
- ✅ Tudo funcionará perfeitamente!

---

**Agora vá escanear o QR Code!** 📱✨

