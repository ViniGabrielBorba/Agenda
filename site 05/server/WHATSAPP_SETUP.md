# Configuração do WhatsApp

Este sistema envia notificações via WhatsApp quando há novos agendamentos.

## Opções de API WhatsApp

### Opção 1: Evolution API (Recomendado - Gratuito)
A Evolution API é uma solução open-source e gratuita muito popular no Brasil.

**Passos:**
1. Instale a Evolution API seguindo: https://doc.evolution-api.com/
2. Ou use um serviço hospedado como: https://evolution-api.com/
3. Configure no `.env`:
```env
WHATSAPP_API_URL=https://sua-evolution-api.com
WHATSAPP_API_KEY=sua_chave_api
WHATSAPP_INSTANCE=nome_da_instancia
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Opção 2: Z-API (Brasil - Pago)
Serviço brasileiro de API WhatsApp.

**Passos:**
1. Cadastre-se em: https://developer.z-api.io/
2. Configure no `.env`:
```env
WHATSAPP_API_URL=https://api.z-api.io
WHATSAPP_API_KEY=seu_client_token
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Opção 3: ChatAPI (Brasil - Pago)
Outro serviço brasileiro popular.

**Passos:**
1. Cadastre-se em: https://chatapi.com.br/
2. Configure no `.env`:
```env
WHATSAPP_API_URL=https://api.chatapi.com.br
WHATSAPP_API_KEY=seu_token
PROFESSIONAL_WHATSAPP=+5581994201799
```

### Opção 4: Twilio (Internacional - Pago)
Serviço internacional confiável.

**Passos:**
1. Cadastre-se em: https://www.twilio.com/
2. Configure no `.env`:
```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
PROFESSIONAL_WHATSAPP=+5581994201799
```

## Configuração no .env

Adicione estas variáveis ao arquivo `server/.env`:

```env
# WhatsApp Configuration
WHATSAPP_API_URL=https://sua-api.com
WHATSAPP_API_KEY=sua_chave_api
WHATSAPP_INSTANCE=default
PROFESSIONAL_WHATSAPP=+5581994201799
```

## Como Funciona

1. **Quando um cliente agenda um serviço:**
   - O cliente recebe uma mensagem de confirmação no WhatsApp (se tiver telefone cadastrado)
   - O profissional (você) recebe uma notificação no WhatsApp com todos os detalhes do agendamento

2. **Mensagem para o profissional inclui:**
   - Nome do cliente
   - Telefone do cliente
   - Serviço agendado
   - Data e horário
   - Valor
   - Duração
   - Observações (se houver)

## Teste

Para testar sem configurar uma API real, o sistema funcionará em modo simulado (apenas logs no console).

Quando configurar uma API real, as mensagens serão enviadas automaticamente.

## Suporte

Se precisar de ajuda, verifique:
- Os logs do servidor para erros
- A documentação da API escolhida
- O formato do número de telefone (deve incluir código do país: +55)

