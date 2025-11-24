// Testar o sistema completo com as configurações do .env
require('dotenv').config({ path: './.env' });
const { sendWhatsAppMessage } = require('./utils/whatsapp');

async function testar() {
  console.log('🧪 Testando sistema completo...\n');
  
  console.log('📋 Configuração do .env:');
  console.log(`   WHATSAPP_PROVIDER: ${process.env.WHATSAPP_PROVIDER}`);
  console.log(`   WHATSAPP_API_URL: ${process.env.WHATSAPP_API_URL}`);
  console.log(`   WHATSAPP_API_KEY: ${process.env.WHATSAPP_API_KEY?.substring(0, 10)}...`);
  console.log(`   WHATSAPP_INSTANCE: ${process.env.WHATSAPP_INSTANCE}`);
  console.log(`   WHATSAPP_CLIENT_TOKEN: ${process.env.WHATSAPP_CLIENT_TOKEN?.substring(0, 10)}...`);
  console.log(`   PROFESSIONAL_WHATSAPP: ${process.env.PROFESSIONAL_WHATSAPP}\n`);

  const mensagem = `🧪 *TESTE DO FLOWGEST*\n\n✅ Sistema completo funcionando!\n\n📅 ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;

  try {
    console.log('📤 Enviando mensagem...\n');
    const result = await sendWhatsAppMessage(process.env.PROFESSIONAL_WHATSAPP || '+5581994201799', mensagem);
    
    if (result.success) {
      console.log('✅ SUCESSO! Mensagem enviada!');
      console.log('📱 Verifique seu WhatsApp!\n');
    } else {
      console.log('❌ Erro:', result.error);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

testar();

