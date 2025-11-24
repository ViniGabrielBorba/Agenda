// Script para testar Z-API com o número correto
// Execute: node testar-z-api-com-numero-correto.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const Z_API_BASE = 'https://api.z-api.io';
const INSTANCE_ID = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
const TOKEN = '23B770EAD3D54B9C0816D645';
const PROFESSIONAL_PHONE = '+5581994201799'; // Número correto

async function testarZAPI() {
  console.log('🧪 Testando Z-API com número correto...\n');
  console.log('📋 Configuração:');
  console.log(`   Base URL: ${Z_API_BASE}`);
  console.log(`   Instance ID: ${INSTANCE_ID}`);
  console.log(`   Token: ${TOKEN.substring(0, 10)}...`);
  console.log(`   Número destino: ${PROFESSIONAL_PHONE}\n`);
  
  try {
    // Formatar número
    let numeroFormatado = PROFESSIONAL_PHONE.replace(/\D/g, '');
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

    // Z-API: tentar sem Client-Token no header (token já está na URL)
    let response;
    try {
      // Tentativa 1: Sem Client-Token no header (token já está na URL)
      response = await axios.post(
        url,
        {
          phone: numeroFormatado,
          message: mensagem
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000
        }
      );
    } catch (error) {
      // Tentativa 2: Com Client-Token no header
      if (error.response?.status === 400 || error.response?.status === 401) {
        response = await axios.post(
          url,
          {
            phone: numeroFormatado,
            message: mensagem
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Client-Token': TOKEN,
              'Accept': 'application/json'
            },
            timeout: 15000
          }
        );
      } else {
        throw error;
      }
    }
    
    console.log('✅ Mensagem enviada com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    console.log(`\n📱 Você deve receber a mensagem no WhatsApp: ${PROFESSIONAL_PHONE}\n`);
    
    console.log('✅ Z-API está funcionando!');
    console.log('   Agora vamos atualizar o .env...\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 400 && error.response.data?.error?.includes('client-token')) {
        console.error('\n⚠️  PROBLEMA: Client-Token não configurado no painel Z-API!');
        console.error('\n💡 SOLUÇÃO:');
        console.error('   1. Acesse: https://developer.z-api.io');
        console.error('   2. Faça login');
        console.error('   3. Vá em: Instâncias → Sua instância');
        console.error('   4. Aba "Segurança" ou "Configurações"');
        console.error('   5. Configure o Client-Token: 23B770EAD3D54B9C0816D645');
        console.error('   6. Ative/Habilite o token');
        console.error('   7. Salve as configurações');
        console.error('   8. Teste novamente\n');
      } else if (error.response.status === 401) {
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

