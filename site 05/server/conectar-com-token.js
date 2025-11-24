// Script para conectar usando o token da instância
// Execute: node conectar-com-token.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const INSTANCE_TOKEN = 'B1756316-2A6C-4E59-B4A9-E11651BC8C9E';
const apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const apiKey = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const instanceName = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function conectarComToken() {
  console.log('📱 Conectando WhatsApp usando o token da instância...\n');
  console.log('📋 Token:', INSTANCE_TOKEN);
  console.log('📋 Instância:', instanceName);
  console.log('📋 API URL:', apiUrl);
  console.log('📋 API Key:', apiKey.substring(0, 10) + '...\n');

  try {
    // Tentar obter QR Code usando o token
    console.log('1️⃣ Tentando obter QR Code com o token...\n');
    
    // Método 1: Usar o endpoint de conexão
    try {
      const response = await axios.get(
        `${apiUrl}/instance/connect/${instanceName}`,
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json'
          },
          params: {
            apikey: apiKey,
            token: INSTANCE_TOKEN
          },
          timeout: 10000
        }
      );

      console.log('✅ Resposta recebida!');
      console.log('📋 Dados:', JSON.stringify(response.data, null, 2));

      // Verificar se tem QR Code
      if (response.data.qrcode && response.data.qrcode.base64) {
        salvarQRCode(response.data.qrcode.base64);
      } else if (response.data.base64) {
        salvarQRCode(response.data.base64);
      } else {
        console.log('\n⚠️  QR Code não encontrado na resposta.');
        console.log('🔄 Tentando método alternativo...\n');
        tentarMetodoAlternativo();
      }
    } catch (error) {
      console.log('⚠️  Método 1 falhou, tentando método alternativo...\n');
      tentarMetodoAlternativo();
    }

    // Verificar status
    verificarStatus();

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function tentarMetodoAlternativo() {
  try {
    // Método 2: Usar o endpoint de QR Code diretamente
    console.log('2️⃣ Tentando obter QR Code via endpoint alternativo...\n');
    
    const response = await axios.post(
      `${apiUrl}/instance/connect/${instanceName}`,
      {
        qrcode: true,
        token: INSTANCE_TOKEN
      },
      {
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Resposta recebida!');
    console.log('📋 Dados:', JSON.stringify(response.data, null, 2));

    if (response.data.qrcode && response.data.qrcode.base64) {
      salvarQRCode(response.data.qrcode.base64);
    } else if (response.data.base64) {
      salvarQRCode(response.data.base64);
    } else {
      console.log('\n💡 QR Code não está disponível ainda.');
      console.log('   Tente no Manager:');
      console.log('   1. Clique em "RESTART"');
      console.log('   2. Aguarde 10 segundos');
      console.log('   3. Clique em "Get QR Code"\n');
      
      console.log('   Ou acesse diretamente:');
      console.log(`   ${apiUrl}/instance/connect/${instanceName}?apikey=${apiKey}\n`);
    }
  } catch (error) {
    console.error('❌ Erro no método alternativo:', error.message);
    console.log('\n💡 SOLUÇÃO FINAL:');
    console.log('   1. Acesse: http://localhost:8080/manager');
    console.log('   2. Clique em "RESTART" (botão verde)');
    console.log('   3. Aguarde 10 segundos');
    console.log('   4. Clique em "Get QR Code"\n');
    
    console.log('   OU acesse diretamente no navegador:');
    console.log(`   ${apiUrl}/instance/connect/${instanceName}?apikey=${apiKey}\n`);
  }
}

function salvarQRCode(base64Data) {
  try {
    // Remover prefixo se existir
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const filePath = path.join(__dirname, 'qrcode-whatsapp.png');
    
    fs.writeFileSync(filePath, buffer);
    console.log(`\n✅ QR Code salvo em: ${filePath}`);
    console.log('   Abra este arquivo para ver o QR Code!\n');
    
    // Tentar abrir automaticamente (Windows)
    exec(`start ${filePath}`, (error) => {
      if (!error) {
        console.log('📱 QR Code aberto automaticamente!\n');
      }
    });
    
    console.log('📱 Próximos passos:');
    console.log('   1. Abra o WhatsApp no celular');
    console.log('   2. Vá em: Configurações → Aparelhos conectados');
    console.log('   3. Toque em "Conectar um aparelho"');
    console.log('   4. Escaneie o QR Code que acabou de abrir\n');
  } catch (error) {
    console.error('❌ Erro ao salvar QR Code:', error.message);
  }
}

async function verificarStatus() {
  try {
    console.log('3️⃣ Verificando status da conexão...\n');
    
    const response = await axios.get(
      `${apiUrl}/instance/connectionState/${instanceName}`,
      {
        headers: {
          'apikey': apiKey
        },
        timeout: 5000
      }
    );

    const state = response.data.state;
    console.log('📊 Status atual:', state || 'Não disponível');
    
    if (state === 'open') {
      console.log('✅ WhatsApp já está CONECTADO!\n');
      console.log('🧪 Teste com: npm run test:whatsapp\n');
    } else {
      console.log('⚠️  WhatsApp não está conectado.');
      console.log('   Escaneie o QR Code para conectar.\n');
    }
  } catch (error) {
    console.log('⚠️  Não foi possível verificar o status\n');
  }
}

conectarComToken();

