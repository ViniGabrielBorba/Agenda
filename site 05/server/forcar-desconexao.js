// Script para FORÇAR desconexão da instância
// Execute: node forcar-desconexao.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function forcarDesconexao() {
  console.log('🔌 FORÇANDO DESCONEXÃO DA INSTÂNCIA\n');
  console.log('='.repeat(50));
  
  try {
    // 1. Verificar status atual
    console.log('\n1️⃣ Verificando status atual...');
    try {
      const statusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
        {
          headers: { 'apikey': API_KEY },
          timeout: 5000
        }
      );
      console.log('   Status:', statusResponse.data.state || statusResponse.data.instance?.state);
    } catch (error) {
      console.log('   ⚠️  Não foi possível verificar status');
    }
    
    // 2. Tentar múltiplos métodos de desconexão
    console.log('\n2️⃣ Tentando desconectar...');
    
    // Método 1: DELETE /instance/logout
    console.log('   Método 1: DELETE /instance/logout');
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
      console.log('   ✅ Desconectado via logout!');
      console.log('   Resposta:', JSON.stringify(logoutResponse.data, null, 2));
    } catch (error) {
      console.log('   ⚠️  Logout não funcionou:', error.response?.status || error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Método 2: DELETE /instance/delete (e recriar depois)
    console.log('\n3️⃣ Tentando deletar e recriar instância...');
    try {
      // Deletar
      const deleteResponse = await axios.delete(
        `${API_URL}/instance/delete/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      console.log('   ✅ Instância deletada!');
      console.log('   Resposta:', JSON.stringify(deleteResponse.data, null, 2));
      
      // Aguardar
      console.log('\n   ⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Recriar
      console.log('   🔄 Recriando instância...');
      const createResponse = await axios.post(
        `${API_URL}/instance/create`,
        {
          instanceName: INSTANCE_NAME,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': API_KEY
          },
          timeout: 15000
        }
      );
      
      console.log('   ✅ Instância recriada!');
      console.log('   ID:', createResponse.data.instance?.instanceId);
      console.log('   Status:', createResponse.data.instance?.status);
      
      console.log('\n   📱 Agora você pode obter o QR Code!');
      console.log('   👉 Acesse: http://localhost:8080/manager');
      console.log('   👉 Login: FlowGest2024SecretKey!');
      console.log('   👉 Clique em "Get QR Code" na instância FlowGest\n');
      
    } catch (error) {
      console.log('   ⚠️  Erro ao deletar/recriar:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('   Detalhes:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // 3. Verificar status final
    console.log('\n4️⃣ Verificando status final...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const finalStatusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
        {
          headers: { 'apikey': API_KEY },
          timeout: 5000
        }
      );
      const finalStatus = finalStatusResponse.data.state || finalStatusResponse.data.instance?.state;
      console.log('   Status final:', finalStatus);
      
      if (finalStatus === 'close' || finalStatus === 'connecting') {
        console.log('   ✅ Instância está desconectada ou conectando');
        console.log('   💡 Agora você pode escanear o QR Code!\n');
      }
    } catch (error) {
      console.log('   ⚠️  Não foi possível verificar status final');
    }
    
    console.log('='.repeat(50));
    console.log('\n✅ Processo concluído!\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

forcarDesconexao();

