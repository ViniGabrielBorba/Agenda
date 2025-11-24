// Script para testar Z-API usando a URL completa fornecida
// Execute: node testar-z-api-url-completa.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function testarZAPIUrlCompleta() {
  console.log('🧪 Testando Z-API com URL completa...\n');

  // URL completa fornecida pelo usuário
  const urlCompleta = 'https://api.z-api.io/instances/3EAAFE5FE9E5C1E3453A1E9814A1DE6D/token/23B770EAD3D54B9C0816D645/send-text';
  const professionalPhone = '+5581994201799';
  
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

  console.log('📋 Configuração:');
  console.log(`   URL: ${urlCompleta}`);
  console.log(`   Número: ${formattedPhone}`);
  console.log(`   Mensagem: ${mensagem.substring(0, 50)}...\n`);

  // Tentar diferentes formatos de requisição
  const tentativas = [
    {
      nome: 'Com Client-Token no header',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': '23B770EAD3D54B9C0816D645'
      },
      body: {
        phone: formattedPhone,
        message: mensagem
      }
    },
    {
      nome: 'Com phone e message',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        phone: formattedPhone,
        message: mensagem
      }
    },
    {
      nome: 'Com number ao invés de phone',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': '23B770EAD3D54B9C0816D645'
      },
      body: {
        number: formattedPhone,
        text: mensagem
      }
    },
    {
      nome: 'Formato Z-API padrão',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': '23B770EAD3D54B9C0816D645'
      },
      body: {
        phone: formattedPhone,
        message: mensagem
      }
    }
  ];

  for (const tentativa of tentativas) {
    try {
      console.log(`\n📤 Tentativa: ${tentativa.nome}`);
      console.log(`   Headers:`, JSON.stringify(tentativa.headers, null, 2));
      console.log(`   Body:`, JSON.stringify(tentativa.body, null, 2));
      
      const response = await axios.post(
        urlCompleta,
        tentativa.body,
        {
          headers: tentativa.headers,
          timeout: 15000
        }
      );

      console.log('✅ SUCESSO!');
      console.log('Status:', response.status);
      console.log('Resposta:', JSON.stringify(response.data, null, 2));
      console.log(`\n📱 Verifique seu WhatsApp: ${professionalPhone}\n`);
      return;
    } catch (error) {
      console.log(`❌ Erro: ${error.response?.status || error.message}`);
      if (error.response) {
        console.log('   Resposta:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  console.log('\n❌ Todas as tentativas falharam.');
  console.log('\n💡 Verifique:');
  console.log('   1. A instância está conectada no painel Z-API?');
  console.log('   2. O Client-Token está configurado?');
  console.log('   3. O número está correto?\n');
}

testarZAPIUrlCompleta();

