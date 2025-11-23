// Integração com WhatsApp
// Suporta múltiplas APIs: Evolution API, Z-API, ChatAPI, Twilio, etc.

const axios = require('axios');
const { sendViaEvolutionAPI, sendViaZAPI, sendViaChatAPI } = require('./whatsapp-evolution');

/**
 * Envia mensagem WhatsApp para o cliente
 */
const sendWhatsAppMessage = async (phone, message) => {
  try {
    const whatsappApiUrl = process.env.WHATSAPP_API_URL;
    const whatsappApiKey = process.env.WHATSAPP_API_KEY;
    const whatsappInstance = process.env.WHATSAPP_INSTANCE || 'default';

    // Se não estiver configurado, apenas logar
    if (!whatsappApiUrl || !whatsappApiKey) {
      console.log(`📱 WhatsApp (simulado) para ${phone}: ${message}`);
      console.log('⚠️  Configure WHATSAPP_API_URL e WHATSAPP_API_KEY no .env para enviar mensagens reais');
      return { success: true, simulated: true };
    }

    const whatsappProvider = process.env.WHATSAPP_PROVIDER || 'auto';

    // Formatar número (remover caracteres especiais, adicionar código do país se necessário)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove tudo exceto números
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone; // Adiciona código do Brasil se não tiver
    }

    const config = {
      apiUrl: whatsappApiUrl,
      apiKey: whatsappApiKey,
      instance: whatsappInstance
    };

    let result;

    // Detectar provider automaticamente ou usar o configurado
    if (whatsappProvider === 'evolution' || whatsappApiUrl.includes('evolution') || whatsappApiUrl.includes('evo')) {
      result = await sendViaEvolutionAPI(phone, message, config);
      console.log(`✅ WhatsApp enviado para ${phone} via Evolution API`);
    } else if (whatsappProvider === 'zapi' || whatsappApiUrl.includes('z-api')) {
      result = await sendViaZAPI(phone, message, config);
      console.log(`✅ WhatsApp enviado para ${phone} via Z-API`);
    } else if (whatsappProvider === 'chatapi' || whatsappApiUrl.includes('chatapi')) {
      result = await sendViaChatAPI(phone, message, config);
      console.log(`✅ WhatsApp enviado para ${phone} via ChatAPI`);
    } else {
      // Tentar Evolution API como padrão
      try {
        result = await sendViaEvolutionAPI(phone, message, config);
        console.log(`✅ WhatsApp enviado para ${phone} via Evolution API (auto-detectado)`);
      } catch (error) {
        // Se falhar, tentar formato genérico
        const response = await axios.post(
          `${whatsappApiUrl}/send`,
          {
            phone: formattedPhone,
            message: message,
            instance: whatsappInstance
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${whatsappApiKey}`,
              'apikey': whatsappApiKey
            },
            timeout: 10000
          }
        );
        result = { success: true, response: response.data };
        console.log(`✅ WhatsApp enviado para ${phone} (formato genérico)`);
      }
    }

    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error.message);
    if (error.response) {
      console.error('Resposta da API:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
    }
    // Não lançar erro para não quebrar o fluxo principal
    return { success: false, error: error.message };
  }
};

/**
 * Envia notificação para o profissional quando há novo agendamento
 */
const sendNotificationToProfessional = async (professionalPhone, appointmentData) => {
  try {
    const message = `🎉 *NOVO AGENDAMENTO!*\n\n` +
      `👤 *Cliente:* ${appointmentData.client.name}\n` +
      `📞 *Telefone:* ${appointmentData.client.phone || 'Não informado'}\n` +
      `💅 *Serviço:* ${appointmentData.service.name}\n` +
      `📅 *Data:* ${new Date(appointmentData.startTime).toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}\n` +
      `⏰ *Horário:* ${new Date(appointmentData.startTime).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}\n` +
      `💰 *Valor:* R$ ${appointmentData.service.price.toFixed(2)}\n` +
      `⏱️ *Duração:* ${appointmentData.service.duration} minutos\n` +
      (appointmentData.notes ? `📝 *Observações:* ${appointmentData.notes}\n` : '') +
      `\n✨ FlowGest - Sistema de Agendamento`;

    await sendWhatsAppMessage(professionalPhone, message);
    console.log(`✅ Notificação enviada para o profissional: ${professionalPhone}`);
  } catch (error) {
    console.error('Erro ao enviar notificação para profissional:', error);
  }
};

module.exports = { sendWhatsAppMessage, sendNotificationToProfessional };

