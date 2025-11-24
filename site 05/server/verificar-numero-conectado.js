// Script para verificar qual número está conectado à instância
// Execute: node verificar-numero-conectado.js

require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.WHATSAPP_API_KEY || 'FlowGest2024SecretKey!';
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'FlowGest';

async function verificarNumero() {
  console.log('🔍 Verificando número conectado à instância...\n');
  
  try {
    // 1. Verificar status da conexão
    console.log('1️⃣ Verificando status da conexão...');
    const statusResponse = await axios.get(
      `${API_URL}/instance/connectionState/${INSTANCE_NAME}`,
      {
        headers: {
          'apikey': API_KEY
        },
        timeout: 5000
      }
    );
    
    console.log('✅ Status:', statusResponse.data.state);
    console.log('📋 Dados completos:', JSON.stringify(statusResponse.data, null, 2));
    
    // 2. Listar instâncias para ver o número
    console.log('\n2️⃣ Listando instâncias...');
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
    
    if (instancia) {
      console.log('\n📱 Informações da instância:');
      console.log('   Nome:', instancia.name || instancia.instanceName);
      console.log('   Número:', instancia.number || 'Não informado');
      console.log('   Status:', instancia.connectionStatus || instancia.state);
      console.log('   Owner JID:', instancia.ownerJid || 'Não informado');
      
      if (instancia.ownerJid) {
        // Extrair número do JID (formato: 5581994201799@s.whatsapp.net)
        const numeroDoJid = instancia.ownerJid.split('@')[0];
        console.log('\n💡 Número conectado (do JID):', numeroDoJid);
        console.log('   Formato para usar:', `+${numeroDoJid}`);
      }
      
      if (instancia.number) {
        console.log('\n💡 Número configurado:', instancia.number);
      }
    }
    
    // 3. Tentar obter informações do perfil
    console.log('\n3️⃣ Tentando obter informações do perfil...');
    try {
      const profileResponse = await axios.get(
        `${API_URL}/chat/fetchProfile/${INSTANCE_NAME}`,
        {
          headers: {
            'apikey': API_KEY
          },
          params: {
            number: '5581994201799' // Tentar com o número configurado
          },
          timeout: 5000
        }
      );
      console.log('✅ Perfil:', JSON.stringify(profileResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️  Não foi possível obter perfil:', error.response?.status || error.message);
    }
    
    // 4. Verificar número no .env
    console.log('\n4️⃣ Verificando configuração do .env:');
    const professionalPhone = process.env.PROFESSIONAL_WHATSAPP || 'Não configurado';
    console.log('   PROFESSIONAL_WHATSAPP:', professionalPhone);
    
    // Formatar número para comparação
    const numeroEnv = professionalPhone.replace(/\D/g, '');
    console.log('   Número (apenas dígitos):', numeroEnv);
    
    console.log('\n💡 Dica:');
    console.log('   O número no PROFESSIONAL_WHATSAPP deve ser o número');
    console.log('   do WhatsApp que você escaneou o QR Code!');
    console.log('   Formato: +5581994201799 (com código do país)\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

verificarNumero();

