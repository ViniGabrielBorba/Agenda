const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const prisma = new PrismaClient();

// Criar intenção de pagamento
router.post('/create-intent', authenticate, [
  body('appointmentId').notEmpty().isUUID(),
  body('method').isIn(['PIX', 'CREDIT_CARD', 'DEBIT_CARD'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId, method } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true, client: true }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    if (appointment.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Verificar se já existe pagamento
    const existingPayment = await prisma.payment.findUnique({
      where: { appointmentId }
    });

    if (existingPayment && existingPayment.status === 'PAID') {
      return res.status(400).json({ message: 'Agendamento já foi pago' });
    }

    const amount = appointment.service.price;

    // Para cartão de crédito/débito, usar Stripe
    if (method === 'CREDIT_CARD' || method === 'DEBIT_CARD') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // converter para centavos
        currency: 'brl',
        metadata: {
          appointmentId,
          userId: req.user.id
        }
      });

      // Criar registro de pagamento
      const payment = await prisma.payment.upsert({
        where: { appointmentId },
        update: {
          amount,
          method,
          status: 'PENDING',
          transactionId: paymentIntent.id
        },
        create: {
          appointmentId,
          amount,
          method,
          status: 'PENDING',
          transactionId: paymentIntent.id
        }
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      });
    }

    // Para PIX, gerar código (simulado - em produção usar API de PIX)
    if (method === 'PIX') {
      const pixCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999999${appointmentId.slice(0, 25)}5204000053039865802BR5925${appointment.service.name}6009SAO PAULO62070503***6304${Math.random().toString(36).substring(7).toUpperCase()}`;

      const payment = await prisma.payment.upsert({
        where: { appointmentId },
        update: {
          amount,
          method: 'PIX',
          status: 'PENDING',
          transactionId: pixCode
        },
        create: {
          appointmentId,
          amount,
          method: 'PIX',
          status: 'PENDING',
          transactionId: pixCode
        }
      });

      return res.json({
        pixCode,
        paymentId: payment.id,
        qrCode: `data:image/png;base64,${Buffer.from(pixCode).toString('base64')}` // QR code simulado
      });
    }

    res.status(400).json({ message: 'Método de pagamento inválido' });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

// Webhook do Stripe (para confirmar pagamentos)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const appointmentId = paymentIntent.metadata.appointmentId;

    await prisma.payment.update({
      where: { transactionId: paymentIntent.id },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    });

    // Atualizar status do agendamento
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' }
    });
  }

  res.json({ received: true });
});

// Confirmar pagamento PIX (manual ou via webhook)
router.post('/confirm-pix', authenticate, [
  body('paymentId').notEmpty().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { appointment: true }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    if (payment.method !== 'PIX') {
      return res.status(400).json({ message: 'Método de pagamento inválido' });
    }

    // Em produção, verificar com API de PIX se foi pago
    // Por enquanto, apenas atualizar manualmente (apenas admin)
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem confirmar pagamentos PIX' });
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    });

    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { status: 'CONFIRMED' }
    });

    res.json({ message: 'Pagamento confirmado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao confirmar pagamento' });
  }
});

// Obter status do pagamento
router.get('/:paymentId', authenticate, async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.paymentId },
      include: {
        appointment: {
          include: {
            client: true,
            service: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    // Verificar permissão
    if (payment.appointment.clientId !== req.user.id && 
        payment.appointment.professionalId !== req.user.id && 
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamento' });
  }
});

module.exports = router;

