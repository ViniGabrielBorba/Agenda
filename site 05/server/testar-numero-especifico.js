// Script para testar enviar mensagem para um número específico
// Execute: node testar-numero-especifico.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';
const NUMERO_TESTE = '+5581996687669'; // Número fornecido pelo usuário

async function testarNumeroEspecifico() {
  console.log('📱 Testando envio para número específico...\n');
  console.log('📋 Configuração:');
  console.log(`   Número: ${NUMERO_TESTE}`);
  console.log(`   Instância: ${INSTANCE_NAME}\n`);
  
  try {
    // Formatar número
    let numeroFormatado = NUMERO_TESTE.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    
    console.log(`📤 Enviando mensagem para: ${numeroFormatado}...\n`);
    
    const mensagem = `🧪 Teste do FlowGest

Olá! Esta é uma mensagem de teste do sistema FlowGest.

✅ Se você recebeu esta mensagem, o WhatsApp está funcionando perfeitamente!

Sistema: FlowGest - Agendamento Online
Data: ${new Date().toLocaleString('pt-BR')}

Esta é uma mensagem automática de teste.`;

    const response = await axios.post(
      `${API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        number: numeroFormatado,
        text: mensagem
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        },
        timeout: 15000
      }
    );
    
    console.log('✅ Mensagem enviada com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log('   ID da mensagem:', response.data.key?.id);
    console.log('   Número destino:', response.data.key?.remoteJid);
    console.log('   Timestamp:', new Date(response.data.messageTimestamp * 1000).toLocaleString('pt-BR'));
    console.log('\n📱 A pessoa deve receber a mensagem no WhatsApp agora!');
    console.log(`   Número: ${NUMERO_TESTE}\n`);
    
    console.log('✅ Sistema funcionando perfeitamente!');
    console.log('   Quando alguém agendar um serviço, você receberá a notificação.\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao enviar mensagem:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n💡 A instância pode não existir ou estar desconectada.');
      } else if (error.response.status === 400) {
        console.error('\n💡 Verifique se o número está no formato correto.');
      }
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

testarNumeroEspecifico();

