// Script alternativo para obter QR Code da Evolution API
// Tenta múltiplos métodos diferentes
// Execute: node obter-qrcode-alternativo.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'flowgest';

async function tentarMetodo1() {
  console.log('\n📱 MÉTODO 1: GET /instance/connect/{instanceName}');
  console.log('─'.repeat(50));
  
  try {
    const response = await axios.get(
      `${API_URL}/instance/connect/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Sucesso!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Falhou:', error.response?.status, error.response?.data?.message || error.message);
    return null;
  }
}

async function tentarMetodo2() {
  console.log('\n📱 MÉTODO 2: POST /instance/connect/{instanceName} com qrcode:true');
  console.log('─'.repeat(50));
  
  try {
    const response = await axios.post(
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
    
    console.log('✅ Sucesso!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Falhou:', error.response?.status, error.response?.data?.message || error.message);
    return null;
  }
}

async function tentarMetodo3() {
  console.log('\n📱 MÉTODO 3: GET com Authorization Bearer');
  console.log('─'.repeat(50));
  
  try {
    const response = await axios.get(
      `${API_URL}/instance/connect/${INSTANCE_NAME}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Sucesso!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Falhou:', error.response?.status, error.response?.data?.message || error.message);
    return null;
  }
}

async function tentarMetodo4() {
  console.log('\n📱 MÉTODO 4: GET /instance/fetchInstances e depois connect');
  console.log('─'.repeat(50));
  
  try {
    // Primeiro, listar instâncias
    const listResponse = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    console.log('Instâncias encontradas:', JSON.stringify(listResponse.data, null, 2));
    
    // Depois, tentar conectar
    const connectResponse = await axios.get(
      `${API_URL}/instance/connect/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Sucesso!');
    console.log('Resposta:', JSON.stringify(connectResponse.data, null, 2));
    return connectResponse.data;
  } catch (error) {
    console.log('❌ Falhou:', error.response?.status, error.response?.data?.message || error.message);
    return null;
  }
}

async function tentarMetodo5() {
  console.log('\n📱 MÉTODO 5: Reiniciar instância e depois conectar');
  console.log('─'.repeat(50));
  
  try {
    // Reiniciar
    console.log('1. Reiniciando instância...');
    await axios.put(
      `${API_URL}/instance/restart/${INSTANCE_NAME}`,
      {},
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Instância reiniciada!');
    console.log('⏳ Aguardando 5 segundos...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Tentar conectar
    console.log('2. Tentando obter QR Code...');
    const response = await axios.get(
      `${API_URL}/instance/connect/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 15000
      }
    );
    
    console.log('✅ Sucesso!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Falhou:', error.response?.status, error.response?.data?.message || error.message);
    return null;
  }
}

async function tentarMetodo6() {
  console.log('\n📱 MÉTODO 6: Acessar URL direta no navegador');
  console.log('─'.repeat(50));
  
  const url = `${API_URL}/instance/connect/${INSTANCE_NAME}?apikey=${API_KEY}`;
  console.log('🌐 Abra esta URL no seu navegador:');
  console.log(`\n   ${url}\n`);
  console.log('💡 Ou copie e cole no navegador para ver o QR Code diretamente!');
  
  return { url };
}

function salvarQRCode(data) {
  if (!data) return;
  
  let base64Data = null;
  
  // Tentar diferentes formatos de resposta
  if (data.qrcode && data.qrcode.base64) {
    base64Data = data.qrcode.base64;
  } else if (data.base64) {
    base64Data = data.base64;
  } else if (data.qrcode && typeof data.qrcode === 'string') {
    base64Data = data.qrcode;
  }
  
  if (base64Data) {
    try {
      // Remover prefixo data:image se existir
      base64Data = base64Data.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(__dirname, 'qrcode.png');
      
      fs.writeFileSync(filePath, buffer);
      console.log(`\n✅ QR Code salvo em: ${filePath}`);
      console.log('   Abra este arquivo para ver o QR Code!\n');
      return filePath;
    } catch (error) {
      console.log('⚠️  Não foi possível salvar o QR Code:', error.message);
    }
  }
  
  return null;
}

async function main() {
  console.log('🚀 Tentando obter QR Code usando MÚLTIPLOS métodos\n');
  console.log('📋 Configuração:');
  console.log(`   URL: ${API_URL}`);
  console.log(`   Instance: ${INSTANCE_NAME}`);
  console.log(`   API Key: ${API_KEY.substring(0, 10)}...\n`);
  
  // Tentar todos os métodos
  const resultados = [];
  
  resultados.push(await tentarMetodo1());
  resultados.push(await tentarMetodo2());
  resultados.push(await tentarMetodo3());
  resultados.push(await tentarMetodo4());
  resultados.push(await tentarMetodo5());
  const metodo6 = await tentarMetodo6();
  
  // Verificar qual método funcionou
  let qrCodeEncontrado = null;
  for (const resultado of resultados) {
    if (resultado && (resultado.qrcode || resultado.base64)) {
      qrCodeEncontrado = resultado;
      break;
    }
  }
  
  // Salvar QR Code se encontrado
  if (qrCodeEncontrado) {
    console.log('\n🎉 QR CODE ENCONTRADO!');
    salvarQRCode(qrCodeEncontrado);
  } else {
    console.log('\n⚠️  Nenhum método retornou QR Code diretamente.');
    console.log('\n💡 SOLUÇÕES ALTERNATIVAS:');
    console.log('\n1️⃣  Use o Evolution Manager:');
    console.log(`   👉 ${API_URL}/manager`);
    console.log(`   👉 Login: ${API_KEY}`);
    console.log(`   👉 RESTART → Aguarde 20s → Get QR Code\n`);
    
    console.log('2️⃣  Acesse a URL direta no navegador:');
    console.log(`   👉 ${metodo6.url}\n`);
    
    console.log('3️⃣  Use a página HTML:');
    console.log(`   👉 Abra: server/conectar-whatsapp.html\n`);
    
    console.log('4️⃣  Verifique se a instância existe:');
    console.log(`   👉 Execute: node verificar-instancia.js\n`);
  }
}

main().catch(console.error);

