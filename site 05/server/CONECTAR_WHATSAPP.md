# 📱 Como Conectar WhatsApp - Solução do Erro 401

## ❌ Problema

Ao acessar `http://localhost:8080/instance/connect/flowgest`, aparece:
```json
{"status":401,"error":"Unauthorized","response":{"message":"Unauthorized"}}
```

Isso acontece porque a Evolution API requer autenticação via API Key.

---

## ✅ Soluções

### Solução 1: Usar a Página HTML (Recomendado)

1. **Abra o arquivo:**
   ```
   server/conectar-whatsapp.html
   ```
   No navegador (duplo clique ou arraste para o navegador)

2. **A página vai:**
   - Carregar o QR Code automaticamente
   - Verificar o status da conexão
   - Atualizar automaticamente

---

### Solução 2: Usar o Manager da Evolution API

1. **Acesse:**
   ```
   http://localhost:8080/manager
   ```

2. **Faça login com:**
   - API Key: `FlowGest2024SecretKey!`

3. **Navegue até a instância "flowgest"**

4. **Clique em "Conectar" ou "QR Code"**

---

### Solução 3: Usar cURL ou PowerShell

**PowerShell:**
```powershell
$headers = @{'apikey'='FlowGest2024SecretKey!'}
Invoke-RestMethod -Uri "http://localhost:8080/instance/connect/flowgest" -Method Get -Headers $headers
```

**cURL:**
```bash
curl -X GET "http://localhost:8080/instance/connect/flowgest" -H "apikey: FlowGest2024SecretKey!"
```

---

### Solução 4: Acessar via URL com API Key

Tente acessar:
```
http://localhost:8080/instance/connect/flowgest?apikey=FlowGest2024SecretKey!
```

---

## 🔍 Verificar Status da Conexão

Após escanear o QR Code, verifique se está conectado:

**PowerShell:**
```powershell
$headers = @{'apikey'='FlowGest2024SecretKey!'}
Invoke-RestMethod -Uri "http://localhost:8080/instance/connectionState/flowgest" -Method Get -Headers $headers
```

**cURL:**
```bash
curl -X GET "http://localhost:8080/instance/connectionState/flowgest" -H "apikey: FlowGest2024SecretKey!"
```

**Resposta esperada:**
```json
{
  "state": "open"
}
```

Se `state` for `"open"`, está conectado! ✅

---

## 🧪 Testar Após Conectar

```bash
cd server
npm run test:whatsapp
```

Você deve receber uma mensagem de teste no WhatsApp!

---

## ⚠️ Nota

A Evolution API requer autenticação em todas as requisições. Use sempre o header `apikey` ou o parâmetro `?apikey=` na URL.

