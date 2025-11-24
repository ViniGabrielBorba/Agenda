// Script para testar envio de mensagem via WhatsApp
// Execute: node testar-whatsapp.js

require('dotenv').config({ path: './.env' });
const { sendViaEvolutionAPI } = require('./utils/whatsapp-evolution');

async function testarWhatsApp() {
  console.log('📱 Testando envio de mensagem via WhatsApp...\n');

  const config = {
    apiUrl: process.env.WHATSAPP_API_URL || 'http://localhost:8080',
    apiKey: process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!',
    instance: process.env.WHATSAPP_INSTANCE || 'FlowGest' // Nome exato: FlowGest (com maiúsculas)
  };

  const professionalPhone = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';

  console.log('📋 Configuração:');
  console.log(`   API URL: ${config.apiUrl}`);
  console.log(`   Instance: ${config.instance}`);
  console.log(`   API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log(`   Número destino: ${professionalPhone}\n`);

  const mensagem = `🧪 Teste do FlowGest

Esta é uma mensagem de teste do sistema de agendamento.

✅ Se você recebeu esta mensagem, o WhatsApp está funcionando perfeitamente!

Data: ${new Date().toLocaleString('pt-BR')}`;

  try {
    console.log('📤 Enviando mensagem de teste...\n');
    
    const resultado = await sendViaEvolutionAPI(professionalPhone, mensagem, config);
    
    console.log('✅ Mensagem enviada com sucesso!\n');
    console.log('📋 Resposta:', JSON.stringify(resultado, null, 2));
    console.log('\n📱 Verifique seu WhatsApp!');
    console.log(`   Você deve receber a mensagem no número: ${professionalPhone}\n`);
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:\n');
    console.error(error.message);
    console.error('\n💡 Verifique:');
    console.error('   1. A instância está conectada no Manager?');
    console.error('   2. O .env está configurado corretamente?');
    console.error('   3. O número está no formato correto? (+5581994201799)\n');
  }
}

testarWhatsApp();

