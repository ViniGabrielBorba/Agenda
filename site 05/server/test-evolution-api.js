// Script para testar a conexão com Evolution API
// Execute: node test-evolution-api.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function testEvolutionAPI() {
  console.log('🧪 Testando conexão com Evolution API...\n');

  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const instance = process.env.WHATSAPP_INSTANCE || 'flowgest';

  if (!apiUrl || !apiKey) {
    console.log('❌ Erro: Configure WHATSAPP_API_URL e WHATSAPP_API_KEY no .env');
    console.log('\n📝 Exemplo:');
    console.log('WHATSAPP_API_URL=https://sua-url-evolution.com');
    console.log('WHATSAPP_API_KEY=sua_api_key');
    console.log('WHATSAPP_INSTANCE=flowgest');
    return;
  }

  console.log('📋 Configuração:');
  console.log(`   URL: ${apiUrl}`);
  console.log(`   Instance: ${instance}`);
  console.log(`   API Key: ${apiKey.substring(0, 10)}...\n`);

  try {
    // 1. Verificar status da conexão
    console.log('1️⃣ Verificando status da instância...');
    const statusResponse = await axios.get(
      `${apiUrl}/instance/connectionState/${instance}`,
      {
        headers: {
          'apikey': apiKey
        }
      }
    );

    console.log('✅ Status da instância:', JSON.stringify(statusResponse.data, null, 2));

    if (statusResponse.data.state !== 'open') {
      console.log('\n⚠️  WhatsApp não está conectado!');
      console.log('📱 Acesse:', `${apiUrl}/instance/connect/${instance}`);
      console.log('   E escaneie o QR Code com seu WhatsApp\n');
    } else {
      console.log('✅ WhatsApp está conectado!\n');
    }

    // 2. Testar envio de mensagem
    console.log('2️⃣ Testando envio de mensagem...');
    const testPhone = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
    
    const messageResponse = await axios.post(
      `${apiUrl}/message/sendText/${instance}`,
      {
        number: testPhone.replace(/\D/g, ''),
        text: '🧪 Teste do FlowGest - Se você recebeu esta mensagem, a integração está funcionando! ✅'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        }
      }
    );

    console.log('✅ Mensagem enviada com sucesso!');
    console.log('📱 Resposta:', JSON.stringify(messageResponse.data, null, 2));
    console.log('\n✅ Verifique seu WhatsApp para confirmar o recebimento!');

  } catch (error) {
    console.error('\n❌ Erro ao testar Evolution API:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n💡 Dica: A instância não foi encontrada.');
        console.error('   Crie a instância primeiro usando:');
        console.error(`   POST ${apiUrl}/instance/create`);
      } else if (error.response.status === 401) {
        console.error('\n💡 Dica: API Key inválida ou não autorizada.');
        console.error('   Verifique se a API Key está correta no .env');
      }
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

testEvolutionAPI();

