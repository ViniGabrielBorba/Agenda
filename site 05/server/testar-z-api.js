// Script para testar Z-API com as credenciais fornecidas
// Execute: node testar-z-api.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

// Credenciais Z-API fornecidas
const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN = '23B770EAD3D54B9C0816D645';
const NUMERO_TESTE = '+5581996687669'; // Número para testar

async function testarZAPI() {
  console.log('🧪 Testando Z-API...\n');
  console.log('📋 Configuração:');
  console.log(`   Base URL: ${Z_API_BASE}`);
  console.log(`   Instance ID: ${INSTANCE_ID}`);
  console.log(`   Token: ${TOKEN.substring(0, 10)}...`);
  console.log(`   Número destino: ${NUMERO_TESTE}\n`);
  
  try {
    // Formatar número
    let numeroFormatado = NUMERO_TESTE.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    
    // URL do Z-API
    const url = `${Z_API_BASE}/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`;
    
    console.log('📤 Enviando mensagem...');
    console.log(`   URL: ${url}`);
    console.log(`   Número: ${numeroFormatado}\n`);
    
    const mensagem = `🧪 Teste do FlowGest - Z-API

Olá! Esta é uma mensagem de teste usando Z-API.

✅ Se você recebeu esta mensagem, o Z-API está funcionando perfeitamente!

Sistema: FlowGest - Agendamento Online
Data: ${new Date().toLocaleString('pt-BR')}

Esta é uma mensagem automática de teste.`;

    // Z-API - tentar diferentes formatos de header
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Tentar diferentes formatos de autenticação
    const authFormats = [
      { 'Client-Token': TOKEN },
      { 'client-token': TOKEN },
      { 'Authorization': `Bearer ${TOKEN}` },
      { 'Authorization': `Token ${TOKEN}` },
      { 'X-Client-Token': TOKEN }
    ];
    
    let lastError = null;
    
    for (let i = 0; i < authFormats.length; i++) {
      const authHeader = authFormats[i];
      console.log(`\n   Tentativa ${i + 1}/${authFormats.length}: ${Object.keys(authHeader)[0]}`);
      
      try {
        const response = await axios.post(
          url,
          {
            phone: numeroFormatado,
            message: mensagem
          },
          {
            headers: {
              ...headers,
              ...authHeader
            },
            timeout: 15000
          }
        );
        
        console.log('   ✅ Sucesso com este formato!');
        return response;
      } catch (error) {
        lastError = error;
        if (error.response?.status !== 400 && error.response?.status !== 401) {
          // Se não for erro de autenticação, parar
          break;
        }
        if (i < authFormats.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Se chegou aqui, nenhum formato funcionou
    throw lastError;
    
    console.log('✅ Mensagem enviada com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    console.log(`\n📱 A pessoa deve receber a mensagem no WhatsApp: ${NUMERO_TESTE}\n`);
    
    console.log('✅ Z-API está funcionando!');
    console.log('   Agora vamos configurar no .env...\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Token ou Instance ID podem estar incorretos.');
      } else if (error.response.status === 404) {
        console.error('\n💡 Instance ID pode estar incorreto ou instância não existe.');
      }
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

testarZAPI();

