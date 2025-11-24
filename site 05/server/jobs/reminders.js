const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendReminderEmail } = require('../utils/email');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

const prisma = new PrismaClient();

// Armazenar IDs de agendamentos que já receberam lembretes (para evitar duplicatas)
const sentReminders = new Set();

// Função para formatar mensagem de lembrete
const formatReminderMessage = (appointment, hoursBefore) => {
  const date = new Date(appointment.startTime);
  const dateStr = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (hoursBefore === 24) {
    return `🔔 *Lembrete FlowGest*\n\n` +
      `Você tem um agendamento *amanhã*:\n\n` +
      `💅 *Serviço:* ${appointment.service.name}\n` +
      `👤 *Profissional:* ${appointment.professional.name}\n` +
      `📅 *Data:* ${dateStr}\n` +
      `⏰ *Horário:* ${timeStr}\n` +
      `💰 *Valor:* R$ ${appointment.service.price.toFixed(2)}\n\n` +
      `✨ Não esqueça! Estamos ansiosos para te atender!`;
  } else if (hoursBefore === 1) {
    return `⏰ *Lembrete Urgente FlowGest*\n\n` +
      `Seu agendamento é em *1 hora*:\n\n` +
      `💅 *Serviço:* ${appointment.service.name}\n` +
      `👤 *Profissional:* ${appointment.professional.name}\n` +
      `⏰ *Horário:* ${timeStr}\n\n` +
      `🚀 Nos vemos em breve!`;
  } else {
    return `🔔 *Lembrete FlowGest*\n\n` +
      `Você tem um agendamento em *${hoursBefore} horas*:\n\n` +
      `💅 *Serviço:* ${appointment.service.name}\n` +
      `⏰ *Horário:* ${timeStr}`;
  }
};

// Executar a cada hora
cron.schedule('0 * * * *', async () => {
  console.log('🔔 Verificando lembretes de agendamentos...');
  
  try {
    const now = new Date();
    
    // Lembrete 24 horas antes
    const reminder24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Lembrete 1 hora antes
    const reminder1h = new Date(now.getTime() + 60 * 60 * 1000);
    // Lembrete 2 horas antes (novo)
    const reminder2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Buscar agendamentos para lembrete de 24h
    const appointments24h = await prisma.appointment.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        startTime: {
          gte: new Date(reminder24h.getTime() - 30 * 60 * 1000), // 30 min de margem
          lte: new Date(reminder24h.getTime() + 30 * 60 * 1000)
        }
      },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    // Buscar agendamentos para lembrete de 2h
    const appointments2h = await prisma.appointment.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        startTime: {
          gte: new Date(reminder2h.getTime() - 15 * 60 * 1000),
          lte: new Date(reminder2h.getTime() + 15 * 60 * 1000)
        }
      },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    // Buscar agendamentos para lembrete de 1h
    const appointments1h = await prisma.appointment.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        startTime: {
          gte: new Date(reminder1h.getTime() - 15 * 60 * 1000), // 15 min de margem
          lte: new Date(reminder1h.getTime() + 15 * 60 * 1000)
        }
      },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    // Enviar lembretes de 24h
    for (const appointment of appointments24h) {
      const reminderKey = `${appointment.id}-24h`;
      if (!sentReminders.has(reminderKey)) {
        try {
          await sendReminderEmail(appointment, 24);
          if (appointment.client.phone) {
            const message = formatReminderMessage(appointment, 24);
            await sendWhatsAppMessage(appointment.client.phone, message);
          }
          sentReminders.add(reminderKey);
          console.log(`✅ Lembrete 24h enviado para agendamento ${appointment.id}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar lembrete 24h para agendamento ${appointment.id}:`, error);
        }
      }
    }

    // Enviar lembretes de 2h
    for (const appointment of appointments2h) {
      const reminderKey = `${appointment.id}-2h`;
      if (!sentReminders.has(reminderKey)) {
        try {
          if (appointment.client.phone) {
            const message = formatReminderMessage(appointment, 2);
            await sendWhatsAppMessage(appointment.client.phone, message);
          }
          sentReminders.add(reminderKey);
          console.log(`✅ Lembrete 2h enviado para agendamento ${appointment.id}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar lembrete 2h para agendamento ${appointment.id}:`, error);
        }
      }
    }

    // Enviar lembretes de 1h
    for (const appointment of appointments1h) {
      const reminderKey = `${appointment.id}-1h`;
      if (!sentReminders.has(reminderKey)) {
        try {
          await sendReminderEmail(appointment, 1);
          if (appointment.client.phone) {
            const message = formatReminderMessage(appointment, 1);
            await sendWhatsAppMessage(appointment.client.phone, message);
          }
          sentReminders.add(reminderKey);
          console.log(`✅ Lembrete 1h enviado para agendamento ${appointment.id}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar lembrete 1h para agendamento ${appointment.id}:`, error);
        }
      }
    }

    // Limpar lembretes antigos (mais de 48h)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    for (const key of sentReminders) {
      // Se o agendamento já passou, remover da memória
      // (implementação simplificada - em produção, usar banco de dados)
    }

    console.log(`📊 Lembretes processados: ${appointments24h.length} (24h), ${appointments2h.length} (2h), ${appointments1h.length} (1h)`);
  } catch (error) {
    console.error('❌ Erro ao processar lembretes:', error);
  }
});

// Limpar cache de lembretes diariamente (meia-noite)
cron.schedule('0 0 * * *', () => {
  sentReminders.clear();
  console.log('🧹 Cache de lembretes limpo');
});

console.log('✅ Sistema de lembretes inteligentes iniciado');

