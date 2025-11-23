# 🐳 Como Instalar Evolution API com Docker

## 🎯 Objetivo
Instalar a Evolution API no seu computador para usar com o FlowGest.

---

## 📋 Passo 1: Instalar Docker

### 1.1 Baixar Docker
👉 **Acesse:** https://www.docker.com/products/docker-desktop/

### 1.2 Instalar
- Baixe o Docker Desktop para Windows
- Execute o instalador
- Siga as instruções
- Reinicie o computador se pedir

### 1.3 Verificar se instalou
Abra o terminal (PowerShell) e digite:
```bash
docker --version
```

Se aparecer a versão, está instalado! ✅

---

## 🚀 Passo 2: Executar Evolution API

### 2.1 Abra o terminal
Abra o PowerShell ou Prompt de Comando

### 2.2 Execute o comando

**⚠️ IMPORTANTE:** Substitua `mude-me` por uma senha forte!

```bash
docker run -d --name evolution_api -p 8080:8080 -e AUTHENTICATION_API_KEY=minha_senha_secreta_123 atendai/evolution-api:latest
```

**Exemplo com senha:**
```bash
docker run -d --name evolution_api -p 8080:8080 -e AUTHENTICATION_API_KEY=FlowGest2024! atendai/evolution-api:latest
```

### 2.3 Aguarde alguns segundos
O Docker vai baixar e iniciar a Evolution API (pode demorar 1-2 minutos na primeira vez)

---

## ✅ Passo 3: Verificar se Está Funcionando

### 3.1 Abra o navegador
Acesse: **http://localhost:8080**

### 3.2 Você deve ver:
```json
{
   "status":200,
   "message":"Welcome to the Evolution API, it is working!",
   "version":"1.x.x",
   "swagger":"http://localhost:8080/docs",
   "manager":"http://localhost:8080/manager",
   "documentation":"https://doc.evolution-api.com"
}
```

✅ **Se apareceu isso, está funcionando!**

---

## 📱 Passo 4: Criar Instância do WhatsApp

### 4.1 Acesse a documentação
No navegador, acesse: **http://localhost:8080/docs**

### 4.2 Encontre o endpoint
Procure por: **"POST /instance/create"**

### 4.3 Preencha os dados

**Headers:**
```
apikey: minha_senha_secreta_123
```
*(Use a mesma senha que você colocou no comando Docker)*

**Body (JSON):**
```json
{
  "instanceName": "flowgest",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```

### 4.4 Execute
- Clique em **"Try it out"**
- Clique em **"Execute"**

### 4.5 Anote o resultado
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

## 🔗 Passo 5: Conectar WhatsApp

### 5.1 Acesse a URL de conexão
No navegador, acesse:
```
http://localhost:8080/instance/connect/flowgest
```

**Substitua `flowgest` pelo nome da instância que você criou**

### 5.2 Escaneie o QR Code
1. Abra o WhatsApp no celular
2. Vá em: **Configurações** → **Aparelhos conectados**
3. Toque em **"Conectar um aparelho"**
4. Escaneie o QR Code que aparece na tela
5. Aguarde aparecer **"Conectado"** ✅

---

## ⚙️ Passo 6: Configurar no FlowGest

### 6.1 Abra o arquivo
Abra: `server/.env`

### 6.2 Adicione estas linhas:

```env
# WhatsApp Configuration - Evolution API (Local)
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=minha_senha_secreta_123
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Substitua:**
- `minha_senha_secreta_123` pela senha que você usou no Docker
- `flowgest` pelo nome da instância que você criou

### 6.3 Exemplo completo:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# JWT
JWT_SECRET="sua_chave_secreta"

# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=FlowGest2024!
WHATSAPP_INSTANCE=flowgest
PROFESSIONAL_WHATSAPP=+5581994201799
```

---

## ✅ Passo 7: Testar

### 7.1 Teste a API
```bash
cd server
npm run test:whatsapp
```

### 7.2 Reinicie o servidor
```bash
npm run dev
```

### 7.3 Faça um agendamento de teste
1. Acesse o sistema
2. Agende um serviço
3. Verifique se recebeu a mensagem no WhatsApp!

---

## 🛠️ Comandos Úteis do Docker

### Ver se está rodando:
```bash
docker ps
```

### Parar a Evolution API:
```bash
docker stop evolution_api
```

### Iniciar novamente:
```bash
docker start evolution_api
```

### Ver logs:
```bash
docker logs evolution_api
```

### Remover (se precisar):
```bash
docker stop evolution_api
docker rm evolution_api
```

---

## 🆘 Problemas e Soluções

### ❌ "Docker não encontrado"
**Solução:** Instale o Docker Desktop primeiro (Passo 1)

### ❌ "Port 8080 already in use"
**Solução:** Altere a porta no comando:
```bash
docker run -d --name evolution_api -p 8081:8080 -e AUTHENTICATION_API_KEY=minha_senha atendai/evolution-api:latest
```
E use `http://localhost:8081` no `.env`

### ❌ "Cannot connect to Docker"
**Solução:** 
- Abra o Docker Desktop
- Aguarde ele iniciar completamente
- Tente novamente

### ❌ QR Code não aparece
**Solução:**
- Verifique se a instância foi criada
- Acesse: `http://localhost:8080/instance/connect/flowgest`
- Tente criar a instância novamente

---

## 📝 Checklist

- [ ] Docker instalado
- [ ] Evolution API rodando (http://localhost:8080 funciona)
- [ ] Instância criada
- [ ] WhatsApp conectado (QR Code escaneado)
- [ ] `.env` configurado
- [ ] Teste executado (`npm run test:whatsapp`)
- [ ] Servidor reiniciado
- [ ] Agendamento de teste feito
- [ ] Mensagem recebida no WhatsApp ✅

---

## 🎉 Pronto!

Agora você tem a Evolution API rodando localmente e configurada no FlowGest!

**Lembre-se:**
- A Evolution API precisa estar rodando sempre que você usar o sistema
- Para iniciar: `docker start evolution_api`
- Para parar: `docker stop evolution_api`

---

## 💡 Dica

Se você fechar o terminal, a Evolution API continua rodando em segundo plano. Para verificar, use:
```bash
docker ps
```

Se aparecer `evolution_api`, está rodando! ✅

