// Testar forçando as variáveis corretas
require('dotenv').config({ path: './.env' });

// Forçar valores corretos
process.env.WHATSAPP_INSTANCE = '3EAAFE5FE9E5C1E3453A1E9814A1DE6D';
process.env.WHATSAPP_CLIENT_TOKEN = 'F890b1a79d33e434f9daabc2b4a9cdd43S';

const { sendWhatsAppMessage } = require('./utils/whatsapp');

async function testar() {
  console.log('🧪 Testando com valores forçados...\n');
  
  console.log('📋 Configuração:');
  console.log(`   WHATSAPP_INSTANCE: ${process.env.WHATSAPP_INSTANCE}`);
  console.log(`   WHATSAPP_CLIENT_TOKEN: ${process.env.WHATSAPP_CLIENT_TOKEN?.substring(0, 10)}...\n`);

  const mensagem = `🧪 *TESTE DO FLOWGEST*\n\n✅ Sistema funcionando!\n\n📅 ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;

  try {
    const result = await sendWhatsAppMessage('+5581994201799', mensagem);
    
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

