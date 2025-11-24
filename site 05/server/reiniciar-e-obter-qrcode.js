// Script para reiniciar a instância e obter QR Code
// Execute: node reiniciar-e-obter-qrcode.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const apiKey = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const instanceName = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function reiniciarEObterQRCode() {
  console.log('🔄 Reiniciando instância e obtendo QR Code...\n');

  try {
    // Passo 1: Reiniciar a instância
    console.log('1️⃣ Reiniciando instância...');
    try {
      await axios.put(
        `${apiUrl}/instance/restart/${instanceName}`,
        {},
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      console.log('✅ Instância reiniciada!\n');
    } catch (error) {
      console.log('⚠️  Erro ao reiniciar (pode ser normal):', error.message);
      console.log('   Continuando mesmo assim...\n');
    }

    // Aguardar alguns segundos
    console.log('⏳ Aguardando 5 segundos para a instância inicializar...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Passo 2: Tentar obter QR Code várias vezes
    console.log('2️⃣ Tentando obter QR Code...\n');
    
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      console.log(`   Tentativa ${tentativa}/3...`);
      
      try {
        const response = await axios.get(
          `${apiUrl}/instance/connect/${instanceName}`,
          {
            headers: {
              'apikey': apiKey
            },
            timeout: 10000
          }
        );

        console.log('   ✅ Resposta recebida!');
        
        // Verificar diferentes formatos
        if (response.data.qrcode && response.data.qrcode.base64) {
          salvarQRCode(response.data.qrcode.base64);
          return; // Sucesso, sair do loop
        } else if (response.data.base64) {
          salvarQRCode(response.data.base64);
          return; // Sucesso, sair do loop
        } else if (response.data.qrcode && response.data.qrcode.code) {
          console.log(`\n   📱 Código QR: ${response.data.qrcode.code}`);
          console.log('   Use este código no WhatsApp\n');
          return;
        } else {
          console.log('   ⚠️  QR Code ainda não disponível');
          if (tentativa < 3) {
            console.log('   ⏳ Aguardando mais 5 segundos...\n');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      } catch (error) {
        console.log(`   ❌ Erro na tentativa ${tentativa}:`, error.message);
        if (tentativa < 3) {
          console.log('   ⏳ Aguardando mais 5 segundos...\n');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    // Se chegou aqui, não conseguiu obter QR Code
    console.log('\n❌ Não foi possível obter o QR Code automaticamente.\n');
    console.log('💡 SOLUÇÕES MANUAIS:\n');
    console.log('OPÇÃO 1: No Evolution Manager');
    console.log('   1. Acesse: http://localhost:8080/manager');
    console.log('   2. Clique no botão verde "RESTART"');
    console.log('   3. Aguarde 10 segundos');
    console.log('   4. Clique em "Get QR Code"\n');
    
    console.log('OPÇÃO 2: Acessar diretamente no navegador');
    console.log(`   ${apiUrl}/instance/connect/${instanceName}?apikey=${apiKey}\n`);
    
    console.log('OPÇÃO 3: Recriar a instância');
    console.log('   1. No Manager, delete a instância "flowgest"');
    console.log('   2. Clique em "Instance +"');
    console.log('   3. Crie uma nova instância com o mesmo nome');
    console.log('   4. Tente obter o QR Code\n');

  } catch (error) {
    console.error('\n❌ Erro geral:', error.message);
  }
}

function salvarQRCode(base64Data) {
  try {
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const filePath = path.join(__dirname, 'qrcode-whatsapp.png');
    
    fs.writeFileSync(filePath, buffer);
    console.log(`\n✅ QR Code salvo em: ${filePath}`);
    console.log('   Abra este arquivo para ver o QR Code!\n');
    
    // Abrir automaticamente (Windows)
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

reiniciarEObterQRCode();

