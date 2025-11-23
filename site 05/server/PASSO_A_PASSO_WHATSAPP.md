# 📱 Passo a Passo - Configurar WhatsApp no FlowGest

## 🎯 Objetivo
Configurar o sistema para enviar mensagens reais no WhatsApp quando alguém agendar um serviço.

---

## 🤔 Antes de Começar: Qual API Escolher?

**👉 Leia primeiro:** `ESCOLHER_API_WHATSAPP.md`

**Resumo rápido:**
- 🟢 **Z-API** - Mais fácil, pago (R$ 29,90/mês) ⭐ RECOMENDADO
- 🟢 **ChatAPI** - Fácil, pago (R$ 30-50/mês)
- 🟡 **Evolution API** - Grátis mas precisa instalar (avançado)

**Para iniciantes:** Use Z-API! É o mais simples.

---

## 📋 Passo 1: Escolher Serviço de WhatsApp API

Você tem 3 opções principais:

### Opção A: Evolution API (Instalar Localmente) ⚙️
- **Gratuito** mas requer instalação
- Documentação: https://doc.evolution-api.com/
- Requer servidor próprio ou VPS

### Opção B: Serviço Hospedado Evolution API 💰
- Serviços que já têm Evolution API instalada
- Exemplos: Evolution API Cloud, Evolution Host
- Pago mas mais fácil de usar

### Opção C: Z-API ou ChatAPI (Brasil) 💰
- Serviços brasileiros prontos
- Z-API: https://developer.z-api.io/
- ChatAPI: https://chatapi.com.br/
- Mais fácil, mas pago

### 🎯 Recomendação para Iniciantes:
**Use Z-API ou ChatAPI** - São mais fáceis e já vêm prontos!

---

## 📋 Passo 1A: Se escolheu Z-API (Mais Fácil)

### 1.1 Acesse o site
👉 **https://developer.z-api.io/**

### 1.2 Crie sua conta
- Clique em "Cadastrar" ou "Criar Conta"
- Preencha seus dados
- Confirme seu email

### 1.3 Obtenha suas credenciais
- No painel, vá em "Tokens" ou "API"
- Crie um novo token
- Anote o **Client Token**

### 1.4 Conecte seu WhatsApp
- No painel, vá em "Dispositivos" ou "WhatsApp"
- Clique em "Conectar"
- Escaneie o QR Code com seu WhatsApp

### 1.5 Anote suas informações
Você vai precisar de:
- ✅ **URL da API**: `https://api.z-api.io`
- ✅ **Client Token**: O token que você criou

---

## 🔧 Passo 2: Criar Instância do WhatsApp

### 2.1 Acesse a documentação
👉 Na documentação da Evolution API, encontre: **"POST Create Instance Basic"**

### 2.2 Preencha os dados

**Headers:**
```
apikey: sua_api_key_aqui
```

**Body (JSON):**
```json
{
  "instanceName": "flowgest",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```

### 2.3 Execute
- Clique no botão **"Try it ►"** na documentação
- Ou copie o comando cURL e execute no terminal

### 2.4 Anote o resultado
Você receberá algo como:
```json
{
  "instance": {
    "instanceName": "flowgest",
    "instanceId": "abc123..."
  }
}
```

✅ **Anote o `instanceName`** (no exemplo: "flowgest")

---

## 📱 Passo 3: Conectar seu WhatsApp

### 3.1 Acesse a URL de conexão
No navegador, acesse:
```
https://sua-url-evolution.com/instance/connect/flowgest
```

**Substitua:**
- `sua-url-evolution.com` pela URL do seu servidor
- `flowgest` pelo nome da instância que você criou

### 3.2 Escaneie o QR Code
1. Abra o WhatsApp no celular
2. Vá em: **Configurações** → **Aparelhos conectados**
3. Toque em **"Conectar um aparelho"**
4. Escaneie o QR Code que aparece na tela
5. Aguarde aparecer **"Conectado"** ✅

---

## ⚙️ Passo 4: Configurar no FlowGest

### 4.1 Abra o arquivo de configuração
Abra o arquivo: `server/.env`

### 4.2 Adicione estas linhas no final:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://sua-url-evolution.com
WHATSAPP_API_KEY=sua_api_key_aqui
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

### 4.3 Substitua os valores:

| Variável | O que colocar |
|----------|---------------|
| `WHATSAPP_API_URL` | URL do servidor Evolution API |
| `WHATSAPP_API_KEY` | Sua API Key |
| `WHATSAPP_INSTANCE` | Nome da instância (ex: "flowgest") |
| `PROFESSIONAL_WHATSAPP` | Seu número: +5581994201799 |

### 4.4 Exemplo completo:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# JWT
JWT_SECRET="sua_chave_secreta"

# WhatsApp Configuration
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://api.evolution-api.com
WHATSAPP_API_KEY=ABC123XYZ789
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## ✅ Passo 5: Testar a Configuração

### 5.1 Abra o terminal
No terminal, vá para a pasta do servidor:

```bash
cd server
```

### 5.2 Execute o teste

```bash
npm run test:whatsapp
```

### 5.3 O que vai acontecer:

✅ Se estiver tudo certo:
- Vai mostrar "WhatsApp está conectado!"
- Vai enviar uma mensagem de teste
- Você receberá no WhatsApp: "🧪 Teste do FlowGest..."

❌ Se der erro:
- Vai mostrar qual é o problema
- Siga as dicas que aparecerem na tela

---

## 🚀 Passo 6: Reiniciar o Servidor

### 6.1 Pare o servidor
Se estiver rodando, pressione `Ctrl + C`

### 6.2 Inicie novamente

```bash
npm run dev
```

Ou na raiz do projeto:

```bash
npm run dev
```

---

## 🎉 Passo 7: Testar com Agendamento Real

### 7.1 Faça um agendamento de teste
1. Acesse o sistema: http://localhost:3000
2. Faça login como cliente
3. Agende um serviço qualquer

### 7.2 Verifique seu WhatsApp
Você deve receber uma mensagem assim:

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

## 🆘 Problemas e Soluções

### ❌ "Instance not found"
**Solução:** 
- Verifique se criou a instância no Passo 2
- Verifique se o nome está correto no `.env`

### ❌ "Unauthorized" ou "Invalid API Key"
**Solução:**
- Verifique se a API Key está correta
- Copie e cole novamente do painel da Evolution API

### ❌ "WhatsApp not connected"
**Solução:**
- Acesse a URL de conexão novamente (Passo 3)
- Escaneie o QR Code novamente
- Aguarde alguns segundos após escanear

### ❌ Mensagens não chegam
**Solução:**
1. Execute o teste: `npm run test:whatsapp`
2. Verifique se o WhatsApp está conectado
3. Verifique os logs do servidor para erros
4. Teste enviando uma mensagem manual pela API primeiro

---

## 📝 Checklist Final

Antes de considerar que está tudo pronto, verifique:

- [ ] Criei conta na Evolution API
- [ ] Criei a instância (Passo 2)
- [ ] Conectei o WhatsApp (escaneou QR Code)
- [ ] Configurei o `.env` com todas as variáveis
- [ ] Executei o teste (`npm run test:whatsapp`) e funcionou
- [ ] Reiniciei o servidor
- [ ] Fiz um agendamento de teste
- [ ] Recebi a mensagem no WhatsApp ✅

---

## 🎯 Resumo Rápido

1. **Criar conta** → https://evolution-api.com/
2. **Criar instância** → POST /instance/create
3. **Conectar WhatsApp** → Escanear QR Code
4. **Configurar .env** → Adicionar variáveis
5. **Testar** → `npm run test:whatsapp`
6. **Reiniciar** → `npm run dev`
7. **Usar** → Fazer agendamento e verificar WhatsApp

---

## 💡 Dicas Importantes

- ✅ Mantenha o WhatsApp conectado (não desconecte)
- ✅ Guarde sua API Key em local seguro
- ✅ Teste sempre após mudanças no `.env`
- ✅ Verifique os logs do servidor se algo não funcionar

---

## 📞 Precisa de Ajuda?

1. Veja os logs do servidor (mensagens de erro)
2. Execute `npm run test:whatsapp` para diagnosticar
3. Verifique a documentação: https://doc.evolution-api.com/

---

**Pronto! Agora você está configurado para receber notificações reais no WhatsApp! 🎉**

