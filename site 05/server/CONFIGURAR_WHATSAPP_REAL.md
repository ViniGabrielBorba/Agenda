# 🚀 Como Configurar WhatsApp REAL - Passo a Passo

## ⚡ Opção 1: Evolution API (RECOMENDADO - GRATUITO)

A Evolution API é a solução mais popular e **100% gratuita** no Brasil.

### Passo 1: Escolher um Serviço Hospedado (Mais Fácil)

**Opção A: Evolution API Cloud (Hospedado)**
- Site: https://evolution-api.com/
- Preço: Gratuito para começar
- Passos:
  1. Acesse https://evolution-api.com/
  2. Crie uma conta
  3. Crie uma instância
  4. Conecte seu WhatsApp escaneando o QR Code
  5. Copie a API Key e URL da instância

**Opção B: Instalar Localmente (Avançado)**
- Documentação: https://doc.evolution-api.com/
- Requer conhecimento técnico

### Passo 2: Configurar no .env

Adicione ao arquivo `server/.env`:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://sua-evolution-api.com
WHATSAPP_API_KEY=sua_chave_api_aqui
WHATSAPP_INSTANCE=nome_da_sua_instancia
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Passo 3: Testar

1. Reinicie o servidor
2. Faça um agendamento de teste
3. Verifique se recebeu a mensagem no WhatsApp

---

## 💰 Opção 2: Z-API (Brasil - Pago, Mas Fácil)

Z-API é um serviço brasileiro muito fácil de usar.

### Passo 1: Criar Conta

1. Acesse: https://developer.z-api.io/
2. Crie uma conta
3. Crie um token
4. Conecte seu WhatsApp

### Passo 2: Configurar no .env

```env
# WhatsApp Configuration - Z-API
WHATSAPP_PROVIDER=zapi
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=seu_client_token_aqui
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Passo 3: Testar

1. Reinicie o servidor
2. Faça um agendamento de teste

---

## 💰 Opção 3: ChatAPI (Brasil - Pago)

Outro serviço brasileiro popular.

### Passo 1: Criar Conta

1. Acesse: https://chatapi.com.br/
2. Crie uma conta
3. Obtenha seu token

### Passo 2: Configurar no .env

```env
# WhatsApp Configuration - ChatAPI
WHATSAPP_PROVIDER=chatapi
WHATSAPP_API_URL=https://api.chatapi.com.br
WHATSAPP_API_KEY=seu_token_aqui
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## 📋 Resumo Rápido

### Para começar AGORA (Evolution API Cloud):

1. **Acesse:** https://evolution-api.com/
2. **Crie conta** e instância
3. **Conecte WhatsApp** (escaneie QR Code)
4. **Copie:**
   - URL da API
   - API Key
   - Nome da instância
5. **Adicione ao `.env`:**
   ```env
   WHATSAPP_PROVIDER=evolution
   WHATSAPP_API_URL=https://sua-url.com
   WHATSAPP_API_KEY=sua_chave
   WHATSAPP_INSTANCE=nome_instancia
   PROFESSIONAL_WHATSAPP=+5581994201799
   ```
6. **Reinicie o servidor**
7. **Teste fazendo um agendamento**

---

## ✅ Verificação

Após configurar, quando alguém agendar um serviço, você receberá no WhatsApp (+55 81 994201799):

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

## 🆘 Problemas Comuns

### "Erro ao enviar WhatsApp"
- Verifique se a API Key está correta
- Verifique se a URL da API está correta
- Verifique se o WhatsApp está conectado na instância
- Veja os logs do servidor para mais detalhes

### "Mensagem não chega"
- Verifique se o número está no formato correto: +5581994201799
- Verifique se o WhatsApp está conectado na instância da API
- Teste enviando uma mensagem manual pela API primeiro

### "API não responde"
- Verifique se a URL está acessível
- Verifique se não há firewall bloqueando
- Tente usar HTTPS ao invés de HTTP

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do servidor
2. Teste a API diretamente (usando Postman ou curl)
3. Consulte a documentação da API escolhida

