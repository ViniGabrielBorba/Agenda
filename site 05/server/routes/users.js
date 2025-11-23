const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter perfil do usuário
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

// Atualizar perfil
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().trim(),
  body('avatar').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) {
      // Verificar se telefone já está em uso
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          NOT: { id: req.user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Telefone já está em uso' });
      }
      updateData.phone = phone;
    }
    if (avatar) updateData.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true
      }
    });

    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// Alterar senha
router.put('/password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
});

// Listar profissionais (para clientes escolherem)
router.get('/professionals', authenticate, async (req, res) => {
  try {
    const professionals = await prisma.user.findMany({
      where: {
        role: {
          in: ['PROFESSIONAL', 'ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      }
    });

    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar profissionais' });
  }
});

module.exports = router;

