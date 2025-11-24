# 🔧 Métodos Alternativos para Obter QR Code

Como o Manager não está mostrando o QR Code, aqui estão **3 métodos alternativos**:

---

## 📋 Método 1: Verificar Instância

**Execute:**
```bash
node verificar-instancia.js
```

**O que faz:**
- Verifica se a instância existe
- Mostra o status da conexão
- Lista todas as instâncias disponíveis

**Use este primeiro** para diagnosticar o problema!

---

## 🔄 Método 2: Tentar 6 Formas Diferentes

**Execute:**
```bash
node obter-qrcode-alternativo.js
```

**O que faz:**
- Tenta 6 métodos diferentes para obter QR Code:
  1. GET com header `apikey`
  2. POST com `qrcode: true`
  3. GET com `Authorization: Bearer`
  4. Listar instâncias e depois conectar
  5. Reiniciar e depois conectar
  6. Mostrar URL direta para abrir no navegador

**Se algum método funcionar**, o QR Code será salvo em `qrcode.png`!

---

## 🆕 Método 3: Recriar Instância do Zero

**Execute:**
```bash
node recriar-instancia-completa.js
```

**O que faz:**
- **Deleta** a instância atual
- **Aguarda** 2 segundos
- **Cria** uma nova instância
- **Tenta obter** o QR Code automaticamente

**Use este se** a instância estiver corrompida ou com problemas!

---

## 🌐 Método 4: URL Direta no Navegador

**Abra esta URL no navegador:**
```
http://localhost:8080/instance/connect/flowgest?apikey=FlowGest2024SecretKey!
```

**O que faz:**
- Acessa diretamente o endpoint de conexão
- Pode mostrar o QR Code diretamente na página
- Ou retornar JSON com o QR Code em base64

---

## 📱 Método 5: Usar cURL (Terminal)

**Execute no PowerShell:**
```powershell
$headers = @{'apikey'='FlowGest2024SecretKey!'}
Invoke-RestMethod -Uri "http://localhost:8080/instance/connect/flowgest" -Method Get -Headers $headers
```

**Ou no CMD:**
```cmd
curl -H "apikey: FlowGest2024SecretKey!" http://localhost:8080/instance/connect/flowgest
```

---

## 🎯 Ordem Recomendada

1. ✅ **Primeiro:** `node verificar-instancia.js` (diagnóstico)
2. ✅ **Segundo:** `node obter-qrcode-alternativo.js` (tenta tudo)
3. ✅ **Terceiro:** `node recriar-instancia-completa.js` (recria do zero)
4. ✅ **Quarto:** Abrir URL direta no navegador
5. ✅ **Quinto:** Usar cURL

---

## 💡 Dica

Se **nenhum método funcionar**, pode ser que:
- A Evolution API precisa ser reiniciada
- O Docker precisa ser reiniciado
- Há um problema com a instância

**Nesse caso:**
```bash
docker-compose -f docker-compose-evolution.yml restart
```

E depois tente novamente!

---

**Boa sorte!** 🚀

