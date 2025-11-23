const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendReminderEmail } = require('../utils/email');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

const prisma = new PrismaClient();

// Executar a cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Verificando lembretes de agendamentos...');
  
  try {
    const now = new Date();
    
    // Lembrete 24 horas antes
    const reminder24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const reminder1h = new Date(now.getTime() + 60 * 60 * 1000);

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
      try {
        await sendReminderEmail(appointment, 24);
        if (appointment.client.phone) {
          await sendWhatsAppMessage(
            appointment.client.phone,
            `Lembrete: Você tem um agendamento amanhã às ${new Date(appointment.startTime).toLocaleTimeString('pt-BR')} - ${appointment.service.name}`
          );
        }
      } catch (error) {
        console.error(`Erro ao enviar lembrete 24h para agendamento ${appointment.id}:`, error);
      }
    }

    // Enviar lembretes de 1h
    for (const appointment of appointments1h) {
      try {
        await sendReminderEmail(appointment, 1);
        if (appointment.client.phone) {
          await sendWhatsAppMessage(
            appointment.client.phone,
            `Lembrete: Você tem um agendamento em 1 hora às ${new Date(appointment.startTime).toLocaleTimeString('pt-BR')} - ${appointment.service.name}`
          );
        }
      } catch (error) {
        console.error(`Erro ao enviar lembrete 1h para agendamento ${appointment.id}:`, error);
      }
    }

    console.log(`Lembretes processados: ${appointments24h.length} (24h) e ${appointments1h.length} (1h)`);
  } catch (error) {
    console.error('Erro ao processar lembretes:', error);
  }
});

console.log('Sistema de lembretes iniciado');

