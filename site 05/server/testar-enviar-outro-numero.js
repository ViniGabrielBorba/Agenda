// Script para testar enviar para outro número ou verificar o problema
// Execute: node testar-enviar-outro-numero.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function testarEnvio() {
  console.log('🧪 Testando envio de mensagem...\n');
  
  const numeroTeste = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
  let numeroFormatado = numeroTeste.replace(/\D/g, '');
  if (!numeroFormatado.startsWith('55')) {
    numeroFormatado = '55' + numeroFormatado;
  }
  
  console.log('📋 Configuração:');
  console.log(`   Número destino: ${numeroFormatado}`);
  console.log(`   Formato completo: +${numeroFormatado}\n`);
  
  // Tentar diferentes formatos
  const formatos = [
    numeroFormatado, // 5581994201799
    numeroFormatado.substring(2), // 81994201799 (sem código do país)
    `55${numeroFormatado.substring(2)}`, // 5581994201799 (garantir código)
  ];
  
  for (let i = 0; i < formatos.length; i++) {
    const formato = formatos[i];
    console.log(`\n${i + 1}️⃣ Tentando enviar para: ${formato}...`);
    
    try {
      const mensagem = `🧪 Teste FlowGest - Formato ${i + 1}

Esta é uma mensagem de teste.

Formato usado: ${formato}
Data: ${new Date().toLocaleString('pt-BR')}

Se você recebeu esta mensagem, este formato funciona! ✅`;
      
      const response = await axios.post(
        `${API_URL}/message/sendText/${INSTANCE_NAME}`,
        {
          number: formato,
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
      
      console.log('   ✅ Mensagem enviada com sucesso!');
      console.log('   ID:', response.data.key?.id);
      console.log('   Remote JID:', response.data.key?.remoteJid);
      
      if (response.data.key?.remoteJid) {
        const numeroRecebido = response.data.key.remoteJid.split('@')[0];
        console.log('   Número que recebeu:', numeroRecebido);
      }
      
    } catch (error) {
      console.log('   ❌ Erro:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('   Detalhes:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    if (i < formatos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n💡 IMPORTANTE:');
  console.log('   O WhatsApp pode BLOQUEAR mensagens enviadas para você mesmo.');
  console.log('   Isso é uma proteção do WhatsApp.');
  console.log('\n💡 SOLUÇÕES:');
  console.log('   1. Envie para outro número de teste');
  console.log('   2. Verifique se a mensagem aparece em "Aparelhos conectados"');
  console.log('   3. Verifique se está no WhatsApp correto\n');
}

testarEnvio();

