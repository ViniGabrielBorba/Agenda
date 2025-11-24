# 📱 Como Obter QR Code no Evolution Manager - Passo a Passo

## ⚠️ Problema

O QR Code não aparece automaticamente. A Evolution API v2.2.3 requer que você use o **Manager** para obter o QR Code.

---

## ✅ SOLUÇÃO: Use o Evolution Manager

### Passo 1: Acessar o Manager

1. **Abra o navegador**
2. **Acesse:** http://localhost:8080/manager
3. **Faça login com:**
   - API Key: `FlowGest2024SecretKey!`

---

### Passo 2: Desconectar a Instância (Se Necessário)

1. **Na tela da instância "FlowGest":**
2. **Clique no botão vermelho "DESCONECTAR"**
3. **Aguarde** até o status mudar para "Desconectado"

**Por quê?** Às vezes é necessário desconectar primeiro para gerar um novo QR Code.

---

### Passo 3: Reiniciar a Instância

1. **Clique no botão verde "RESTART"** (ou "REINICIAR")
2. **AGUARDE 30 SEGUNDOS** (muito importante!)
   - Você verá o status mudando
   - Aguarde até estabilizar

**⚠️ IMPORTANTE:** Não clique em "Get QR Code" antes de aguardar 30 segundos!

---

### Passo 4: Gerar QR Code

1. **Depois de aguardar 30 segundos:**
2. **Clique no botão laranja "Get QR Code"** (ou "Gerar QR Code")
3. **O QR Code deve aparecer no modal!**

---

### Passo 5: Se o QR Code Ainda Não Aparecer

**Tente esta sequência:**

1. **DESCONECTAR** (botão vermelho)
2. **Aguarde 10 segundos**
3. **RESTART** (botão verde)
4. **Aguarde 30 segundos** (muito importante!)
5. **Get QR Code** (botão laranja)

**Ou recrie a instância:**

1. **DELETE** a instância "FlowGest"
2. **Crie uma nova** com o mesmo nome
3. **O QR Code deve aparecer automaticamente** ao criar

---

## 🔄 Alternativa: Recriar Instância

Se nada funcionar, recrie a instância:

1. **No Manager:**
   - Clique em "DELETE" na instância "FlowGest"
   - Confirme a exclusão

2. **Crie uma nova:**
   - Clique em "Instance +" (botão verde no topo)
   - Nome: `FlowGest`
   - Canal: `WHATSAPP-BAILEYS` ou `Evolution`
   - Token: Deixe vazio
   - Número: Deixe vazio
   - Business ID: Deixe vazio
   - Clique em "Salvar"

3. **O QR Code deve aparecer automaticamente** ao criar!

---

## 📱 Depois de Obter o QR Code

1. **Abra o WhatsApp no celular** (+55 81 994201799)
2. **Configurações → Aparelhos conectados**
3. **"Conectar um aparelho"**
4. **Escaneie o QR Code**
5. **Aguarde "Conectado"**

---

## ✅ Verificar Conexão

Depois de escanear:
- Status no Manager deve mudar para **"Conectado"** (verde)
- Deve aparecer o número: **5581994201799**

---

**Tente essas soluções e me avise se conseguiu!** 🚀

