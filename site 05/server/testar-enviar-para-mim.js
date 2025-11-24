// Script para testar enviar mensagem para o próprio número conectado
// Execute: node testar-enviar-para-mim.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function testarEnviarParaMim() {
  console.log('📱 Testando envio de mensagem para você mesmo...\n');
  
  try {
    // 1. Verificar qual número está conectado
    console.log('1️⃣ Verificando número conectado...');
    const instancesResponse = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: {
          'apikey': API_KEY
        },
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
    console.log('   Status:', instancia.connectionStatus || instancia.state);
    
    // 2. Tentar descobrir o número
    let numeroParaEnviar = null;
    
    // Opção 1: Owner JID
    if (instancia.ownerJid) {
      numeroParaEnviar = instancia.ownerJid.split('@')[0];
      console.log('   Número do JID:', numeroParaEnviar);
    }
    
    // Opção 2: Número configurado
    if (instancia.number) {
      numeroParaEnviar = instancia.number.replace(/\D/g, '');
      console.log('   Número configurado:', numeroParaEnviar);
    }
    
    // Opção 3: Usar o número do .env
    if (!numeroParaEnviar) {
      const envNumber = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
      numeroParaEnviar = envNumber.replace(/\D/g, '');
      console.log('   Usando número do .env:', numeroParaEnviar);
    }
    
    // 3. Tentar enviar mensagem para você mesmo (número conectado)
    console.log('\n2️⃣ Tentando enviar mensagem...');
    console.log('   Para:', numeroParaEnviar);
    
    // Formatar número (remover código do país se já tiver)
    let numeroFormatado = numeroParaEnviar.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    
    const mensagem = `🧪 Teste do FlowGest

Esta mensagem está sendo enviada para o número conectado à instância.

✅ Se você recebeu esta mensagem, o WhatsApp está funcionando!

Número de destino: ${numeroFormatado}
Data: ${new Date().toLocaleString('pt-BR')}`;
    
    const response = await axios.post(
      `${API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        number: numeroFormatado,
        text: mensagem
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        },
        timeout: 15000
      }
    );
    
    console.log('\n✅ Mensagem enviada com sucesso!');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    console.log(`\n📱 Verifique seu WhatsApp no número: ${numeroFormatado}`);
    console.log('   (Este é o número que está conectado à instância)\n');
    
    // 4. Tentar também enviar para o número do .env (caso seja diferente)
    const envNumber = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
    const envNumberFormatted = envNumber.replace(/\D/g, '');
    
    if (envNumberFormatted !== numeroFormatado) {
      console.log('⚠️  ATENÇÃO:');
      console.log(`   Número conectado: ${numeroFormatado}`);
      console.log(`   Número no .env: ${envNumberFormatted}`);
      console.log('   Eles são diferentes!');
      console.log('\n💡 Solução:');
      console.log(`   Atualize o .env com: PROFESSIONAL_WHATSAPP=+${numeroFormatado}\n`);
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
    
    console.log('\n💡 Possíveis problemas:');
    console.log('   1. O número pode estar errado');
    console.log('   2. A instância pode não estar totalmente conectada');
    console.log('   3. O número pode não estar no formato correto');
    console.log('\n💡 Solução:');
    console.log('   Verifique qual número você usou para escanear o QR Code');
    console.log('   E atualize o .env com esse número exato!\n');
  }
}

testarEnviarParaMim();

