# 🚀 INÍCIO RÁPIDO - WhatsApp Real em 5 Minutos

## ⚡ Opção Mais Rápida: Evolution API Cloud

### Passo 1: Criar Conta (2 minutos)
1. Acesse: **https://evolution-api.com/**
2. Clique em "Sign Up" ou "Criar Conta"
3. Preencha seus dados e confirme o email

### Passo 2: Criar Instância (1 minuto)
1. No painel, clique em "Criar Instância" ou "New Instance"
2. Dê um nome (ex: "flowgest")
3. Anote a **URL da API** e **API Key** que aparecem

### Passo 3: Conectar WhatsApp (1 minuto)
1. Na instância criada, clique em "Conectar WhatsApp"
2. Escaneie o QR Code com seu WhatsApp
3. Aguarde a conexão (aparece "Conectado")

### Passo 4: Configurar no Sistema (1 minuto)

Abra o arquivo `server/.env` e adicione:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://sua-url-evolution.com
WHATSAPP_API_KEY=sua_chave_api_aqui
WHATSAPP_INSTANCE=nome_da_instancia
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Substitua:**
- `https://sua-url-evolution.com` pela URL que você copiou
- `sua_chave_api_aqui` pela API Key que você copiou
- `nome_da_instancia` pelo nome que você deu (ex: "flowgest")

### Passo 5: Reiniciar e Testar
1. Pare o servidor (Ctrl+C)
2. Inicie novamente: `npm run dev` (na pasta server)
3. Faça um agendamento de teste
4. Verifique se recebeu a mensagem no WhatsApp!

---

## ✅ Exemplo Completo de .env

```env
# ... outras configurações existentes ...

# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://api.evolution-api.com
WHATSAPP_API_KEY=ABC123XYZ789
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## 🆘 Problemas?

### "Erro ao enviar WhatsApp"
- ✅ Verifique se copiou a URL e API Key corretamente
- ✅ Verifique se o WhatsApp está conectado na instância
- ✅ Veja os logs do servidor para mais detalhes

### "Mensagem não chega"
- ✅ Verifique se o número está correto: +5581994201799
- ✅ Teste enviando uma mensagem manual pela API primeiro
- ✅ Verifique se a instância está "Conectada"

### "API não responde"
- ✅ Verifique se a URL está acessível
- ✅ Tente usar HTTPS
- ✅ Verifique se não há firewall bloqueando

---

## 📞 Precisa de Ajuda?

1. Veja o arquivo `CONFIGURAR_WHATSAPP_REAL.md` para mais detalhes
2. Consulte a documentação: https://doc.evolution-api.com/
3. Verifique os logs do servidor para erros específicos

---

## 🎉 Pronto!

Agora quando alguém agendar um serviço, você receberá automaticamente no WhatsApp (+55 81 994201799) uma mensagem com todos os detalhes!

