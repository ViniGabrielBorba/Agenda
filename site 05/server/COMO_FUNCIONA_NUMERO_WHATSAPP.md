# 📱 Como Funciona o Número de WhatsApp na Evolution API

## ❓ Preciso Colocar Meu Número?

### ✅ **NÃO** - Para Conectar via QR Code

Se você está usando **WhatsApp Baileys** (que é o que configuramos), **NÃO precisa preencher o número**!

**Como funciona:**
1. Você cria a instância **sem número**
2. Gera o **QR Code**
3. Escaneia o QR Code com seu WhatsApp no celular
4. O WhatsApp **automaticamente associa** o número do celular à instância

---

## 🔧 Quando Preencher o Número?

Você só precisa preencher o número se:

1. **Está usando WhatsApp Business API oficial** (não é o nosso caso)
2. **Já tem um número de WhatsApp Business verificado**
3. **Quer usar integração com Meta/Facebook**

**Para uso local/teste com WhatsApp Baileys:**
- ✅ **Deixe o campo "Número" VAZIO**
- ✅ Use apenas o **QR Code** para conectar

---

## ⚠️ O Que Acontece Se Colocar o Número?

Se você preencher o campo "Número" no Manager:

1. **Pode causar conflito** - A instância pode tentar usar esse número em vez do QR Code
2. **Pode não funcionar** - O número precisa estar verificado e configurado corretamente
3. **Não é necessário** - O QR Code já associa automaticamente o número do seu celular

---

## ✅ Configuração Correta

**Para conectar seu WhatsApp:**

| Campo | Valor |
|-------|-------|
| **Nome** | `flowgest` |
| **Canal** | `WHATSAPP-BAILEYS` |
| **Token** | Deixe vazio |
| **Número** | **DEIXE VAZIO** ✅ |
| **Business ID** | Deixe vazio |

**Depois:**
1. Salve a instância
2. Clique em "RESTART"
3. Aguarde 20-30 segundos
4. Clique em "Get QR Code"
5. Escaneie com seu WhatsApp

**O número do seu celular será associado automaticamente!** ✅

---

## 💡 Resumo

- ❌ **NÃO coloque o número** - Deixe vazio
- ✅ **Use o QR Code** - É mais simples e funciona perfeitamente
- ✅ **O número será detectado automaticamente** quando você escanear o QR Code

---

**Dica:** Se você já preencheu o número, **delete a instância e crie novamente sem o número**! 🚀

