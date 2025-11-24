// Script para testar se o Client-Token está sendo lido corretamente
// Execute: node testar-config-completo.js

require('dotenv').config({ path: './.env' });

console.log('🔍 Verificando configuração do .env...\n');

const config = {
  whatsappProvider: process.env.WHATSAPP_PROVIDER,
  whatsappApiUrl: process.env.WHATSAPP_API_URL,
  whatsappApiKey: process.env.WHATSAPP_API_KEY,
  whatsappInstance: process.env.WHATSAPP_INSTANCE,
  whatsappClientToken: process.env.WHATSAPP_CLIENT_TOKEN,
  professionalWhatsapp: process.env.PROFESSIONAL_WHATSAPP
};

console.log('📋 Configuração atual:');
console.log(`   WHATSAPP_PROVIDER: ${config.whatsappProvider || 'NÃO CONFIGURADO'}`);
console.log(`   WHATSAPP_API_URL: ${config.whatsappApiUrl || 'NÃO CONFIGURADO'}`);
console.log(`   WHATSAPP_API_KEY: ${config.whatsappApiKey ? config.whatsappApiKey.substring(0, 10) + '...' : 'NÃO CONFIGURADO'}`);
console.log(`   WHATSAPP_INSTANCE: ${config.whatsappInstance || 'NÃO CONFIGURADO'}`);
console.log(`   WHATSAPP_CLIENT_TOKEN: ${config.whatsappClientToken ? config.whatsappClientToken.substring(0, 10) + '...' : 'NÃO CONFIGURADO ⚠️'}`);
console.log(`   PROFESSIONAL_WHATSAPP: ${config.professionalWhatsapp || 'NÃO CONFIGURADO'}\n`);

if (!config.whatsappClientToken) {
  console.log('⚠️  PROBLEMA: WHATSAPP_CLIENT_TOKEN não está configurado no .env!\n');
  console.log('💡 Adicione esta linha ao arquivo server/.env:\n');
  console.log('   WHATSAPP_CLIENT_TOKEN=F890b1a79d33e434f9daabc2b4a9cdd43S\n');
} else {
  console.log('✅ Client-Token está configurado!\n');
}

// Testar envio
if (config.whatsappClientToken) {
  console.log('🧪 Testando envio com Client-Token...\n');
  const { sendWhatsAppMessage } = require('./utils/whatsapp');
  
  const mensagem = `🧪 *TESTE DO FLOWGEST*\n\n✅ Sistema funcionando com Client-Token!\n\n📅 ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;
  
  sendWhatsAppMessage(config.professionalWhatsapp || '+5581994201799', mensagem)
    .then(result => {
      if (result.success) {
        console.log('✅ Mensagem enviada com sucesso!');
        console.log('📱 Verifique seu WhatsApp!\n');
      } else {
        console.log('❌ Erro:', result.error);
      }
    })
    .catch(error => {
      console.log('❌ Erro:', error.message);
    });
}

