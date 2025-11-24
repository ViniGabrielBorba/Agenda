// Script para enviar mensagem de teste usando o sistema FlowGest
// Execute: node enviar-mensagem-teste.js

require('dotenv').config({ path: './.env' });
const { sendWhatsAppMessage } = require('./utils/whatsapp');

async function enviarMensagemTeste() {
  console.log('📤 Enviando mensagem de teste via FlowGest...\n');

  const professionalPhone = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
  
  const mensagem = `🧪 *TESTE DO FLOWGEST*\n\n` +
    `✅ Backend está funcionando!\n\n` +
    `📅 Data: ${new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n` +
    `⏰ Horário: ${new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}\n\n` +
    `✨ Sistema de agendamento FlowGest está online!`;

  try {
    console.log(`📱 Enviando para: ${professionalPhone}`);
    console.log(`💬 Mensagem: ${mensagem}\n`);
    
    const result = await sendWhatsAppMessage(professionalPhone, mensagem);
    
    if (result.success) {
      console.log('✅ Mensagem enviada com sucesso!\n');
      console.log('📋 Resposta:', JSON.stringify(result, null, 2));
      console.log(`\n📱 Verifique seu WhatsApp: ${professionalPhone}\n`);
    } else {
      console.log('⚠️  Mensagem não foi enviada:');
      console.log('   Erro:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:\n');
    console.error('   Erro:', error.message);
    
    if (error.message.includes('client-token')) {
      console.log('\n💡 SOLUÇÃO:');
      console.log('   Configure o Client-Token no painel Z-API:');
      console.log('   1. Acesse: https://developer.z-api.io');
      console.log('   2. Instâncias → +55 81 994201799');
      console.log('   3. Aba "Segurança" ou "Configurações"');
      console.log('   4. Configure Client-Token: 23B770EAD3D54B9C0816D645');
      console.log('   5. Ative e Salve\n');
    }
  }
}

enviarMensagemTeste();

