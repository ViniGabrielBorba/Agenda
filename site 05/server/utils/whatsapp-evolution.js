// Integração com Evolution API - Solução mais simples e gratuita
// Evolution API é a solução mais popular e gratuita no Brasil

const axios = require('axios');

/**
 * Envia mensagem via Evolution API
 * Evolution API é gratuita e open-source
 * Documentação: https://doc.evolution-api.com/
 */
const sendViaEvolutionAPI = async (phone, message, config) => {
  try {
    const { apiUrl, apiKey, instance } = config;
    
    // Formatar número (remover caracteres especiais, adicionar código do país)
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    // Evolution API endpoint - Send Text Message
    // Documentação: https://doc.evolution-api.com/docs/api/message/send-text
    const url = `${apiUrl}/message/sendText/${instance}`;
    
    const response = await axios.post(
      url,
      {
        number: formattedPhone,
        text: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        },
        timeout: 15000 // 15 segundos
      }
    );

    return { success: true, response: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : '';
    throw new Error(`Evolution API: ${errorMessage}${errorDetails ? '\n' + errorDetails : ''}`);
  }
};

/**
 * Envia mensagem via Z-API
 */
const sendViaZAPI = async (phone, message, config) => {
  try {
    const { apiUrl, apiKey } = config;
    
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    const response = await axios.post(
      `${apiUrl}/send-text`,
      {
        phone: formattedPhone,
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': apiKey
        },
        timeout: 10000
      }
    );

    return { success: true, response: response.data };
  } catch (error) {
    throw new Error(`Z-API: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Envia mensagem via ChatAPI
 */
const sendViaChatAPI = async (phone, message, config) => {
  try {
    const { apiUrl, apiKey } = config;
    
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    const response = await axios.post(
      `${apiUrl}/send-text`,
      {
        phone: formattedPhone,
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      }
    );

    return { success: true, response: response.data };
  } catch (error) {
    throw new Error(`ChatAPI: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = {
  sendViaEvolutionAPI,
  sendViaZAPI,
  sendViaChatAPI
};

