# 📱 Como Configurar Evolution API - Guia Visual

Baseado na documentação que você está vendo, aqui está o passo a passo:

## 🎯 Passo 1: Criar a Instância (Tela que você está vendo)

### Na documentação Evolution API:

**Endpoint:** `POST /instance/create`

### 1.1 Preencher os dados:

**Headers:**
```
Content-Type: application/json
apikey: sua_api_key_aqui
```

**Body (JSON):**
```json
{
  "instanceName": "flowgest",
  "token": "",
  "qrcode": true,
  "number": "",
  "integration": "WHATSAPP-BAILEYS",
  "webhook": "",
  "webhook_by_events": true,
  "events": [
    "APPLICATION_STARTUP"
  ]
}
```

### 1.2 Usar o botão "Try it ►" na documentação

Ou usar cURL (copie e cole no terminal):

```bash
curl --request POST \
  --url https://sua-url-evolution.com/instance/create \
  --header 'Content-Type: application/json' \
  --header 'apikey: sua_api_key_aqui' \
  --data '{
    "instanceName": "flowgest",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### 1.3 Resposta esperada (201):

```json
{
  "instance": {
    "instanceName": "flowgest",
    "instanceId": "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
    "status": "created"
  },
  "hash": {
    "apikey": "123456"
  }
}
```

**Anote:**
- `instanceName`: "flowgest" (você escolheu)
- `instanceId`: será gerado automaticamente
- `apikey` no hash: pode ser usado como token

---

## 🔗 Passo 2: Conectar WhatsApp

### 2.1 Na documentação, vá para:
**GET** `/instance/connect/{instanceName}`

### 2.2 Acesse no navegador:
```
https://sua-url-evolution.com/instance/connect/flowgest
```

### 2.3 Escaneie o QR Code:
- Abra o WhatsApp no celular
- Vá em Configurações > Aparelhos conectados
- Escaneie o QR Code que aparecer na tela
- Aguarde até aparecer "Conectado"

---

## ⚙️ Passo 3: Configurar no FlowGest

### 3.1 Edite `server/.env`:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://sua-url-evolution.com
WHATSAPP_API_KEY=sua_api_key_aqui
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Onde encontrar:**
- `WHATSAPP_API_URL`: URL do servidor Evolution API (ex: `https://api.evolution-api.com`)
- `WHATSAPP_API_KEY`: A mesma `apikey` que você usou no header
- `WHATSAPP_INSTANCE`: O `instanceName` que você criou (ex: "flowgest")

---

## ✅ Passo 4: Verificar Status

### 4.1 Na documentação, vá para:
**GET** `/instance/connectionState/{instanceName}`

### 4.2 Ou use o script de teste:

```bash
cd server
npm run test:whatsapp
```

Isso vai:
- Verificar se a instância existe
- Verificar se o WhatsApp está conectado
- Enviar uma mensagem de teste

---

## 🧪 Passo 5: Testar

### 5.1 Reiniciar o servidor:

```bash
cd server
npm run dev
```

### 5.2 Fazer um agendamento de teste:

1. Acesse o sistema
2. Faça login como cliente
3. Agende um serviço
4. Verifique se recebeu a mensagem no WhatsApp!

---

## 📋 Resumo Rápido

1. **Criar instância:** `POST /instance/create` (tela que você está vendo)
2. **Conectar WhatsApp:** Acessar `/instance/connect/flowgest` e escanear QR Code
3. **Configurar .env:** Adicionar as variáveis com URL, API Key e nome da instância
4. **Reiniciar servidor:** `npm run dev`
5. **Testar:** Fazer um agendamento e verificar WhatsApp

---

## 🆘 Problemas Comuns

### "Instance not found"
- Verifique se criou a instância primeiro
- Verifique se o nome está correto no `.env`

### "Unauthorized" (403)
- Verifique se a API Key está correta
- Verifique se está enviando no header `apikey`

### WhatsApp não conecta
- Acesse `/instance/connect/flowgest` novamente
- Escaneie o QR Code novamente
- Aguarde alguns segundos após escanear

### Mensagens não chegam
- Verifique status: deve estar "open"
- Teste com: `npm run test:whatsapp`
- Verifique os logs do servidor

---

## 📞 Endpoints Úteis (na documentação)

- **GET** `/instance/fetchInstances` - Ver todas as instâncias
- **GET** `/instance/connectionState/{instanceName}` - Ver status
- **PUT** `/instance/restart/{instanceName}` - Reiniciar
- **DELETE** `/instance/logout/{instanceName}` - Desconectar
- **DELETE** `/instance/delete/{instanceName}` - Deletar

---

## 🎉 Pronto!

Agora você pode usar o botão "Try it ►" na documentação para criar a instância e depois configurar no `.env`!

