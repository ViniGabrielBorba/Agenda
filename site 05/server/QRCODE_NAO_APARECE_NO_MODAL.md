# 🔧 QR Code Não Aparece no Modal do Manager

## ❌ Problema

Você clicou em "Gerar QR Code" no Evolution Manager, o modal apareceu com a mensagem "Digitalize o código QR com o seu WhatsApp Web", mas **o QR Code não está visível**.

---

## ✅ Soluções (Tente nesta ordem)

### Solução 1: Fechar e Tentar Novamente

1. **Feche o modal** (clique no X no canto superior direito)
2. **Clique no botão verde "RESTART"** (não "Gerar QR Code" ainda)
3. **Aguarde 20-30 segundos** (importante!)
4. **Clique em "Gerar QR Code"** novamente
5. O QR Code deve aparecer agora

---

### Solução 2: Recarregar a Página

1. **Recarregue a página do Manager** (F5)
2. **Faça login novamente** com: `FlowGest2024SecretKey!`
3. **Clique em "RESTART"**
4. **Aguarde 20 segundos**
5. **Clique em "Gerar QR Code"**

---

### Solução 3: Recriar a Instância

Se nada funcionar:

1. **Delete a instância "flowgest"**
   - Clique no botão vermelho "DELETE"
   - Confirme

2. **Crie uma nova instância:**
   - Clique em "Instance +" (botão verde no topo)
   - Nome: `flowgest`
   - Integration: `WHATSAPP-BAILEYS`
   - Marque "QR Code" ou "qrcode"
   - Clique em "Create"

3. **Depois clique em "Gerar QR Code"**

---

### Solução 4: Verificar Logs

Se ainda não funcionar, verifique os logs:

```bash
docker logs evolution_api --tail 50
```

Procure por erros relacionados a QR Code ou conexão.

---

## 💡 Por Que Isso Acontece?

O QR Code pode não aparecer porque:
- A instância ainda está inicializando
- O QR Code expirou (eles expiram rápido)
- A instância precisa ser reiniciada primeiro
- Há um problema temporário com a conexão

---

## ✅ Solução Mais Comum

**RESTART → Aguardar 20 segundos → Gerar QR Code**

Isso resolve 90% dos casos! 🔄

---

**Dica:** Sempre faça RESTART antes de gerar o QR Code pela primeira vez!

