# ✅ Configuração Completa - Evolution API

## 🎉 Status da Configuração

### ✅ O que já está configurado:

1. **Docker e Evolution API**
   - ✅ Evolution API rodando na porta 8080
   - ✅ PostgreSQL configurado
   - ✅ Redis configurado
   - ✅ Instância "flowgest" criada

2. **Arquivo .env**
   - ✅ Variáveis do WhatsApp adicionadas:
     - `WHATSAPP_PROVIDER=evolution`
     - `WHATSAPP_API_URL=http://localhost:8080`
     - `WHATSAPP_API_KEY=FlowGest2024SecretKey!`
     - `WHATSAPP_INSTANCE=flowgest`
     - `PROFESSIONAL_WHATSAPP=+5581994201799`

---

## 📱 Próximo Passo: Conectar WhatsApp

### 1. Acesse a URL de conexão:
👉 **http://localhost:8080/instance/connect/flowgest**

### 2. Escaneie o QR Code:
1. Abra o WhatsApp no celular
2. Vá em: **Configurações** → **Aparelhos conectados**
3. Toque em **"Conectar um aparelho"**
4. Escaneie o QR Code que aparece na tela
5. Aguarde aparecer **"Conectado"** ✅

---

## 🧪 Testar a Integração

Após conectar o WhatsApp, execute:

```bash
cd server
npm run test:whatsapp
```

Você deve receber uma mensagem de teste no WhatsApp!

---

## 🚀 Usar no Sistema

Agora quando alguém agendar um serviço no FlowGest, você receberá automaticamente uma notificação no WhatsApp (+55 81 994201799) com todos os detalhes:

```
🎉 *NOVO AGENDAMENTO!*

👤 *Cliente:* Nome do Cliente
📞 *Telefone:* (81) 99999-9999
💅 *Serviço:* Manicure
📅 *Data:* segunda-feira, 25 de novembro de 2024
⏰ *Horário:* 10:30
💰 *Valor:* R$ 40.00
⏱️ *Duração:* 60 minutos

✨ FlowGest - Sistema de Agendamento
```

---

## 🛠️ Comandos Úteis

### Verificar se está rodando:
```bash
docker ps
```

### Parar Evolution API:
```bash
cd server
docker-compose -f docker-compose-evolution.yml stop
```

### Iniciar Evolution API:
```bash
cd server
docker-compose -f docker-compose-evolution.yml start
```

### Ver logs:
```bash
docker logs evolution_api
```

### Reiniciar tudo:
```bash
cd server
docker-compose -f docker-compose-evolution.yml restart
```

---

## ⚠️ Importante

- A Evolution API precisa estar rodando sempre que você usar o sistema
- Se reiniciar o computador, execute: `docker-compose -f docker-compose-evolution.yml start`
- Mantenha o WhatsApp conectado (não desconecte manualmente)

---

## ✅ Checklist Final

- [x] Evolution API instalada e rodando
- [x] Instância "flowgest" criada
- [x] Arquivo .env configurado
- [ ] WhatsApp conectado (QR Code escaneado) ← **FAÇA ISSO AGORA!**
- [ ] Teste executado (`npm run test:whatsapp`)
- [ ] Mensagem de teste recebida no WhatsApp

---

**Próximo passo:** Conecte seu WhatsApp acessando http://localhost:8080/instance/connect/flowgest 🚀

