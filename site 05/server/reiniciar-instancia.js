// Script para reiniciar a instância via API
// Execute: node reiniciar-instancia.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function reiniciarInstancia() {
  console.log('🔄 Reiniciando instância via API...\n');
  
  try {
    // Verificar status atual
    console.log('1️⃣ Verificando status atual...');
    try {
      const statusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          timeout: 5000
        }
      );
      
      console.log('   Status atual:', statusResponse.data.state || statusResponse.data.instance?.state);
    } catch (error) {
      console.log('   ⚠️  Não foi possível verificar status (pode ser normal)');
    }
    
    // Tentar reiniciar
    console.log('\n2️⃣ Tentando reiniciar...');
    
    const restartResponse = await axios.put(
      `${API_URL}/instance/restart/${INSTANCE_NAME}`,
      {},
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    console.log('✅ Reiniciado com sucesso!');
    console.log('   Resposta:', JSON.stringify(restartResponse.data, null, 2));
    
    console.log('\n⏳ Aguardando 10 segundos para a instância inicializar...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Verificar status após reiniciar
    console.log('\n3️⃣ Verificando status após reiniciar...');
    try {
      const newStatusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          timeout: 5000
        }
      );
      
      console.log('   Novo status:', newStatusResponse.data.state || newStatusResponse.data.instance?.state);
    } catch (error) {
      console.log('   ⚠️  Status ainda não disponível (pode levar mais tempo)');
    }
    
    console.log('\n✅ Instância reiniciada!');
    console.log('   Agora tente gerar o QR Code no Manager:\n');
    console.log('   1. Acesse: http://localhost:8080/manager');
    console.log('   2. Login: FlowGest2024SecretKey!');
    console.log('   3. Clique em "Get QR Code" na instância FlowGest\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao reiniciar:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n💡 A instância pode não existir ou ter outro nome.');
        console.error('   Verifique o nome da instância no Manager.\n');
      }
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

reiniciarInstancia();

