// Script para testar usando o token diretamente
// Execute: node testar-com-token-direto.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const TOKEN = '01C8400EB672-45C4-B862-6BDA67B49C96';
const INSTANCE_ID = 'E927C44E8B5D-4865-BA72-E80529036C41';
const PROFESSIONAL_PHONE = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';

async function testarComToken() {
  console.log('🧪 Testando com token direto...\n');
  
  try {
    // 1. Listar todas as instâncias
    console.log('1️⃣ Listando todas as instâncias...');
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
    
    instances.forEach((inst, index) => {
      console.log(`${index + 1}. Nome: ${inst.name || inst.instanceName}`);
      console.log(`   ID: ${inst.id || inst.instanceId}`);
      console.log(`   Token: ${inst.token}`);
      console.log(`   Status: ${inst.connectionStatus || inst.state}`);
      console.log('');
    });
    
    // 2. Procurar instância pelo token ou ID
    let instanciaParaUsar = null;
    
    for (const inst of instances) {
      if (inst.token === TOKEN || inst.id === INSTANCE_ID || inst.instanceId === INSTANCE_ID) {
        instanciaParaUsar = inst;
        break;
      }
    }
    
    if (!instanciaParaUsar) {
      console.log('⚠️  Instância não encontrada com o token/ID fornecido.');
      console.log('   Usando a primeira instância disponível...\n');
      instanciaParaUsar = instances[0];
    }
    
    const nomeInstancia = instanciaParaUsar.name || instanciaParaUsar.instanceName;
    const status = instanciaParaUsar.connectionStatus || instanciaParaUsar.state;
    
    console.log(`✅ Usando instância: ${nomeInstancia}`);
    console.log(`   Status: ${status}`);
    console.log(`   Token: ${instanciaParaUsar.token}\n`);
    
    // 3. Se não estiver conectada, tentar obter QR Code
    if (status !== 'open') {
      console.log('⚠️  Instância não está conectada!');
      console.log('   Tentando obter QR Code...\n');
      
      // Tentar múltiplas vezes obter QR Code
      for (let i = 1; i <= 3; i++) {
        console.log(`   Tentativa ${i}/3...`);
        try {
          const qrResponse = await axios.get(
            `${API_URL}/instance/connect/${nomeInstancia}`,
            {
              headers: {
                'apikey': API_KEY
              },
              timeout: 10000
            }
          );
          
          if (qrResponse.data.qrcode && qrResponse.data.qrcode.base64) {
            const fs = require('fs');
            const path = require('path');
            const base64Data = qrResponse.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filePath = path.join(__dirname, 'qrcode.png');
            fs.writeFileSync(filePath, buffer);
            console.log(`\n✅ QR Code salvo em: ${filePath}`);
            console.log('   Abra este arquivo para escanear!\n');
            return;
          } else {
            console.log(`   Resposta: count = ${qrResponse.data.count || 0}`);
          }
        } catch (error) {
          console.log(`   Erro: ${error.response?.status || error.message}`);
        }
        
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      console.log('\n❌ Não foi possível obter QR Code automaticamente.');
      console.log('\n💡 SOLUÇÃO:');
      console.log('   1. Acesse: http://localhost:8080/manager');
      console.log('   2. Login: FlowGest2024SecretKey!');
      console.log('   3. Na instância, clique em "Get QR Code"');
      console.log('   4. Escaneie o QR Code com seu WhatsApp');
      console.log('   5. Depois execute este script novamente\n');
      return;
    }
    
    // 4. Se estiver conectada, tentar enviar mensagem
    console.log('4️⃣ Instância conectada! Tentando enviar mensagem...\n');
    
    let numeroFormatado = PROFESSIONAL_PHONE.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    
    const mensagem = `🧪 Teste do FlowGest

Esta é uma mensagem de teste usando o token diretamente.

✅ Se você recebeu esta mensagem, está funcionando!

Token: ${TOKEN}
Data: ${new Date().toLocaleString('pt-BR')}`;
    
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
    console.log(`\n📱 Verifique seu WhatsApp: ${PROFESSIONAL_PHONE}\n`);
    
  } catch (error) {
    console.error('\n❌ Erro:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

testarComToken();

