// Script para verificar status da instância Z-API
// Execute: node verificar-instancia-z-api.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN = '23B770EAD3D54B9C0816D645';

async function verificarInstancia() {
  console.log('🔍 Verificando instância Z-API...\n');
  console.log(`Instance ID: ${INSTANCE_ID}`);
  console.log(`Token: ${TOKEN.substring(0, 10)}...\n`);

  // Tentar diferentes endpoints para verificar status
  const endpoints = [
    `/instances/${INSTANCE_ID}`,
    `/instances/${INSTANCE_ID}/status`,
    `/instances/${INSTANCE_ID}/token/${TOKEN}/status`,
    `/instance/${INSTANCE_ID}`,
    `/instance/${INSTANCE_ID}/status`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Tentando: GET ${endpoint}`);
      
      // Tentar com diferentes headers
      const headers = [
        { 'Client-Token': TOKEN },
        { 'Authorization': `Bearer ${TOKEN}` },
        { 'X-API-Key': TOKEN },
        { 'apikey': TOKEN }
      ];

      for (const header of headers) {
        try {
          const response = await axios.get(
            `${Z_API_BASE}${endpoint}`,
            {
              headers: {
                'Content-Type': 'application/json',
                ...header
              },
              timeout: 5000
            }
          );
          
          console.log('✅ Sucesso!');
          console.log('Status:', response.status);
          console.log('Resposta:', JSON.stringify(response.data, null, 2));
          return;
        } catch (error) {
          if (error.response) {
            console.log(`   ❌ ${error.response.status}: ${JSON.stringify(error.response.data)}`);
          } else {
            console.log(`   ❌ ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
    console.log('');
  }

  console.log('\n❌ Não foi possível verificar a instância.');
  console.log('\n💡 Verifique:');
  console.log('   1. A instância existe no painel Z-API?');
  console.log('   2. O Instance ID está correto?');
  console.log('   3. A instância está conectada?');
  console.log('   4. O Token está correto?\n');
}

verificarInstancia();

