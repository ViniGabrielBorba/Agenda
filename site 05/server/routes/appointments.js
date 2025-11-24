const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { sendConfirmationEmail } = require('../utils/email');
const { sendWhatsAppMessage, sendNotificationToProfessional } = require('../utils/whatsapp');

const router = express.Router();
const prisma = new PrismaClient();

// Listar agendamentos
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const where = {};

    // Clientes veem apenas seus agendamentos
    // Profissionais veem agendamentos deles
    if (req.user.role === 'CLIENT') {
      where.clientId = req.user.id;
    } else if (req.user.role === 'PROFESSIONAL' || req.user.role === 'ADMIN') {
      where.professionalId = req.user.id;
    }

    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.startTime = {
        ...where.startTime,
        lte: new Date(endDate)
      };
    }
    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Sempre retornar um array, mesmo que vazio
    res.json(appointments || []);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    // Retornar array vazio em caso de erro, não erro 500
    res.json([]);
  }
});

// Obter agendamento específico
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: true,
        payment: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    // Verificar permissão
    if (req.user.role === 'CLIENT' && appointment.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    if ((req.user.role === 'PROFESSIONAL' || req.user.role === 'ADMIN') && 
        appointment.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamento' });
  }
});

// Criar agendamento
router.post('/', authenticate, authorize('CLIENT', 'ADMIN'), [
  body('serviceId').notEmpty().withMessage('ID do serviço é obrigatório'),
  body('professionalId').notEmpty().withMessage('ID do profissional é obrigatório'),
  body('startTime').isISO8601().withMessage('Data/hora inválida'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, professionalId, startTime, notes } = req.body;

    console.log('📥 Dados recebidos para criar agendamento:', {
      serviceId,
      professionalId,
      startTime,
      clientId: req.user.id,
      notes: notes || null
    });

    // Verificar se serviço existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { professional: true }
    });

    console.log('🔍 Serviço encontrado:', service ? { id: service.id, name: service.name } : 'Não encontrado');

    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Serviço não encontrado ou inativo' });
    }

    // Verificar se profissional do serviço corresponde
    if (service.professionalId !== professionalId) {
      return res.status(400).json({ message: 'Profissional não oferece este serviço' });
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);

    // Verificar se horário está no passado
    if (startDateTime < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar no passado' });
    }

    // Verificar conflitos de horário
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        status: {
          not: 'CANCELLED'
        },
        OR: [
          {
            startTime: { lte: startDateTime },
            endTime: { gt: startDateTime }
          },
          {
            startTime: { lt: endDateTime },
            endTime: { gte: endDateTime }
          },
          {
            startTime: { gte: startDateTime },
            endTime: { lte: endDateTime }
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Horário já está ocupado' });
    }

    // Verificar horários bloqueados
    const blockedTime = await prisma.blockedTime.findFirst({
      where: {
        professionalId,
        startDateTime: { lte: startDateTime },
        endDateTime: { gt: startDateTime }
      }
    });

    if (blockedTime) {
      return res.status(400).json({ message: 'Horário bloqueado pelo profissional' });
    }

    // Verificar horário de trabalho
    const dayOfWeek = startDateTime.getDay();
    const timeString = startDateTime.toTimeString().slice(0, 5);

    const workingHours = await prisma.workingHours.findFirst({
      where: {
        professionalId,
        dayOfWeek,
        isActive: true,
        startTime: { lte: timeString },
        endTime: { gt: timeString }
      }
    });

    if (!workingHours) {
      return res.status(400).json({ message: 'Horário fora do expediente de trabalho' });
    }

    // Criar agendamento
    console.log('✨ Criando agendamento...');
    const appointment = await prisma.appointment.create({
      data: {
        clientId: req.user.id,
        serviceId,
        professionalId,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || null,
        status: 'PENDING'
      },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    console.log('✅ Agendamento criado com sucesso:', appointment.id);

    // Enviar confirmação para o cliente
    try {
      await sendConfirmationEmail(appointment);
      if (appointment.client.phone) {
        const clientMessage = `✅ *Agendamento Confirmado!*\n\n` +
          `💅 *Serviço:* ${appointment.service.name}\n` +
          `👤 *Profissional:* ${appointment.professional.name}\n` +
          `📅 *Data:* ${startDateTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}\n` +
          `⏰ *Horário:* ${startDateTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}\n` +
          `💰 *Valor:* R$ ${appointment.service.price.toFixed(2)}\n` +
          `⏱️ *Duração:* ${appointment.service.duration} minutos\n` +
          (notes ? `📝 *Observações:* ${notes}\n` : '') +
          `\n✨ Obrigado por escolher FlowGest!`;

        await sendWhatsAppMessage(appointment.client.phone, clientMessage);
      }
    } catch (emailError) {
      console.error('Erro ao enviar confirmação para cliente:', emailError);
      // Não falhar o agendamento se o email/WhatsApp falhar
    }

    // Enviar notificação para o profissional
    try {
      const professionalPhone = process.env.PROFESSIONAL_WHATSAPP || '+5581994201799';
      await sendNotificationToProfessional(professionalPhone, appointment);
    } catch (notificationError) {
      console.error('Erro ao enviar notificação para profissional:', notificationError);
      // Não falhar o agendamento se a notificação falhar
    }

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment
    });
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    console.error('Stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Erro ao criar agendamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Atualizar status do agendamento
router.patch('/:id/status', authenticate, [
  body('status').isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { client: true, professional: true, service: true }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    // Verificar permissão
    const canUpdate = 
      appointment.clientId === req.user.id ||
      appointment.professionalId === req.user.id ||
      req.user.role === 'ADMIN';

    if (!canUpdate) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { status } = req.body;

    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    // Notificar mudança de status
    try {
      if (status === 'CANCELLED') {
        // Notificar cancelamento
        if (updatedAppointment.client.phone) {
          const cancelMessage = `❌ *Agendamento Cancelado*\n\n` +
            `Seu agendamento foi cancelado:\n\n` +
            `💅 *Serviço:* ${updatedAppointment.service.name}\n` +
            `📅 *Data:* ${new Date(updatedAppointment.startTime).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}\n` +
            `⏰ *Horário:* ${new Date(updatedAppointment.startTime).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}\n\n` +
            `💬 Deseja reagendar? Entre em contato conosco!\n\n` +
            `✨ FlowGest`;
          await sendWhatsAppMessage(updatedAppointment.client.phone, cancelMessage);
        }
      } else if (status === 'CONFIRMED') {
        // Notificar confirmação
        await sendConfirmationEmail(updatedAppointment);
        if (updatedAppointment.client.phone) {
          const confirmMessage = `✅ *Agendamento Confirmado!*\n\n` +
            `Seu agendamento foi confirmado:\n\n` +
            `💅 *Serviço:* ${updatedAppointment.service.name}\n` +
            `👤 *Profissional:* ${updatedAppointment.professional.name}\n` +
            `📅 *Data:* ${new Date(updatedAppointment.startTime).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}\n` +
            `⏰ *Horário:* ${new Date(updatedAppointment.startTime).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}\n\n` +
            `✨ Nos vemos em breve!`;
          await sendWhatsAppMessage(updatedAppointment.client.phone, confirmMessage);
        }
      } else if (status === 'COMPLETED') {
        // Notificar conclusão e solicitar avaliação
        if (updatedAppointment.client.phone) {
          const completeMessage = `🎉 *Serviço Concluído!*\n\n` +
            `Obrigado por escolher FlowGest!\n\n` +
            `💅 *Serviço:* ${updatedAppointment.service.name}\n` +
            `👤 *Profissional:* ${updatedAppointment.professional.name}\n\n` +
            `⭐ Que tal avaliar nosso serviço? Sua opinião é muito importante para nós!\n\n` +
            `✨ FlowGest`;
          await sendWhatsAppMessage(updatedAppointment.client.phone, completeMessage);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }

    res.json({
      message: 'Status atualizado com sucesso',
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
});

// Reagendar
router.put('/:id/reschedule', authenticate, [
  body('startTime').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { service: true }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Não é possível reagendar este agendamento' });
    }

    const { startTime } = req.body;
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + appointment.service.duration * 60000);

    // Verificar conflitos (mesma lógica do create)
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId: appointment.professionalId,
        id: { not: appointment.id },
        status: { not: 'CANCELLED' },
        OR: [
          {
            startTime: { lte: startDateTime },
            endTime: { gt: startDateTime }
          },
          {
            startTime: { lt: endDateTime },
            endTime: { gte: endDateTime }
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Horário já está ocupado' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        startTime: startDateTime,
        endTime: endDateTime
      },
      include: {
        client: true,
        professional: true,
        service: true
      }
    });

    // Enviar notificação de remarcação
    try {
      await sendConfirmationEmail(updatedAppointment);
      if (updatedAppointment.client.phone) {
        const rescheduleMessage = `🔄 *Agendamento Remarcado!*\n\n` +
          `Seu agendamento foi remarcado para:\n\n` +
          `💅 *Serviço:* ${updatedAppointment.service.name}\n` +
          `👤 *Profissional:* ${updatedAppointment.professional.name}\n` +
          `📅 *Nova Data:* ${new Date(updatedAppointment.startTime).toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          })}\n` +
          `⏰ *Novo Horário:* ${new Date(updatedAppointment.startTime).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}\n` +
          `💰 *Valor:* R$ ${updatedAppointment.service.price.toFixed(2)}\n\n` +
          `✨ Anote na sua agenda!`;
        await sendWhatsAppMessage(updatedAppointment.client.phone, rescheduleMessage);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }

    res.json({
      message: 'Agendamento reagendado com sucesso',
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao reagendar' });
  }
});

// Obter horários disponíveis
router.get('/availability/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ message: 'Data e serviceId são obrigatórios' });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Buscar horário de trabalho
    const workingHours = await prisma.workingHours.findFirst({
      where: {
        professionalId,
        dayOfWeek,
        isActive: true
      }
    });

    if (!workingHours) {
      return res.json({ availableSlots: [] });
    }

    // Buscar agendamentos do dia
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          notIn: ['CANCELLED'] // Excluir apenas cancelados, manter outros ocupados
        }
      }
    });

    // Buscar horários bloqueados
    const blockedTimes = await prisma.blockedTime.findMany({
      where: {
        professionalId,
        startDateTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    // Gerar slots disponíveis
    const [startHour, startMinute] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

    const availableSlots = [];
    const interval = 30; // intervalo de 30 minutos

    let currentTime = new Date(targetDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(targetDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + service.duration * 60000);

      if (slotEnd <= endTime) {
        // Verificar se não conflita com agendamentos
        const hasConflict = appointments.some(apt => {
          const aptStart = new Date(apt.startTime);
          const aptEnd = new Date(apt.endTime);
          // Conflito se o slot se sobrepõe ao agendamento
          return (currentTime < aptEnd && slotEnd > aptStart);
        });

        // Verificar se não está bloqueado
        const isBlocked = blockedTimes.some(blocked => {
          const blockedStart = new Date(blocked.startDateTime);
          const blockedEnd = new Date(blocked.endDateTime);
          return (currentTime < blockedEnd && slotEnd > blockedStart);
        });

        // Verificar se não é no passado
        const isPast = currentTime <= new Date();

        if (!hasConflict && !isBlocked && !isPast) {
          availableSlots.push(new Date(currentTime));
        }
      }

      currentTime = new Date(currentTime.getTime() + interval * 60000);
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ message: 'Erro ao buscar disponibilidade' });
  }
});

// Excluir agendamento
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { client: true, professional: true, service: true }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    // Verificar permissão - apenas o cliente dono do agendamento ou admin pode excluir
    const canDelete = 
      appointment.clientId === req.user.id ||
      req.user.role === 'ADMIN';

    if (!canDelete) {
      return res.status(403).json({ message: 'Acesso negado. Apenas o cliente dono do agendamento pode excluí-lo.' });
    }

    // Verificar se o agendamento já foi concluído ou está muito próximo
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    // Se o agendamento já passou ou está muito próximo (menos de 1 hora), não permitir exclusão
    if (appointmentTime < now) {
      return res.status(400).json({ message: 'Não é possível excluir um agendamento que já passou' });
    }

    if (hoursUntilAppointment < 1 && appointment.status !== 'CANCELLED') {
      return res.status(400).json({ message: 'Não é possível excluir um agendamento com menos de 1 hora de antecedência' });
    }

    // Excluir o agendamento
    await prisma.appointment.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
});

module.exports = router;

