// Script para DELETAR e RECRIAR a instância do zero
// Execute: node recriar-instancia-completa.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function deletarInstancia() {
  console.log('🗑️  Deletando instância existente...\n');
  
  try {
    const response = await axios.delete(
      `${API_URL}/instance/delete/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Instância deletada com sucesso!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('ℹ️  Instância não existe (já foi deletada ou nunca existiu)');
      return true;
    }
    console.log('⚠️  Erro ao deletar:', error.response?.status, error.response?.data?.message || error.message);
    return false;
  }
}

async function criarInstancia() {
  console.log('\n🚀 Criando nova instância...\n');
  
  try {
    const response = await axios.post(
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
    
    console.log('✅ Instância criada com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    
    if (response.data.instance?.token) {
      console.log('\n🔑 Token da instância:', response.data.instance.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('\n❌ Erro ao criar instância:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
    return null;
  }
}

async function obterQRCode() {
  console.log('\n📱 Aguardando 3 segundos e tentando obter QR Code...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    const response = await axios.get(
      `${API_URL}/instance/connect/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    console.log('✅ QR Code obtido!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    
    // Salvar QR Code se tiver base64
    if (response.data.qrcode?.base64 || response.data.base64) {
      const fs = require('fs');
      const path = require('path');
      const base64Data = (response.data.qrcode?.base64 || response.data.base64).replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(__dirname, 'qrcode.png');
      fs.writeFileSync(filePath, buffer);
      console.log(`\n✅ QR Code salvo em: ${filePath}`);
      console.log('   Abra este arquivo para ver o QR Code!\n');
    }
    
    return response.data;
  } catch (error) {
    console.log('⚠️  Não foi possível obter QR Code automaticamente.');
    console.log('   Tente usar o Evolution Manager ou a URL direta.\n');
    return null;
  }
}

async function main() {
  console.log('🔄 RECRIANDO INSTÂNCIA DO ZERO\n');
  console.log('📋 Configuração:');
  console.log(`   URL: ${API_URL}`);
  console.log(`   Instance: ${INSTANCE_NAME}`);
  console.log(`   API Key: ${API_KEY.substring(0, 10)}...\n`);
  
  // 1. Deletar instância existente
  await deletarInstancia();
  
  // 2. Aguardar um pouco
  console.log('\n⏳ Aguardando 2 segundos...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 3. Criar nova instância
  const resultado = await criarInstancia();
  
  if (resultado) {
    // 4. Tentar obter QR Code
    await obterQRCode();
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('\n1️⃣  Se o QR Code não apareceu aqui, use o Evolution Manager:');
    console.log(`   👉 ${API_URL}/manager`);
    console.log(`   👉 Login: ${API_KEY}`);
    console.log(`   👉 Clique em "Get QR Code" na instância "${INSTANCE_NAME}"\n`);
    
    console.log('2️⃣  Ou acesse a URL direta:');
    console.log(`   👉 ${API_URL}/instance/connect/${INSTANCE_NAME}?apikey=${API_KEY}\n`);
    
    console.log('3️⃣  Ou use a página HTML:');
    console.log(`   👉 Abra: server/conectar-whatsapp.html\n`);
  } else {
    console.log('\n❌ Não foi possível criar a instância.');
    console.log('   Verifique se a Evolution API está rodando.\n');
  }
}

main().catch(console.error);

