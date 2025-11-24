// Script para listar todas as instâncias e mostrar o nome exato
// Execute: node listar-instancias.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';

async function listarInstancias() {
  console.log('📋 Listando todas as instâncias...\n');
  
  try {
    const response = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    const instances = response.data || [];
    
    if (instances.length === 0) {
      console.log('❌ Nenhuma instância encontrada!\n');
      return;
    }
    
    console.log(`✅ Encontradas ${instances.length} instância(s):\n`);
    
    instances.forEach((inst, index) => {
      const name = inst.name || inst.instanceName || 'N/A';
      const status = inst.connectionStatus || inst.state || 'N/A';
      const id = inst.id || inst.instanceId || 'N/A';
      
      console.log(`${index + 1}. Nome: "${name}"`);
      console.log(`   Status: ${status}`);
      console.log(`   ID: ${id}`);
      console.log(`   Integration: ${inst.integration || 'N/A'}`);
      console.log('');
    });
    
    // Mostrar o nome exato para usar no .env
    if (instances.length > 0) {
      const primeiraInstancia = instances[0];
      const nomeExato = primeiraInstancia.name || primeiraInstancia.instanceName;
      
      console.log('💡 Use este nome exato no .env:');
      console.log(`   WHATSAPP_INSTANCE=${nomeExato}\n`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar instâncias:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

listarInstancias();

