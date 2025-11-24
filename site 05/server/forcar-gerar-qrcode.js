// Script para FORÇAR a geração do QR Code
// Execute: node forcar-gerar-qrcode.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function forcarGerarQRCode() {
  console.log('🔧 FORÇANDO GERAÇÃO DO QR CODE\n');
  console.log('📋 Configuração:');
  console.log(`   URL: ${API_URL}`);
  console.log(`   Instance: ${INSTANCE_NAME}`);
  console.log(`   API Key: ${API_KEY.substring(0, 10)}...\n`);
  
  try {
    // Método 1: Usar o endpoint de restart com qrcode
    console.log('1️⃣ Tentando reiniciar com QR Code...');
    try {
      const restartResponse = await axios.put(
        `${API_URL}/instance/restart/${INSTANCE_NAME}`,
        {
          qrcode: true
        },
        {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      console.log('✅ Reiniciado!');
      console.log('Resposta:', JSON.stringify(restartResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️  Reiniciar com qrcode não funcionou, tentando método alternativo...');
    }
    
    // Aguardar um pouco
    console.log('\n⏳ Aguardando 5 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Método 2: Tentar desconectar e reconectar
    console.log('2️⃣ Tentando desconectar e reconectar...');
    try {
      await axios.delete(
        `${API_URL}/instance/logout/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          timeout: 10000
        }
      );
      console.log('✅ Desconectado!');
      
      console.log('⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Agora tentar conectar novamente
      const connectResponse = await axios.get(
        `${API_URL}/instance/connect/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          timeout: 15000
        }
      );
      
      console.log('✅ Reconectado!');
      console.log('Resposta:', JSON.stringify(connectResponse.data, null, 2));
      
      // Verificar se tem QR Code
      if (connectResponse.data.qrcode && connectResponse.data.qrcode.base64) {
        salvarQRCode(connectResponse.data.qrcode.base64);
        return;
      }
    } catch (error) {
      console.log('⚠️  Desconectar/reconectar não funcionou:', error.response?.status || error.message);
    }
    
    // Método 3: Tentar múltiplas vezes com intervalo
    console.log('\n3️⃣ Tentando obter QR Code múltiplas vezes...');
    for (let i = 1; i <= 5; i++) {
      console.log(`   Tentativa ${i}/5...`);
      
      try {
        const response = await axios.get(
          `${API_URL}/instance/connect/${INSTANCE_NAME}`,
          {
            headers: {
              'apikey': API_KEY
            },
            timeout: 10000
          }
        );
        
        console.log(`   Resposta: count = ${response.data.count || 0}`);
        
        if (response.data.qrcode && response.data.qrcode.base64) {
          console.log('   ✅ QR Code encontrado!');
          salvarQRCode(response.data.qrcode.base64);
          return;
        } else if (response.data.base64) {
          console.log('   ✅ QR Code encontrado (formato alternativo)!');
          salvarQRCode(response.data.base64);
          return;
        }
        
        if (i < 5) {
          console.log('   ⏳ Aguardando 3 segundos...\n');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        if (i < 5) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    // Se chegou aqui, não conseguiu
    console.log('\n❌ Não foi possível gerar o QR Code automaticamente.\n');
    console.log('💡 SOLUÇÃO MANUAL:\n');
    console.log('1️⃣  Acesse o Evolution Manager:');
    console.log(`   👉 ${API_URL}/manager`);
    console.log(`   👉 Login: ${API_KEY}\n`);
    console.log('2️⃣  Na instância "flowgest":');
    console.log('   - Clique em "RESTART" (botão verde)');
    console.log('   - AGUARDE 20-30 SEGUNDOS');
    console.log('   - Clique em "Get QR Code" (botão laranja)');
    console.log('   - O QR Code deve aparecer no modal!\n');
    console.log('3️⃣  Ou acesse a URL direta:');
    console.log(`   👉 ${API_URL}/instance/connect/${INSTANCE_NAME}?apikey=${API_KEY}\n`);
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

function salvarQRCode(base64Data) {
  try {
    // Remover prefixo se existir
    const base64Clean = base64Data.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    const filePath = path.join(__dirname, 'qrcode.png');
    
    fs.writeFileSync(filePath, buffer);
    console.log(`\n✅ QR CODE SALVO EM: ${filePath}`);
    console.log('   Abra este arquivo para ver o QR Code!\n');
    console.log('📱 Próximos passos:');
    console.log('   1. Abra o arquivo qrcode.png');
    console.log('   2. Abra WhatsApp no celular');
    console.log('   3. Configurações → Aparelhos conectados');
    console.log('   4. "Conectar um aparelho"');
    console.log('   5. Escaneie o QR Code\n');
  } catch (error) {
    console.error('❌ Erro ao salvar QR Code:', error.message);
  }
}

forcarGerarQRCode();

