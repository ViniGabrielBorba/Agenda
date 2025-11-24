# 🔧 Solução: QR Code Não Aparece no Manager

## ❌ Problema

Você clica em "Get QR Code" no Evolution Manager, mas nada aparece.

---

## ✅ Soluções (Tente nesta ordem):

### Solução 1: Reiniciar a Instância

1. **No Evolution Manager:**
   - Clique no botão verde **"RESTART"** (ao lado de "Get QR Code")
   - Aguarde 5-10 segundos
   - Clique em **"Get QR Code"** novamente

2. **Ou via API:**
   ```bash
   cd server
   node obter-qrcode-direto.js
   ```

---

### Solução 2: Recriar a Instância

1. **No Evolution Manager:**
   - Clique no botão vermelho **"DELETE"** (para deletar a instância atual)
   - Confirme a exclusão
   - Clique no botão verde **"Instance +"** (no topo)
   - Crie uma nova instância:
     - Nome: `flowgest`
     - Integration: `WHATSAPP-BAILEYS`
     - Marque "QR Code"
   - Clique em "Create"
   - Depois clique em "Get QR Code"

---

### Solução 3: Usar o Endpoint Direto

1. **Abra uma nova aba no navegador**
2. **Acesse:**
   ```
   http://localhost:8080/instance/connect/flowgest?apikey=FlowGest2024SecretKey!
   ```
3. **O QR Code deve aparecer diretamente na página**

---

### Solução 4: Verificar Logs do Docker

```bash
docker logs evolution_api --tail 50
```

Procure por erros relacionados a QR Code ou conexão.

---

### Solução 5: Reiniciar Tudo

```bash
cd server
docker-compose -f docker-compose-evolution.yml restart
```

Aguarde 30 segundos e tente novamente.

---

## 🔍 Verificar se Está Funcionando

Após obter o QR Code e escanear:

```bash
cd server
node obter-qrcode-direto.js
```

Ou verifique no Manager se o status mudou de "Disconnected" para "Connected".

---

## 💡 Dica

Se nada funcionar, tente criar uma nova instância com outro nome (ex: "flowgest2") e depois atualize o `.env`:

```env
WHATSAPP_INSTANCE=flowgest2
```

---

**A solução mais comum é reiniciar a instância (Solução 1)!** 🔄

