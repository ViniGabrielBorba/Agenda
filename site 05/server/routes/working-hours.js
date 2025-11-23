const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Listar horários de trabalho
router.get('/', authenticate, async (req, res) => {
  try {
    const { professionalId } = req.query;
    const targetId = professionalId || req.user.id;

    const workingHours = await prisma.workingHours.findMany({
      where: {
        professionalId: targetId,
        isActive: true
      },
      orderBy: { dayOfWeek: 'asc' }
    });

    res.json(workingHours);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar horários' });
  }
});

// Criar/atualizar horários de trabalho
router.post('/', authenticate, authorize('PROFESSIONAL', 'ADMIN'), [
  body('dayOfWeek').isInt({ min: 0, max: 6 }),
  body('startTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dayOfWeek, startTime, endTime } = req.body;

    const workingHours = await prisma.workingHours.upsert({
      where: {
        professionalId_dayOfWeek: {
          professionalId: req.user.id,
          dayOfWeek
        }
      },
      update: {
        startTime,
        endTime,
        isActive: true
      },
      create: {
        professionalId: req.user.id,
        dayOfWeek,
        startTime,
        endTime
      }
    });

    res.json({ message: 'Horário de trabalho salvo', workingHours });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar horário' });
  }
});

// Desativar horário
router.delete('/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const workingHours = await prisma.workingHours.findUnique({
      where: { id: req.params.id }
    });

    if (!workingHours) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }

    if (workingHours.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await prisma.workingHours.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ message: 'Horário desativado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desativar horário' });
  }
});

module.exports = router;

