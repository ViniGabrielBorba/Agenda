const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Listar serviços (público ou filtrado por profissional)
router.get('/', async (req, res) => {
  try {
    const { professionalId } = req.query;

    const where = {
      isActive: true,
      ...(professionalId && { professionalId })
    };

    const services = await prisma.service.findMany({
      where,
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
});

// Obter serviço específico
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar serviço' });
  }
});

// Criar serviço (apenas profissionais/admin)
router.post('/', authenticate, authorize('PROFESSIONAL', 'ADMIN'), [
  body('name').trim().notEmpty(),
  body('duration').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, duration, price } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        professionalId: req.user.id
      }
    });

    res.status(201).json({ message: 'Serviço criado com sucesso', service });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar serviço' });
  }
});

// Atualizar serviço
router.put('/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN'), [
  body('name').optional().trim().notEmpty(),
  body('duration').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Verificar se o usuário é o dono do serviço ou admin
    if (service.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { name, description, duration, price, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration) updateData.duration = duration;
    if (price !== undefined) updateData.price = price;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedService = await prisma.service.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({ message: 'Serviço atualizado com sucesso', service: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar serviço' });
  }
});

// Deletar serviço (hard delete)
router.delete('/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    if (service.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Verificar se há agendamentos futuros com este serviço
    const futureAppointments = await prisma.appointment.findFirst({
      where: {
        serviceId: req.params.id,
        startTime: { gte: new Date() },
        status: { not: 'CANCELLED' }
      }
    });

    if (futureAppointments) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este serviço pois há agendamentos futuros. Desative o serviço ao invés de excluí-lo.' 
      });
    }

    await prisma.service.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ message: 'Erro ao excluir serviço' });
  }
});

module.exports = router;

