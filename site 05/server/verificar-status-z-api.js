// Script para verificar status da instância Z-API
// Execute: node verificar-status-z-api.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN = '23B770EAD3D54B9C0816D645';

async function verificarStatus() {
  console.log('🔍 Verificando status da instância Z-API...\n');
  
  try {
    // Tentar verificar status da instância
    console.log('1️⃣ Tentando verificar status da instância...');
    
    const endpoints = [
      `/instances/${INSTANCE_ID}/status`,
      `/instances/${INSTANCE_ID}`,
      `/instance/${INSTANCE_ID}/status`,
      `/instance/${INSTANCE_ID}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`   Tentando: ${endpoint}`);
        const response = await axios.get(
          `${Z_API_BASE}${endpoint}`,
          {
            headers: {
              'Client-Token': TOKEN,
              'Accept': 'application/json'
            },
            timeout: 5000
          }
        );
        
        console.log('   ✅ Sucesso!');
        console.log('   Resposta:', JSON.stringify(response.data, null, 2));
        return;
      } catch (error) {
        console.log(`   ❌ Erro ${error.response?.status || error.message}`);
      }
    }
    
    // Tentar obter QR Code
    console.log('\n2️⃣ Tentando obter QR Code...');
    const qrEndpoints = [
      `/instances/${INSTANCE_ID}/token/${TOKEN}/qr-code`,
      `/instances/${INSTANCE_ID}/qr-code`,
      `/instance/${INSTANCE_ID}/qr-code`
    ];
    
    for (const endpoint of qrEndpoints) {
      try {
        console.log(`   Tentando: ${endpoint}`);
        const response = await axios.get(
          `${Z_API_BASE}${endpoint}`,
          {
            headers: {
              'Client-Token': TOKEN,
              'Accept': 'application/json'
            },
            timeout: 5000
          }
        );
        
        console.log('   ✅ QR Code disponível!');
        if (response.data.base64) {
          const fs = require('fs');
          const path = require('path');
          const base64Data = response.data.base64.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(__dirname, 'qrcode-zapi.png');
          fs.writeFileSync(filePath, buffer);
          console.log(`   📱 QR Code salvo em: ${filePath}\n`);
        }
        return;
      } catch (error) {
        console.log(`   ❌ Erro ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n⚠️  Não foi possível verificar status automaticamente.');
    console.log('\n💡 SOLUÇÃO:');
    console.log('   1. Acesse o painel Z-API: https://developer.z-api.io');
    console.log('   2. Verifique se a instância está ativa');
    console.log('   3. Verifique se o Client-Token está configurado');
    console.log('   4. Obtenha o QR Code no painel');
    console.log('   5. Escaneie com seu WhatsApp\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }
}

verificarStatus();

