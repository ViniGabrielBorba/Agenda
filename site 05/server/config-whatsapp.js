// Script para configurar WhatsApp no .env
// Execute: node config-whatsapp.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function configureWhatsApp() {
  console.log('🔧 Configuração do WhatsApp para FlowGest\n');
  console.log('Este script irá adicionar as configurações do WhatsApp ao arquivo .env\n');

  // Ler .env existente se houver
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Verificar se já existe configuração
  if (envContent.includes('WHATSAPP_API_URL')) {
    console.log('⚠️  Já existe configuração do WhatsApp no .env');
    const overwrite = await question('Deseja sobrescrever? (s/n): ');
    if (overwrite.toLowerCase() !== 's') {
      console.log('❌ Configuração cancelada');
      rl.close();
      return;
    }
    // Remover configurações antigas
    envContent = envContent.replace(/WHATSAPP.*\n/g, '');
    envContent = envContent.replace(/PROFESSIONAL_WHATSAPP.*\n/g, '');
  }

  console.log('\n📋 Escolha a API WhatsApp que deseja usar:\n');
  console.log('1. Evolution API (Recomendado - Gratuito)');
  console.log('2. Z-API (Brasil - Pago)');
  console.log('3. ChatAPI (Brasil - Pago)');
  console.log('4. Twilio (Internacional - Pago)');
  console.log('5. Outra API (configuração manual)');
  console.log('6. Modo de teste (sem API real)\n');

  const choice = await question('Digite o número da opção (1-6): ');

  let whatsappConfig = '';

  switch (choice) {
    case '1':
      console.log('\n📱 Evolution API');
      const evoUrl = await question('URL da Evolution API (ex: https://api.evolution.com): ');
      const evoKey = await question('API Key: ');
      const evoInstance = await question('Nome da instância (ou pressione Enter para "default"): ') || 'default';
      whatsappConfig = `# WhatsApp Configuration - Evolution API
WHATSAPP_API_URL=${evoUrl}
WHATSAPP_API_KEY=${evoKey}
WHATSAPP_INSTANCE=${evoInstance}
PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    case '2':
      console.log('\n📱 Z-API');
      const zapiUrl = await question('URL da Z-API (ex: https://api.z-api.io): ') || 'https://api.z-api.io';
      const zapiKey = await question('Client Token: ');
      whatsappConfig = `# WhatsApp Configuration - Z-API
WHATSAPP_API_URL=${zapiUrl}
WHATSAPP_API_KEY=${zapiKey}
PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    case '3':
      console.log('\n📱 ChatAPI');
      const chatapiUrl = await question('URL da ChatAPI (ex: https://api.chatapi.com.br): ') || 'https://api.chatapi.com.br';
      const chatapiKey = await question('Token: ');
      whatsappConfig = `# WhatsApp Configuration - ChatAPI
WHATSAPP_API_URL=${chatapiUrl}
WHATSAPP_API_KEY=${chatapiKey}
PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    case '4':
      console.log('\n📱 Twilio');
      const twilioSid = await question('Account SID: ');
      const twilioToken = await question('Auth Token: ');
      const twilioNumber = await question('WhatsApp Number (ex: +14155238886): ');
      whatsappConfig = `# WhatsApp Configuration - Twilio
TWILIO_ACCOUNT_SID=${twilioSid}
TWILIO_AUTH_TOKEN=${twilioToken}
TWILIO_WHATSAPP_NUMBER=${twilioNumber}
PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    case '5':
      console.log('\n📱 Configuração Manual');
      const manualUrl = await question('URL da API: ');
      const manualKey = await question('API Key/Token: ');
      const manualInstance = await question('Nome da instância (opcional, pressione Enter para pular): ') || '';
      whatsappConfig = `# WhatsApp Configuration - Manual
WHATSAPP_API_URL=${manualUrl}
WHATSAPP_API_KEY=${manualKey}
${manualInstance ? `WHATSAPP_INSTANCE=${manualInstance}\n` : ''}PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    case '6':
      console.log('\n📱 Modo de Teste');
      whatsappConfig = `# WhatsApp Configuration - Modo de Teste
# As mensagens serão apenas logadas no console
# Para ativar, configure uma API real acima
# WHATSAPP_API_URL=
# WHATSAPP_API_KEY=
PROFESSIONAL_WHATSAPP=+5581994201799
`;
      break;

    default:
      console.log('❌ Opção inválida');
      rl.close();
      return;
  }

  // Adicionar configuração ao .env
  if (!envContent.endsWith('\n') && envContent !== '') {
    envContent += '\n';
  }
  envContent += '\n' + whatsappConfig;

  // Salvar .env
  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('\n✅ Configuração do WhatsApp salva com sucesso!');
  console.log('📝 Arquivo: server/.env');
  console.log('\n📱 Número configurado para receber notificações: +55 81 994201799');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('1. Reinicie o servidor para aplicar as mudanças');
  console.log('2. Se escolheu uma API real, certifique-se de que ela está configurada e funcionando');
  console.log('3. No modo de teste, as mensagens aparecerão apenas nos logs do servidor\n');

  rl.close();
}

configureWhatsApp().catch(console.error);

