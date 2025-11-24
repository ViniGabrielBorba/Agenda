// Script para testar com o novo token fornecido
// Execute: node testar-com-novo-token.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN_INSTANCE = '23B770EAD3D54B9C0816D645'; // Token da instância (na URL)
const CLIENT_TOKEN = 'F890b1a79d33e434f9daabc2b4a9cdd43S'; // Novo Client-Token fornecido
const professionalPhone = '+5581994201799';

async function testarComNovoToken() {
  console.log('🧪 Testando com novo Client-Token...\n');

  // Formatar número
  let formattedPhone = professionalPhone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('55')) {
    formattedPhone = '55' + formattedPhone;
  }

  const mensagem = `🧪 *TESTE DO FLOWGEST*\n\n` +
    `✅ Backend está funcionando!\n\n` +
    `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
    `⏰ Horário: ${new Date().toLocaleTimeString('pt-BR')}\n\n` +
    `✨ Sistema de agendamento FlowGest está online!`;

  const url = `${Z_API_BASE}/instances/${INSTANCE_ID}/token/${TOKEN_INSTANCE}/send-text`;

  console.log('📋 Configuração:');
  console.log(`   Instance ID: ${INSTANCE_ID}`);
  console.log(`   Instance Token: ${TOKEN_INSTANCE.substring(0, 10)}...`);
  console.log(`   Client-Token: ${CLIENT_TOKEN.substring(0, 10)}...`);
  console.log(`   Número: ${formattedPhone}`);
  console.log(`   URL: ${url}\n`);

  // Tentar diferentes formatos de Client-Token no header
  const tentativas = [
    {
      nome: 'Client-Token no header',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': CLIENT_TOKEN
      }
    },
    {
      nome: 'Authorization Bearer',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLIENT_TOKEN}`
      }
    },
    {
      nome: 'X-Client-Token',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': CLIENT_TOKEN
      }
    },
    {
      nome: 'client-token (minúsculo)',
      headers: {
        'Content-Type': 'application/json',
        'client-token': CLIENT_TOKEN
      }
    }
  ];

  for (const tentativa of tentativas) {
    try {
      console.log(`📤 Tentativa: ${tentativa.nome}`);
      
      const response = await axios.post(
        url,
        {
          phone: formattedPhone,
          message: mensagem
        },
        {
          headers: tentativa.headers,
          timeout: 15000
        }
      );

      console.log('✅ SUCESSO!');
      console.log('Status:', response.status);
      console.log('Resposta:', JSON.stringify(response.data, null, 2));
      console.log(`\n📱 Verifique seu WhatsApp: ${professionalPhone}\n`);
      
      // Se funcionou, atualizar o .env
      console.log('💾 Atualizando configuração...');
      console.log('   Adicione ao .env:');
      console.log(`   WHATSAPP_CLIENT_TOKEN=${CLIENT_TOKEN}\n`);
      
      return true;
    } catch (error) {
      console.log(`❌ Erro: ${error.response?.status || error.message}`);
      if (error.response) {
        const errorMsg = error.response.data?.error || JSON.stringify(error.response.data);
        console.log(`   Resposta: ${errorMsg}`);
      }
    }
    console.log('');
  }

  console.log('❌ Todas as tentativas falharam.');
  console.log('\n💡 Verifique:');
  console.log('   1. O Client-Token está correto?');
  console.log('   2. O Client-Token está ativado no painel?');
  console.log('   3. A instância está conectada?\n');
  
  return false;
}

testarComNovoToken();

