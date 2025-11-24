# 🔧 Configuração de Proxy - Evolution API

## ❓ Preciso Configurar Proxy?

### ✅ **NÃO** - Para Uso Local/Teste

Se você está usando o Evolution API **localmente** (no seu computador), **NÃO precisa configurar proxy**.

**Deixe assim:**
- ✅ **Enabled**: **OFF** (desligado) ← **Mantenha assim!**
- ✅ **Protocol**: Pode deixar "http" ou vazio
- ✅ **Host**: **Vazio**
- ✅ **Port**: **Vazio**
- ✅ **Username**: **Vazio** (não coloque URL aqui!)
- ✅ **Password**: **Vazio**

---

## ⚠️ Atenção

**NÃO coloque `http://localhost:8080` no campo "Username"!**

Esse campo é para **usuário de autenticação do proxy**, não para URL da API.

Se você colocou algo lá, **limpe o campo** e deixe vazio.

---

## 📋 Quando Precisaria de Proxy?

Você só precisaria configurar proxy se:

1. **Está atrás de um firewall corporativo**
2. **Precisa passar por um servidor proxy**
3. **Está em um ambiente de produção com proxy obrigatório**

Para uso local/teste, **proxy não é necessário**.

---

## ✅ Próximo Passo

1. **Limpe os campos** (deixe tudo vazio)
2. **Mantenha "Enabled" OFF**
3. **Clique em "Save"** (se necessário)
4. **Volte para a tela principal** e continue configurando o WhatsApp

---

**Resumo:** Para uso local, **proxy = desabilitado e campos vazios**! ✅

