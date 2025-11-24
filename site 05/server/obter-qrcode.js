// Script para obter QR Code da Evolution API
// Execute: node obter-qrcode.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function obterQRCode() {
  console.log('📱 Obtendo QR Code da Evolution API...\n');

  const apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
  const apiKey = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
  const instanceName = process.env.WHATSAPP_INSTANCE || 'flowgest';

  console.log('📋 Configuração:');
  console.log(`   URL: ${apiUrl}`);
  console.log(`   Instance: ${instanceName}`);
  console.log(`   API Key: ${apiKey.substring(0, 10)}...\n`);

  try {
    // Tentar obter o QR Code
    console.log('1️⃣ Tentando obter QR Code...');
    
    const response = await axios.get(
      `${apiUrl}/instance/connect/${instanceName}`,
      {
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ QR Code obtido com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));

    // Se tiver base64, salvar como imagem
    if (response.data.qrcode && response.data.qrcode.base64) {
      const base64Data = response.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(__dirname, 'qrcode.png');
      
      fs.writeFileSync(filePath, buffer);
      console.log(`\n✅ QR Code salvo em: ${filePath}`);
      console.log('   Abra este arquivo para ver o QR Code!\n');
    }

    // Verificar status
    console.log('2️⃣ Verificando status da conexão...');
    const statusResponse = await axios.get(
      `${apiUrl}/instance/connectionState/${instanceName}`,
      {
        headers: {
          'apikey': apiKey
        },
        timeout: 5000
      }
    );

    console.log('📊 Status:', statusResponse.data.state);
    
    if (statusResponse.data.state === 'open') {
      console.log('✅ WhatsApp já está conectado!\n');
    } else {
      console.log('⚠️  WhatsApp não está conectado.');
      console.log('\n📱 Próximos passos:');
      console.log('   1. Abra o WhatsApp no celular');
      console.log('   2. Vá em: Configurações → Aparelhos conectados');
      console.log('   3. Toque em "Conectar um aparelho"');
      console.log('   4. Escaneie o QR Code');
      console.log('\n   Ou acesse: http://localhost:8080/manager');
      console.log('   Login com API Key: FlowGest2024SecretKey!\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao obter QR Code:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Solução:');
        console.error('   A Evolution API requer autenticação.');
        console.error('   Tente uma das opções abaixo:\n');
        console.error('   OPÇÃO 1: Use o Manager');
        console.error('   👉 Acesse: http://localhost:8080/manager');
        console.error('   👉 Login com API Key: FlowGest2024SecretKey!\n');
        console.error('   OPÇÃO 2: Use a página HTML');
        console.error('   👉 Abra: server/conectar-whatsapp.html\n');
        console.error('   OPÇÃO 3: Acesse via URL com API Key');
        console.error(`   👉 ${apiUrl}/instance/connect/${instanceName}?apikey=${apiKey}\n`);
      }
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

obterQRCode();

