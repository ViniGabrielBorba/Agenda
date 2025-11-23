# 🚀 Configurar Evolution API - Passo a Passo

## 📋 Passo 1: Criar Instância na Evolution API

### 1.1 Obter URL do Servidor e API Key

Primeiro, você precisa ter:
- **URL do servidor Evolution API** (ex: `https://api.evolution-api.com`)
- **API Key** (chave de autorização)

### 1.2 Criar a Instância

Use o endpoint que você está vendo na documentação:

**POST** `/instance/create`

**Headers:**
```
Content-Type: application/json
apikey: sua_api_key_aqui
```

**Body:**
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

**Exemplo com cURL:**
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

### 1.3 Conectar WhatsApp

Após criar a instância, você receberá uma resposta com o `instanceId`. 

**Para conectar o WhatsApp:**

**GET** `/instance/connect/{instanceName}`

Ou acesse a URL no navegador:
```
https://sua-url-evolution.com/instance/connect/flowgest
```

Escaneie o QR Code com seu WhatsApp.

---

## ⚙️ Passo 2: Configurar no Sistema FlowGest

### 2.1 Editar o arquivo `server/.env`

Adicione estas variáveis:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://sua-url-evolution.com
WHATSAPP_API_KEY=sua_api_key_aqui
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Substitua:**
- `https://sua-url-evolution.com` pela URL do seu servidor Evolution API
- `sua_api_key_aqui` pela sua API Key
- `flowgest` pelo nome da instância que você criou

### 2.2 Exemplo Completo de .env

```env
# Database
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/agendamento_db"

# JWT
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://api.evolution-api.com
WHATSAPP_API_KEY=1234567890abcdef
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## 🔧 Passo 3: Verificar Conexão

### 3.1 Verificar Status da Instância

**GET** `/instance/connectionState/{instanceName}`

Ou use cURL:
```bash
curl --request GET \
  --url https://sua-url-evolution.com/instance/connectionState/flowgest \
  --header 'apikey: sua_api_key_aqui'
```

A resposta deve mostrar `"state": "open"` quando estiver conectado.

### 3.2 Testar Envio de Mensagem

O sistema FlowGest já está configurado para usar a Evolution API. Quando você:

1. Reiniciar o servidor
2. Fazer um agendamento de teste
3. Verificar se recebeu a mensagem no WhatsApp

---

## 📱 Passo 4: Como Funciona no FlowGest

### 4.1 Quando um Cliente Agenda

O sistema automaticamente:

1. **Envia confirmação para o cliente** (se tiver telefone):
   ```
   ✅ Agendamento Confirmado!
   
   💅 Serviço: Manicure
   👤 Profissional: Nome do Profissional
   📅 Data: segunda-feira, 25 de novembro de 2024
   ⏰ Horário: 10:30
   💰 Valor: R$ 40.00
   ⏱️ Duração: 60 minutos
   
   ✨ Obrigado por escolher FlowGest!
   ```

2. **Envia notificação para você** (+55 81 994201799):
   ```
   🎉 NOVO AGENDAMENTO!
   
   👤 Cliente: Nome do Cliente
   📞 Telefone: (81) 99999-9999
   💅 Serviço: Manicure
   📅 Data: segunda-feira, 25 de novembro de 2024
   ⏰ Horário: 10:30
   💰 Valor: R$ 40.00
   ⏱️ Duração: 60 minutos
   
   ✨ FlowGest - Sistema de Agendamento
   ```

---

## 🆘 Solução de Problemas

### Erro: "Instance not found"
- Verifique se o nome da instância está correto no `.env`
- Certifique-se de que a instância foi criada

### Erro: "Unauthorized" ou "Invalid API Key"
- Verifique se a API Key está correta
- Verifique se está enviando no header `apikey`

### Erro: "WhatsApp not connected"
- Acesse `/instance/connect/{instanceName}` e escaneie o QR Code novamente
- Verifique o status da conexão

### Mensagens não chegam
- Verifique se o WhatsApp está conectado (status: "open")
- Verifique os logs do servidor para erros
- Teste enviando uma mensagem manual pela API primeiro

---

## 📚 Endpoints Úteis da Evolution API

### Ver todas as instâncias
```bash
GET /instance/fetchInstances
```

### Reiniciar instância
```bash
PUT /instance/restart/{instanceName}
```

### Desconectar WhatsApp
```bash
DELETE /instance/logout/{instanceName}
```

### Deletar instância
```bash
DELETE /instance/delete/{instanceName}
```

---

## ✅ Checklist de Configuração

- [ ] Tenho URL do servidor Evolution API
- [ ] Tenho API Key
- [ ] Criei a instância (POST /instance/create)
- [ ] Conectei o WhatsApp (escaneou QR Code)
- [ ] Verifiquei que está conectado (status: "open")
- [ ] Configurei o `.env` com todas as variáveis
- [ ] Reiniciei o servidor
- [ ] Testei fazendo um agendamento

---

## 🎉 Pronto!

Agora seu sistema está configurado para enviar mensagens reais via WhatsApp usando a Evolution API!

Quando alguém agendar um serviço, você receberá automaticamente uma notificação no WhatsApp (+55 81 994201799) com todos os detalhes.

