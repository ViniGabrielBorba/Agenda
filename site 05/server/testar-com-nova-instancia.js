// Script para testar com a nova instância e token
// Execute: node testar-com-nova-instancia.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_ID = 'E927C44E8B5D-4865-BA72-E80529036C41'; // Nova instância
const TOKEN = '01C8400EB672-45C4-B862-6BDA67B49C96'; // Token fornecido
const PROFESSIONAL_PHONE = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';

async function testarNovaInstancia() {
  console.log('🧪 Testando com nova instância e token...\n');
  console.log('📋 Configuração:');
  console.log(`   API URL: ${API_URL}`);
  console.log(`   API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`   Instance ID: ${INSTANCE_ID}`);
  console.log(`   Token: ${TOKEN}`);
  console.log(`   Número destino: ${PROFESSIONAL_PHONE}\n`);
  
  try {
    // 1. Listar todas as instâncias para encontrar o nome
    console.log('1️⃣ Listando instâncias para encontrar o nome...');
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
    console.log(`   Encontradas ${instances.length} instância(s)\n`);
    
    // Procurar instância pelo ID ou token
    let instanciaEncontrada = null;
    let nomeInstancia = null;
    
    for (const inst of instances) {
      if (inst.id === INSTANCE_ID || 
          inst.instanceId === INSTANCE_ID ||
          inst.token === TOKEN) {
        instanciaEncontrada = inst;
        nomeInstancia = inst.name || inst.instanceName;
        console.log('✅ Instância encontrada!');
        console.log(`   Nome: ${nomeInstancia}`);
        console.log(`   ID: ${inst.id || inst.instanceId}`);
        console.log(`   Status: ${inst.connectionStatus || inst.state}`);
        console.log(`   Token: ${inst.token}`);
        break;
      }
    }
    
    if (!instanciaEncontrada) {
      console.log('⚠️  Instância não encontrada pelos dados fornecidos.');
      console.log('   Tentando usar o ID diretamente...\n');
      nomeInstancia = INSTANCE_ID;
    }
    
    // 2. Verificar status da conexão
    console.log('\n2️⃣ Verificando status da conexão...');
    try {
      const statusResponse = await axios.get(
        `${API_URL}/instance/connectionState/${nomeInstancia}`,
        {
          headers: {
            'apikey': API_KEY
          },
          timeout: 5000
        }
      );
      
      const status = statusResponse.data.state || statusResponse.data.instance?.state;
      console.log(`   Status: ${status}`);
      
      if (status !== 'open') {
        console.log('\n⚠️  ATENÇÃO: A instância não está conectada!');
        console.log('   Você precisa escanear o QR Code primeiro.\n');
        return;
      }
    } catch (error) {
      console.log('   ⚠️  Não foi possível verificar status:', error.response?.status || error.message);
    }
    
    // 3. Tentar enviar mensagem
    console.log('\n3️⃣ Tentando enviar mensagem...');
    
    // Formatar número
    let numeroFormatado = PROFESSIONAL_PHONE.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    
    const mensagem = `🧪 Teste do FlowGest - Nova Instância

Esta é uma mensagem de teste usando a nova instância.

✅ Se você recebeu esta mensagem, está funcionando perfeitamente!

Token: ${TOKEN}
Instance ID: ${INSTANCE_ID}
Data: ${new Date().toLocaleString('pt-BR')}`;
    
    // Tentar com o nome da instância
    const response = await axios.post(
      `${API_URL}/message/sendText/${nomeInstancia}`,
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
    
    console.log('✅ Mensagem enviada com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    console.log(`\n📱 Verifique seu WhatsApp no número: ${PROFESSIONAL_PHONE}`);
    console.log('   Você deve receber a mensagem agora!\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n💡 A instância pode não existir ou ter outro nome.');
        console.error('   Verifique o nome da instância no Manager.\n');
      } else if (error.response.status === 401) {
        console.error('\n💡 Problema de autenticação.');
        console.error('   Verifique se a API Key está correta.\n');
      }
    } else {
      console.error('   Erro:', error.message);
    }
    
    console.log('\n💡 Dicas:');
    console.log('   1. Verifique se a instância está conectada no Manager');
    console.log('   2. Verifique se o nome da instância está correto');
    console.log('   3. Verifique se o número está no formato correto\n');
  }
}

testarNovaInstancia();

