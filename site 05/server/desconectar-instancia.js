// Script para desconectar a instância via API
// Execute: node desconectar-instancia.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function desconectarInstancia() {
  console.log('🔌 Desconectando instância via API...\n');
  
  try {
    // Verificar status atual
    console.log('1️⃣ Verificando status atual...');
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
    console.log('   Dados:', JSON.stringify(statusResponse.data, null, 2));
    
    // Tentar desconectar
    console.log('\n2️⃣ Tentando desconectar...');
    
    try {
      const logoutResponse = await axios.delete(
        `${API_URL}/instance/logout/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      console.log('✅ Desconectado com sucesso!');
      console.log('   Resposta:', JSON.stringify(logoutResponse.data, null, 2));
      
      // Aguardar um pouco
      console.log('\n⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar status novamente
      console.log('\n3️⃣ Verificando status após desconexão...');
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
      
      console.log('\n✅ Instância desconectada!');
      console.log('   Agora você pode tentar gerar o QR Code novamente.\n');
      
    } catch (logoutError) {
      console.log('⚠️  Erro ao desconectar:', logoutError.response?.status || logoutError.message);
      
      if (logoutError.response?.status === 404) {
        console.log('\n💡 A instância pode não estar conectada.');
        console.log('   Tente reiniciar diretamente:\n');
        console.log('   node reiniciar-instancia.js\n');
      } else {
        console.log('   Dados do erro:', JSON.stringify(logoutError.response?.data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

desconectarInstancia();

