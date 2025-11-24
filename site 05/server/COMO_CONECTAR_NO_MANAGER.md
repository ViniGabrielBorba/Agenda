# 📱 Como Conectar WhatsApp no Evolution Manager

## ✅ Você está na tela certa!

Vejo que você está no **Evolution Manager** e a instância **"flowgest"** está aparecendo como **"Disconnected"**.

---

## 🔗 Passos para Conectar:

### 1. Clique na instância "flowgest"
   - Clique no card da instância "flowgest" (o card cinza escuro à esquerda)

### 2. Ou clique no botão "Disconnected"
   - Clique no botão vermelho "Disconnected" que aparece no card

### 3. Isso deve abrir:
   - Uma tela com o **QR Code** para escanear
   - Ou opções para conectar

### 4. Escaneie o QR Code:
   - Abra o WhatsApp no celular
   - Vá em: **Configurações** → **Aparelhos conectados**
   - Toque em **"Conectar um aparelho"**
   - Escaneie o QR Code que aparece na tela

### 5. Aguarde a confirmação:
   - O status deve mudar de "Disconnected" para "Connected" ou "Open"
   - O botão deve ficar verde

---

## 🔍 Se não aparecer o QR Code:

### Opção A: Use o botão de configurações
   - Clique no ícone de **engrenagem** (⚙️) ao lado do nome "flowgest"
   - Procure por opções de "Connect" ou "QR Code"

### Opção B: Use o botão "Instance +"
   - Clique no botão verde **"Instance +"** no topo
   - Selecione a instância "flowgest"
   - Procure pela opção de conectar

### Opção C: Acesse diretamente via API
   - Abra uma nova aba
   - Acesse: `http://localhost:8080/instance/connect/flowgest?apikey=FlowGest2024SecretKey!`

---

## ✅ Verificar se Conectou:

Após escanear o QR Code:
1. O status deve mudar de "Disconnected" para "Connected"
2. O botão deve ficar verde
3. Você pode testar com: `npm run test:whatsapp`

---

## 🆘 Se ainda não funcionar:

1. **Recarregue a página** do Manager (F5)
2. **Verifique se a Evolution API está rodando:**
   ```bash
   docker ps
   ```
3. **Tente criar uma nova instância:**
   - Clique em "Instance +"
   - Nome: "flowgest2"
   - Depois conecte

---

**Dica:** Normalmente, clicar no card da instância ou no botão "Disconnected" abre a tela de conexão com o QR Code! 📱

