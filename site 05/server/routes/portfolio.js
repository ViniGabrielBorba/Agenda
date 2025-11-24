const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Listar imagens do portfólio de um profissional
router.get('/professional/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;

    const images = await prisma.portfolioImage.findMany({
      where: {
        professionalId,
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(images);
  } catch (error) {
    console.error('Erro ao buscar portfólio:', error);
    res.status(500).json({ message: 'Erro ao buscar portfólio', error: error.message });
  }
});

// Criar imagem no portfólio (apenas profissional)
router.post('/', authenticate, authorize(['PROFESSIONAL', 'ADMIN']), [
  body('imageUrl').notEmpty().withMessage('URL da imagem é obrigatória'),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { imageUrl, title, description, category, order } = req.body;
    const professionalId = req.user.id;

    const image = await prisma.portfolioImage.create({
      data: {
        professionalId,
        imageUrl,
        title: title || null,
        description: description || null,
        category: category || null,
        order: order || 0,
        isVisible: true
      }
    });

    res.status(201).json({
      message: 'Imagem adicionada ao portfólio com sucesso',
      image
    });
  } catch (error) {
    console.error('Erro ao criar imagem no portfólio:', error);
    res.status(500).json({ message: 'Erro ao criar imagem no portfólio', error: error.message });
  }
});

// Atualizar imagem do portfólio
router.patch('/:id', authenticate, authorize(['PROFESSIONAL', 'ADMIN']), [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('order').optional().isInt({ min: 0 }),
  body('isVisible').optional().isBoolean()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, order, isVisible } = req.body;

    const image = await prisma.portfolioImage.findUnique({
      where: { id }
    });

    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    if (image.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Você não pode editar esta imagem' });
    }

    const updatedImage = await prisma.portfolioImage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible })
      }
    });

    res.json({
      message: 'Imagem atualizada com sucesso',
      image: updatedImage
    });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({ message: 'Erro ao atualizar imagem', error: error.message });
  }
});

// Deletar imagem do portfólio
router.delete('/:id', authenticate, authorize(['PROFESSIONAL', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const image = await prisma.portfolioImage.findUnique({
      where: { id }
    });

    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    if (image.professionalId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Você não pode deletar esta imagem' });
    }

    await prisma.portfolioImage.delete({
      where: { id }
    });

    res.json({ message: 'Imagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro ao deletar imagem', error: error.message });
  }
});

module.exports = router;

