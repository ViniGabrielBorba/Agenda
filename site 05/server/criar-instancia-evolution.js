// Script para criar instância na Evolution API
// Execute: node criar-instancia-evolution.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function criarInstancia() {
  console.log('🚀 Criando instância na Evolution API...\n');

  const apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
  const apiKey = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
  const instanceName = process.env.WHATSAPP_INSTANCE || 'flowgest';

  console.log('📋 Configuração:');
  console.log(`   URL: ${apiUrl}`);
  console.log(`   Instance: ${instanceName}`);
  console.log(`   API Key: ${apiKey.substring(0, 10)}...\n`);

  try {
    // Verificar se a API está rodando
    console.log('1️⃣ Verificando se a API está rodando...');
    const healthCheck = await axios.get(apiUrl, { timeout: 5000 });
    console.log('✅ API está rodando!');
    console.log('   Resposta:', JSON.stringify(healthCheck.data, null, 2));
    console.log('');

    // Verificar se a instância já existe
    console.log('2️⃣ Verificando se a instância já existe...');
    try {
      const existingInstance = await axios.get(
        `${apiUrl}/instance/fetchInstances`,
        {
          headers: { 'apikey': apiKey },
          timeout: 5000
        }
      );
      
      const instances = existingInstance.data || [];
      const found = instances.find(inst => inst.instance.instanceName === instanceName);
      
      if (found) {
        console.log(`⚠️  Instância "${instanceName}" já existe!`);
        console.log('   Status:', found.instance.status);
        console.log('\n💡 Se quiser criar uma nova, use outro nome ou delete a existente primeiro.');
        return;
      }
    } catch (error) {
      // Se der erro, continua para criar
    }

    // Criar instância
    console.log('3️⃣ Criando instância...');
    const response = await axios.post(
      `${apiUrl}/instance/create`,
      {
        instanceName: instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        },
        timeout: 10000
      }
    );

    console.log('✅ Instância criada com sucesso!');
    console.log('\n📋 Detalhes:');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n📱 Próximo passo:');
    console.log(`   Acesse: ${apiUrl}/instance/connect/${instanceName}`);
    console.log('   E escaneie o QR Code com seu WhatsApp\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar instância:');
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('   A Evolution API não está rodando!');
      console.error('   Execute: docker start evolution_api');
      console.error('   Ou verifique se está na porta 8080');
    } else if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

criarInstancia();

