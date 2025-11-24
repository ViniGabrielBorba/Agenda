// Script de diagnóstico completo
// Execute: node diagnostico-completo.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO WHATSAPP\n');
  console.log('='.repeat(50));
  
  try {
    // 1. Verificar se a API está rodando
    console.log('\n1️⃣ Verificando se a API está rodando...');
    try {
      const healthCheck = await axios.get(API_URL, { timeout: 5000 });
      console.log('✅ API está rodando');
      console.log('   Versão:', healthCheck.data.version || 'N/A');
    } catch (error) {
      console.log('❌ API não está rodando!');
      console.log('   Erro:', error.message);
      return;
    }
    
    // 2. Verificar instância
    console.log('\n2️⃣ Verificando instância...');
    const instancesResponse = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: { 'apikey': API_KEY },
        timeout: 5000
      }
    );
    
    const instances = instancesResponse.data || [];
    const instancia = instances.find(inst => 
      (inst.name === INSTANCE_NAME) || (inst.instanceName === INSTANCE_NAME)
    );
    
    if (!instancia) {
      console.log('❌ Instância não encontrada!');
      return;
    }
    
    console.log('✅ Instância encontrada:', instancia.name || instancia.instanceName);
    console.log('   ID:', instancia.id || instancia.instanceId);
    console.log('   Token:', instancia.token);
    console.log('   Status:', instancia.connectionStatus || instancia.state);
    console.log('   Integration:', instancia.integration);
    console.log('   Número:', instancia.number || 'Não informado');
    console.log('   Owner JID:', instancia.ownerJid || 'Não informado');
    
    // 3. Verificar status de conexão detalhado
    console.log('\n3️⃣ Verificando status de conexão detalhado...');
    try {
      const statusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
        {
          headers: { 'apikey': API_KEY },
          timeout: 5000
        }
      );
      
      const status = statusResponse.data.state || statusResponse.data.instance?.state;
      console.log('   Status:', status);
      
      if (status === 'open') {
        console.log('   ✅ Instância está CONECTADA');
      } else if (status === 'close') {
        console.log('   ❌ Instância está DESCONECTADA');
        console.log('   💡 Você precisa escanear o QR Code!');
      } else {
        console.log('   ⚠️  Status desconhecido:', status);
      }
      
      console.log('   Dados completos:', JSON.stringify(statusResponse.data, null, 2));
    } catch (error) {
      console.log('   ⚠️  Erro ao verificar status:', error.response?.status || error.message);
    }
    
    // 4. Tentar obter QR Code (se não estiver conectado)
    const status = instancia.connectionStatus || instancia.state;
    if (status !== 'open') {
      console.log('\n4️⃣ Tentando obter QR Code...');
      try {
        const qrResponse = await axios.get(
          `${API_URL}/instance/connect/${INSTANCE_NAME}`,
          {
            headers: { 'apikey': API_KEY },
            timeout: 10000
          }
        );
        
        if (qrResponse.data.qrcode && qrResponse.data.qrcode.base64) {
          const fs = require('fs');
          const path = require('path');
          const base64Data = qrResponse.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(__dirname, 'qrcode.png');
          fs.writeFileSync(filePath, buffer);
          console.log('   ✅ QR Code gerado!');
          console.log(`   Salvo em: ${filePath}`);
        } else {
          console.log('   ⚠️  QR Code não disponível (count:', qrResponse.data.count || 0, ')');
        }
      } catch (error) {
        console.log('   ⚠️  Erro ao obter QR Code:', error.response?.status || error.message);
      }
    }
    
    // 5. Testar envio de mensagem
    console.log('\n5️⃣ Testando envio de mensagem...');
    if (status === 'open') {
      const numeroTeste = '5581996687669';
      try {
        const response = await axios.post(
          `${API_URL}/message/sendText/${INSTANCE_NAME}`,
          {
            number: numeroTeste,
            text: '🧪 Teste de diagnóstico - ' + new Date().toLocaleString('pt-BR')
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': API_KEY
            },
            timeout: 15000
          }
        );
        
        console.log('   ✅ Mensagem enviada (API retornou sucesso)');
        console.log('   ID:', response.data.key?.id);
        console.log('   Remote JID:', response.data.key?.remoteJid);
        
        console.log('\n   ⚠️  Se a mensagem não chegou, pode ser:');
        console.log('   1. WhatsApp bloqueando mensagens');
        console.log('   2. Número incorreto');
        console.log('   3. Instância não está realmente conectada');
        console.log('   4. Problema de sincronização');
        
      } catch (error) {
        console.log('   ❌ Erro ao enviar mensagem:', error.response?.status || error.message);
        if (error.response?.data) {
          console.log('   Detalhes:', JSON.stringify(error.response.data, null, 2));
        }
      }
    } else {
      console.log('   ⚠️  Instância não está conectada, não é possível enviar mensagem');
    }
    
    // 6. Resumo e recomendações
    console.log('\n' + '='.repeat(50));
    console.log('\n📋 RESUMO E RECOMENDAÇÕES:\n');
    
    if (status !== 'open') {
      console.log('❌ PROBLEMA: Instância não está conectada!');
      console.log('\n💡 SOLUÇÃO:');
      console.log('   1. Acesse: http://localhost:8080/manager');
      console.log('   2. Login: FlowGest2024SecretKey!');
      console.log('   3. Na instância FlowGest:');
      console.log('      - Clique em "Get QR Code"');
      console.log('      - Escaneie com seu WhatsApp');
      console.log('   4. Aguarde status mudar para "Conectado"\n');
    } else {
      console.log('✅ Instância está conectada');
      console.log('\n⚠️  Se mensagens não estão chegando:');
      console.log('   1. Verifique se o WhatsApp está realmente conectado');
      console.log('   2. Tente desconectar e reconectar no Manager');
      console.log('   3. Verifique se o número está correto');
      console.log('   4. Teste enviando para você mesmo primeiro\n');
    }
    
  } catch (error) {
    console.error('\n❌ Erro no diagnóstico:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

diagnosticoCompleto();

