// Script para obter QR Code diretamente da Evolution API
// Execute: node obter-qrcode-direto.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
// const open = require('open'); // Removido - usar import dinâmico se necessário

async function obterQRCodeDireto() {
  console.log('📱 Obtendo QR Code diretamente da Evolution API...\n');

  const apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
  const apiKey = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
  const instanceName = process.env.WHATSAPP_INSTANCE || 'flowgest';

  try {
    // Primeiro, tentar obter o QR Code via endpoint de conexão
    console.log('1️⃣ Tentando obter QR Code...');
    
    const response = await axios.get(
      `${apiUrl}/instance/connect/${instanceName}`,
      {
        headers: {
          'apikey': apiKey
        },
        timeout: 10000
      }
    );

    console.log('✅ Resposta recebida!\n');
    console.log('📋 Dados:', JSON.stringify(response.data, null, 2));

    // Verificar diferentes formatos de resposta
    let qrCodeBase64 = null;
    
    if (response.data.qrcode && response.data.qrcode.base64) {
      qrCodeBase64 = response.data.qrcode.base64;
    } else if (response.data.base64) {
      qrCodeBase64 = response.data.base64;
    } else if (response.data.qrcode) {
      console.log('⚠️  QR Code em formato diferente:', response.data.qrcode);
    }

    if (qrCodeBase64) {
      // Remover prefixo se existir
      const base64Data = qrCodeBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(__dirname, 'qrcode-whatsapp.png');
      
      fs.writeFileSync(filePath, buffer);
      console.log(`\n✅ QR Code salvo em: ${filePath}`);
      console.log('   Abra este arquivo para ver o QR Code!\n');
      
      // Abrir automaticamente (Windows)
      try {
        const { exec } = require('child_process');
        exec(`start ${filePath}`, (error) => {
          if (error) {
            console.log('💡 Abra manualmente o arquivo: qrcode-whatsapp.png\n');
          } else {
            console.log('📱 QR Code aberto automaticamente!\n');
          }
        });
      } catch (err) {
        console.log('💡 Abra manualmente o arquivo: qrcode-whatsapp.png\n');
      }
    } else {
      // Se não tiver base64, tentar gerar novo QR Code
      console.log('\n⚠️  QR Code não encontrado na resposta.');
      console.log('🔄 Tentando gerar novo QR Code...\n');
      
      try {
        const generateResponse = await axios.post(
          `${apiUrl}/instance/connect/${instanceName}`,
          {
            qrcode: true
          },
          {
            headers: {
              'apikey': apiKey,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        console.log('✅ Novo QR Code gerado!');
        console.log('📋 Dados:', JSON.stringify(generateResponse.data, null, 2));

        if (generateResponse.data.qrcode && generateResponse.data.qrcode.base64) {
          const base64Data = generateResponse.data.qrcode.base64.replace(/^data:image\/[a-z]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(__dirname, 'qrcode-whatsapp.png');
          
          fs.writeFileSync(filePath, buffer);
          console.log(`\n✅ QR Code salvo em: ${filePath}`);
          
          try {
            const { exec } = require('child_process');
            exec(`start ${filePath}`, (error) => {
              if (error) {
                console.log('💡 Abra manualmente o arquivo: qrcode-whatsapp.png\n');
              } else {
                console.log('📱 QR Code aberto automaticamente!\n');
              }
            });
          } catch (err) {
            console.log('💡 Abra manualmente o arquivo: qrcode-whatsapp.png\n');
          }
        }
      } catch (genError) {
        console.error('❌ Erro ao gerar QR Code:', genError.message);
        console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
        console.log('   1. Acesse: http://localhost:8080/manager');
        console.log('   2. Faça login com API Key: FlowGest2024SecretKey!');
        console.log('   3. Clique na instância "flowgest"');
        console.log('   4. Tente o botão "Get QR Code" novamente');
        console.log('   5. Ou use o botão "RESTART" e depois "Get QR Code"\n');
      }
    }

    // Verificar status
    console.log('2️⃣ Verificando status da conexão...');
    try {
      const statusResponse = await axios.get(
        `${apiUrl}/instance/connectionState/${instanceName}`,
        {
          headers: {
            'apikey': apiKey
          },
          timeout: 5000
        }
      );

      console.log('📊 Status:', statusResponse.data.state || 'Não disponível');
      
      if (statusResponse.data.state === 'open') {
        console.log('✅ WhatsApp já está conectado!\n');
      } else {
        console.log('⚠️  WhatsApp não está conectado.');
        console.log('   Escaneie o QR Code para conectar.\n');
      }
    } catch (statusError) {
      console.log('⚠️  Não foi possível verificar o status\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao obter QR Code:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Erro de autenticação!');
        console.error('   Verifique se a API Key está correta no .env\n');
      } else if (error.response.status === 404) {
        console.error('\n💡 Instância não encontrada!');
        console.error('   Verifique se o nome da instância está correto\n');
      }
    } else {
      console.error('   Erro:', error.message);
    }

    console.log('\n💡 SOLUÇÕES ALTERNATIVAS:\n');
    console.log('OPÇÃO 1: Reiniciar a instância');
    console.log('   1. Acesse: http://localhost:8080/manager');
    console.log('   2. Clique no botão "RESTART" (verde)');
    console.log('   3. Aguarde alguns segundos');
    console.log('   4. Clique em "Get QR Code" novamente\n');
    
    console.log('OPÇÃO 2: Recriar a instância');
    console.log('   1. No Manager, delete a instância "flowgest"');
    console.log('   2. Crie uma nova com o mesmo nome');
    console.log('   3. Tente obter o QR Code\n');
    
    console.log('OPÇÃO 3: Usar o endpoint direto');
    console.log(`   Acesse: ${apiUrl}/instance/connect/${instanceName}?apikey=${apiKey}\n`);
  }
}

obterQRCodeDireto();

