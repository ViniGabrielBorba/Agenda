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
 * Formato Z-API: https://api.z-api.io/instances/{instanceId}/token/{token}/send-text
 * Headers: Client-Token (token separado, diferente do token da URL)
 */
const sendViaZAPI = async (phone, message, config) => {
  try {
    const { apiUrl, apiKey, instance, clientToken } = config;
    // apiKey = Instance Token (usado na URL)
    // clientToken = Client-Token (usado no header)
    
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    // Z-API usa formato: /instances/{instanceId}/token/{instanceToken}/send-text
    // Client-Token vai no header
    
    let url;
    if (apiUrl.includes('/instances/') && apiUrl.includes('/token/')) {
      // URL já está no formato completo
      url = apiUrl;
      if (!url.endsWith('/send-text')) {
        url = url.replace(/\/$/, '') + '/send-text';
      }
    } else if (instance && apiKey) {
      // Construir URL com instance e token
      const baseUrl = apiUrl.replace(/\/instances\/.*$/, '').replace(/\/$/, '');
      url = `${baseUrl}/instances/${instance}/token/${apiKey}/send-text`;
    } else {
      // Formato antigo (compatibilidade)
      url = `${apiUrl}/send-text`;
    }

    // Headers: sempre incluir Client-Token se disponível
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Se tiver Client-Token configurado, usar ele
    if (clientToken) {
      headers['Client-Token'] = clientToken;
    } else if (apiKey) {
      // Fallback: tentar usar apiKey como Client-Token (pode funcionar em alguns casos)
      headers['Client-Token'] = apiKey;
    }

    const response = await axios.post(
      url,
      {
        phone: formattedPhone,
        message: message
      },
      {
        headers: headers,
        timeout: 15000
      }
    );

    return { success: true, response: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : '';
    throw new Error(`Z-API: ${errorMessage}${errorDetails ? '\n' + errorDetails : ''}`);
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

