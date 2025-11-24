// Script para FORÇAR a geração do QR Code
// Execute: node obter-qrcode-forcado.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function forcarQRCode() {
  console.log('🔧 FORÇANDO GERAÇÃO DO QR CODE\n');
  
  try {
    // 1. Desconectar primeiro (se estiver conectado)
    console.log('1️⃣ Desconectando instância...');
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
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log('⚠️  Não estava conectado ou erro ao desconectar (pode ser normal)');
    }
    
    // 2. Reiniciar instância
    console.log('\n2️⃣ Reiniciando instância...');
    try {
      await axios.put(
        `${API_URL}/instance/restart/${INSTANCE_NAME}`,
        {},
        {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      console.log('✅ Reiniciado!');
    } catch (error) {
      console.log('⚠️  Erro ao reiniciar:', error.response?.status || error.message);
    }
    
    // 3. Aguardar um pouco
    console.log('\n⏳ Aguardando 10 segundos para a instância inicializar...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 4. Tentar obter QR Code múltiplas vezes
    console.log('\n3️⃣ Tentando obter QR Code...');
    
    for (let i = 1; i <= 5; i++) {
      console.log(`   Tentativa ${i}/5...`);
      
      try {
        // Tentar GET primeiro
        let response = await axios.get(
          `${API_URL}/instance/connect/${INSTANCE_NAME}`,
          {
            headers: {
              'apikey': API_KEY
            },
            timeout: 15000
          }
        );
        
        console.log(`   Resposta: count = ${response.data.count || 0}`);
        
        // Se tiver QR Code
        if (response.data.qrcode && response.data.qrcode.base64) {
          console.log('   ✅ QR Code encontrado!');
          salvarQRCode(response.data.qrcode.base64);
          return;
        } else if (response.data.base64) {
          console.log('   ✅ QR Code encontrado (formato alternativo)!');
          salvarQRCode(response.data.base64);
          return;
        }
        
        // Se não tiver, tentar POST
        if (i === 1) {
          console.log('   Tentando POST para forçar geração...');
          try {
            const postResponse = await axios.post(
              `${API_URL}/instance/connect/${INSTANCE_NAME}`,
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
            
            if (postResponse.data.qrcode && postResponse.data.qrcode.base64) {
              console.log('   ✅ QR Code gerado via POST!');
              salvarQRCode(postResponse.data.qrcode.base64);
              return;
            }
          } catch (postError) {
            console.log('   ⚠️  POST não funcionou:', postError.response?.status || postError.message);
          }
        }
        
        if (i < 5) {
          console.log('   ⏳ Aguardando 5 segundos...\n');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.response?.status || error.message}`);
        if (i < 5) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
    
    // Se chegou aqui, não conseguiu
    console.log('\n❌ Não foi possível gerar QR Code automaticamente.\n');
    console.log('💡 SOLUÇÕES MANUAIS:\n');
    console.log('1️⃣  Use o Evolution Manager:');
    console.log(`   👉 ${API_URL}/manager`);
    console.log(`   👉 Login: ${API_KEY}`);
    console.log('   👉 Na instância "FlowGest":');
    console.log('      - Clique em "DESCONECTAR" (botão vermelho)');
    console.log('      - Clique em "RESTART" (botão verde)');
    console.log('      - AGUARDE 30 SEGUNDOS');
    console.log('      - Clique em "Get QR Code" (botão laranja)\n');
    
    console.log('2️⃣  Ou recrie a instância:');
    console.log('   👉 Delete a instância atual');
    console.log('   👉 Crie uma nova com o mesmo nome');
    console.log('   👉 O QR Code deve aparecer automaticamente\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }
}

function salvarQRCode(base64Data) {
  try {
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

forcarQRCode();

