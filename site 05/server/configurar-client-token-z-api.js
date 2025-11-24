// Script para tentar configurar Client-Token via API Z-API
// Execute: node configurar-client-token-z-api.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN = '23B770EAD3D54B9C0816D645';

async function configurarClientToken() {
  console.log('🔧 Tentando configurar Client-Token via API...\n');
  
  // Z-API geralmente não permite configurar Client-Token via API
  // Precisa ser feito no painel web
  // Mas vamos tentar alguns endpoints comuns
  
  const endpoints = [
    `/instances/${INSTANCE_ID}/client-token`,
    `/instances/${INSTANCE_ID}/token`,
    `/instances/${INSTANCE_ID}/settings`,
    `/instances/${INSTANCE_ID}/config`,
    `/instance/${INSTANCE_ID}/client-token`,
    `/instance/${INSTANCE_ID}/token`
  ];
  
  console.log('⚠️  Z-API geralmente NÃO permite configurar Client-Token via API.');
  console.log('   Isso precisa ser feito MANUALMENTE no painel web.\n');
  
  console.log('📋 Mas vou tentar verificar se há alguma API disponível...\n');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Tentando: PUT ${endpoint}`);
      const response = await axios.put(
        `${Z_API_BASE}${endpoint}`,
        {
          clientToken: TOKEN,
          token: TOKEN,
          client_token: TOKEN
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Client-Token': TOKEN,
            'Accept': 'application/json'
          },
          timeout: 5000
        }
      );
      
      console.log('✅ Sucesso!');
      console.log('Resposta:', JSON.stringify(response.data, null, 2));
      return;
    } catch (error) {
      console.log(`   ❌ Erro ${error.response?.status || error.message}`);
    }
  }
  
  console.log('\n❌ Não foi possível configurar via API.');
  console.log('\n💡 SOLUÇÃO: Configurar MANUALMENTE no painel\n');
  console.log('📋 PASSO A PASSO:\n');
  console.log('1. Acesse: https://developer.z-api.io');
  console.log('2. Faça login');
  console.log('3. Vá em: Instâncias → +55 81 994201799');
  console.log('4. Procure a aba "Segurança" ou "Configurações"');
  console.log('5. Encontre o campo "Client-Token" ou "Token de Cliente"');
  console.log('6. Cole o token: 23B770EAD3D54B9C0816D645');
  console.log('7. Marque como "Ativo" ou "Habilitado"');
  console.log('8. Clique em "Salvar" ou "Aplicar"\n');
  console.log('💡 Dica: O Client-Token pode estar em:');
  console.log('   - Aba "Segurança"');
  console.log('   - Aba "Configurações"');
  console.log('   - Aba "API"');
  console.log('   - Menu "Tokens"\n');
}

configurarClientToken();

