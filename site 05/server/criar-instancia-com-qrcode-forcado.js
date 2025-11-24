// Script para criar instância FORÇANDO geração de QR Code
// Execute: node criar-instancia-com-qrcode-forcado.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = 'FlowGest';

async function criarComQRCodeForcado() {
  console.log('🔧 Criando instância FORÇANDO geração de QR Code...\n');
  
  try {
    // 1. Deletar instância existente
    console.log('1️⃣ Deletando instância existente...');
    try {
      await axios.delete(
        `${API_URL}/instance/delete/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      console.log('   ✅ Deletada!');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log('   ⚠️  Não existia ou erro:', error.response?.status || 'OK');
    }
    
    // 2. Criar instância com TODAS as opções de QR Code
    console.log('\n2️⃣ Criando instância com QR Code forçado...');
    
    const payloads = [
      // Tentativa 1: Com qrcode: true
      {
        instanceName: INSTANCE_NAME,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      },
      // Tentativa 2: Com qrcode como string
      {
        instanceName: INSTANCE_NAME,
        qrcode: 'true',
        integration: 'WHATSAPP-BAILEYS'
      },
      // Tentativa 3: Com integration EVOLUTION
      {
        instanceName: INSTANCE_NAME,
        qrcode: true,
        integration: 'EVOLUTION'
      }
    ];
    
    let instanciaCriada = false;
    
    for (let i = 0; i < payloads.length; i++) {
      console.log(`\n   Tentativa ${i + 1}/${payloads.length}...`);
      console.log('   Payload:', JSON.stringify(payloads[i], null, 2));
      
      try {
        const response = await axios.post(
          `${API_URL}/instance/create`,
          payloads[i],
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': API_KEY
            },
            timeout: 15000
          }
        );
        
        console.log('   ✅ Instância criada!');
        console.log('   ID:', response.data.instance?.instanceId);
        console.log('   Status:', response.data.instance?.status);
        console.log('   QR Code count:', response.data.qrcode?.count || 0);
        
        if (response.data.qrcode?.base64) {
          console.log('   ✅ QR Code gerado na criação!');
          const fs = require('fs');
          const path = require('path');
          const base64Data = response.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(__dirname, 'qrcode.png');
          fs.writeFileSync(filePath, buffer);
          console.log(`   📱 QR Code salvo em: ${filePath}\n`);
          instanciaCriada = true;
          break;
        }
        
        instanciaCriada = true;
        break;
        
      } catch (error) {
        console.log(`   ❌ Erro: ${error.response?.status || error.message}`);
        if (error.response?.data) {
          console.log('   Detalhes:', JSON.stringify(error.response.data, null, 2));
        }
        
        if (i < payloads.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (!instanciaCriada) {
      console.log('\n❌ Não foi possível criar a instância!');
      return;
    }
    
    // 3. Aguardar e tentar obter QR Code
    console.log('\n3️⃣ Aguardando 5 segundos e tentando obter QR Code...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (let tentativa = 1; tentativa <= 5; tentativa++) {
      console.log(`\n   Tentativa ${tentativa}/5 de obter QR Code...`);
      
      try {
        const qrResponse = await axios.get(
          `${API_URL}/instance/connect/${INSTANCE_NAME}`,
          {
            headers: {
              'apikey': API_KEY
            },
            timeout: 10000
          }
        );
        
        console.log(`   Resposta: count = ${qrResponse.data.count || 0}`);
        
        if (qrResponse.data.qrcode && qrResponse.data.qrcode.base64) {
          console.log('   ✅ QR Code obtido!');
          const fs = require('fs');
          const path = require('path');
          const base64Data = qrResponse.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(__dirname, 'qrcode.png');
          fs.writeFileSync(filePath, buffer);
          console.log(`   📱 QR Code salvo em: ${filePath}\n`);
          return;
        }
        
        if (tentativa < 5) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.log(`   ⚠️  Erro: ${error.response?.status || error.message}`);
        if (tentativa < 5) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
    
    console.log('\n❌ Não foi possível obter QR Code automaticamente.');
    console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
    console.log('   A Evolution API v2.2.3 tem problemas conhecidos com QR Code.');
    console.log('   Tente usar uma versão diferente ou outro método.\n');
    console.log('   Ou acesse diretamente:');
    console.log(`   ${API_URL}/instance/connect/${INSTANCE_NAME}?apikey=${API_KEY}\n`);
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

criarComQRCodeForcado();

