const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Listar avaliações de um profissional
router.get('/professional/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        professionalId,
        isVisible: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        appointment: {
          include: {
            service: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Calcular média de avaliações
    const stats = await prisma.review.aggregate({
      where: {
        professionalId,
        isVisible: true
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    res.json({
      reviews,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
});

// Criar avaliação (após agendamento completado)
router.post('/', authenticate, [
  body('appointmentId').notEmpty().withMessage('ID do agendamento é obrigatório'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comentário muito longo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId, rating, comment } = req.body;
    const clientId = req.user.id;

    // Verificar se o agendamento existe e pertence ao cliente
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        professional: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    if (appointment.clientId !== clientId) {
      return res.status(403).json({ message: 'Você não pode avaliar este agendamento' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Apenas agendamentos completados podem ser avaliados' });
    }

    // Verificar se já existe avaliação
    const existingReview = await prisma.review.findUnique({
      where: { appointmentId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Este agendamento já foi avaliado' });
    }

    // Criar avaliação
    const review = await prisma.review.create({
      data: {
        appointmentId,
        professionalId: appointment.professionalId,
        clientId,
        rating,
        comment: comment || null,
        isVisible: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Avaliação criada com sucesso',
      review
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ message: 'Erro ao criar avaliação', error: error.message });
  }
});

// Atualizar avaliação (própria avaliação)
router.patch('/:id', authenticate, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    if (review.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Você não pode editar esta avaliação' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment })
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'Avaliação atualizada com sucesso',
      review: updatedReview
    });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ message: 'Erro ao atualizar avaliação', error: error.message });
  }
});

// Deletar avaliação (própria avaliação)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    if (review.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Você não pode deletar esta avaliação' });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ message: 'Erro ao deletar avaliação', error: error.message });
  }
});

module.exports = router;

