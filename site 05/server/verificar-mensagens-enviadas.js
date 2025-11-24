// Script para verificar mensagens enviadas e para qual número
// Execute: node verificar-mensagens-enviadas.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function verificarMensagens() {
  console.log('🔍 Verificando mensagens enviadas...\n');
  
  try {
    // 1. Verificar instância
    console.log('1️⃣ Verificando instância...');
    const instancesResponse = await axios.get(
      `${API_URL}/instance/fetchInstances`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    const instances = instancesResponse.data || [];
    const instancia = instances.find(inst => 
      (inst.name === INSTANCE_NAME) || (inst.instanceName === INSTANCE_NAME)
    );
    
    if (!instancia) {
      console.log('❌ Instância não encontrada!');
      return;
    }
    
    console.log('✅ Instância encontrada:', instancia.name || instancia.instanceName);
    console.log('   Status:', instancia.connectionStatus || instancia.state);
    console.log('   Owner JID:', instancia.ownerJid || 'Não informado');
    
    if (instancia.ownerJid) {
      const numeroConectado = instancia.ownerJid.split('@')[0];
      console.log('   Número conectado:', numeroConectado);
      console.log('   Formato completo:', `+${numeroConectado}`);
    }
    
    // 2. Verificar número no .env
    const envNumber = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
    const envNumberClean = envNumber.replace(/\D/g, '');
    console.log('\n2️⃣ Número configurado no .env:');
    console.log('   PROFESSIONAL_WHATSAPP:', envNumber);
    console.log('   Apenas dígitos:', envNumberClean);
    
    // 3. Comparar
    if (instancia.ownerJid) {
      const numeroConectado = instancia.ownerJid.split('@')[0];
      const numeroConectadoClean = numeroConectado.replace(/\D/g, '');
      
      console.log('\n3️⃣ Comparação:');
      console.log('   Número conectado:', numeroConectadoClean);
      console.log('   Número no .env:', envNumberClean);
      
      if (numeroConectadoClean !== envNumberClean) {
        console.log('\n⚠️  PROBLEMA ENCONTRADO!');
        console.log('   Os números são DIFERENTES!');
        console.log(`   Mensagens estão sendo enviadas para: ${numeroConectadoClean}`);
        console.log(`   Mas você espera receber em: ${envNumberClean}`);
        console.log('\n💡 SOLUÇÃO:');
        console.log(`   Atualize o .env com: PROFESSIONAL_WHATSAPP=+${numeroConectado}\n`);
      } else {
        console.log('\n✅ Números são iguais!');
        console.log('   O problema pode ser outro...\n');
      }
    }
    
    // 4. Tentar obter chats/mensagens
    console.log('4️⃣ Tentando verificar mensagens...');
    try {
      // Tentar listar chats
      const chatsResponse = await axios.get(
        `${API_URL}/chat/fetchChats/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          params: {
            page: 1,
            limit: 10
          },
          timeout: 5000
        }
      );
      
      console.log('   Chats encontrados:', chatsResponse.data?.length || 0);
      if (chatsResponse.data && chatsResponse.data.length > 0) {
        console.log('\n   Últimos chats:');
        chatsResponse.data.slice(0, 5).forEach((chat, index) => {
          console.log(`   ${index + 1}. ${chat.id || chat.jid || 'N/A'}`);
        });
      }
    } catch (error) {
      console.log('   ⚠️  Não foi possível listar chats:', error.response?.status || error.message);
    }
    
    console.log('\n💡 Dica:');
    console.log('   Se os números forem diferentes, atualize o .env');
    console.log('   Se forem iguais, o problema pode ser:');
    console.log('   - WhatsApp bloqueando mensagens para você mesmo');
    console.log('   - Número incorreto no WhatsApp');
    console.log('   - Mensagem indo para outro dispositivo\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

verificarMensagens();

