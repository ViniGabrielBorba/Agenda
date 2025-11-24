# 🔧 Atualizar Nome da Instância no .env

## ⚠️ Problema Identificado

O nome da instância no `.env` está como `flowgest` (minúsculas), mas o nome real é **`FlowGest`** (com maiúsculas).

A Evolution API é **case-sensitive** (diferencia maiúsculas de minúsculas)!

---

## ✅ Solução

### Atualize o arquivo `server/.env`:

**Mude esta linha:**
```env
WHATSAPP_INSTANCE=flowgest
```

**Para:**
```env
WHATSAPP_INSTANCE=FlowGest
```

---

## 📋 Configuração Completa do .env

Certifique-se de que seu `.env` está assim:

```env
# WhatsApp Configuration - Evolution API
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=FlowGest2024SecretKey!
WHATSAPP_INSTANCE=FlowGest
PROFESSIONAL_WHATSAPP=+5581994201799
```

**Importante:** `FlowGest` com **F** e **G** maiúsculos!

---

## ✅ Depois de Atualizar

1. **Reinicie o servidor** (se estiver rodando):
   ```bash
   # Pare o servidor (Ctrl+C)
   # E inicie novamente:
   npm run dev
   ```

2. **Teste novamente:**
   ```bash
   node testar-whatsapp.js
   ```

---

## 🎉 Resultado

✅ **Mensagem de teste enviada com sucesso!**  
✅ **WhatsApp está funcionando perfeitamente!**  
✅ **Agora o sistema pode enviar mensagens quando houver agendamentos!**

---

**Lembre-se:** Sempre use `FlowGest` (com maiúsculas) no `.env`! 🚀

