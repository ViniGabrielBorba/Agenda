// Script para verificar se a instância existe e seu status
// Execute: node verificar-instancia.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function verificarInstancia() {
  console.log('🔍 Verificando instância...\n');
  console.log('📋 Configuração:');
  console.log(`   URL: ${API_URL}`);
  console.log(`   Instance: ${INSTANCE_NAME}`);
  console.log(`   API Key: ${API_KEY.substring(0, 10)}...\n`);
  
  try {
    // 1. Listar todas as instâncias
    console.log('1️⃣ Listando todas as instâncias...');
    const listResponse = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    console.log('✅ Instâncias encontradas:', listResponse.data.length);
    if (listResponse.data.length > 0) {
      listResponse.data.forEach((inst, index) => {
        console.log(`   ${index + 1}. ${inst.instanceName} - ${inst.state || 'N/A'}`);
      });
    }
    
    const instanciaExiste = listResponse.data.some(inst => inst.instanceName === INSTANCE_NAME);
    
    if (!instanciaExiste) {
      console.log(`\n❌ Instância "${INSTANCE_NAME}" NÃO encontrada!`);
      console.log('\n💡 SOLUÇÃO: Crie a instância primeiro:');
      console.log('   👉 Execute: node criar-instancia-evolution.js\n');
      return;
    }
    
    console.log(`\n✅ Instância "${INSTANCE_NAME}" encontrada!`);
    
    // 2. Verificar status da conexão
    console.log('\n2️⃣ Verificando status da conexão...');
    const statusResponse = await axios.get(
      `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    console.log('📊 Status:', statusResponse.data.state);
    
    if (statusResponse.data.state === 'open') {
      console.log('✅ WhatsApp já está conectado!\n');
    } else {
      console.log('⚠️  WhatsApp não está conectado.');
      console.log('   Precisa gerar QR Code para conectar.\n');
    }
    
    // 3. Verificar informações da instância
    console.log('3️⃣ Informações da instância:');
    console.log(JSON.stringify(statusResponse.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ Erro ao verificar instância:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 A Evolution API não está rodando!');
      console.error('   Execute: docker-compose -f docker-compose-evolution.yml up -d\n');
    }
  }
}

verificarInstancia();

