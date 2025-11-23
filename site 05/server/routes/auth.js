const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Registro
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 }),
  body('password').isLength({ min: 6 }),
  body('phone').optional().trim(),
  body('role').optional().isIn(['CLIENT', 'PROFESSIONAL', 'ADMIN']).withMessage('Role deve ser CLIENT, PROFESSIONAL ou ADMIN')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone, role } = req.body;
    
    // Normalizar role
    const normalizedRole = role && ['CLIENT', 'PROFESSIONAL', 'ADMIN'].includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'CLIENT';

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email ou telefone já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const userData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      role: normalizedRole
    };
    
    // Adicionar phone apenas se fornecido
    if (phone && phone.trim() !== '') {
      userData.phone = phone.trim();
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true
      }
    });

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Erro ao criar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', [
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password } = req.body;
    
    // Limpar espaços em branco
    const cleanEmail = email ? email.trim() : null;
    const cleanPhone = phone ? phone.trim() : null;
    const cleanPassword = password ? password.trim() : null;
    
    console.log('📥 Dados recebidos:', { 
      email: cleanEmail ? cleanEmail.substring(0, 20) + '...' : null, 
      phone: cleanPhone ? 'fornecido' : null, 
      hasPassword: !!cleanPassword 
    });

    if (!cleanEmail && !cleanPhone) {
      return res.status(400).json({ message: 'Email ou telefone é obrigatório' });
    }

    if (!cleanPassword) {
      return res.status(400).json({ message: 'Senha é obrigatória' });
    }

    // Normalizar email se fornecido
    const normalizedEmail = cleanEmail ? cleanEmail.toLowerCase().trim() : null;
    console.log('📧 Email normalizado:', normalizedEmail);
    
    // Buscar usuário
    let user;
    try {
      user = await prisma.user.findFirst({
        where: normalizedEmail ? { email: normalizedEmail } : { phone: cleanPhone }
      });
    } catch (dbError) {
      console.error('Erro ao buscar usuário no banco:', dbError);
      console.error('DB Error name:', dbError.name);
      console.error('DB Error message:', dbError.message);
      console.error('DB Error code:', dbError.code);
      
      // Verificar se é erro de conexão
      if (dbError.message && dbError.message.includes('Server selection timeout')) {
        return res.status(503).json({ 
          message: 'Erro de conexão com o banco de dados. Verifique sua conexão com a internet e as configurações do MongoDB Atlas.',
          error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }
      
      return res.status(500).json({ 
        message: 'Erro ao buscar usuário no banco de dados',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    if (!user) {
      console.log('❌ Usuário não encontrado para:', normalizedEmail || phone);
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    console.log('✅ Usuário encontrado:', user.email, 'Role:', user.role);

    // Verificar senha
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(cleanPassword, user.password);
      console.log('🔐 Resultado da verificação de senha:', isValidPassword ? '✅ Válida' : '❌ Inválida');
    } catch (bcryptError) {
      console.error('❌ Erro ao comparar senha:', bcryptError);
      return res.status(500).json({ message: 'Erro ao verificar senha' });
    }
    
    if (!isValidPassword) {
      console.log('❌ Senha incorreta para usuário:', user.email);
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    
    console.log('✅ Senha válida! Prosseguindo com geração de token...');

    // Verificar se JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definido no .env');
      return res.status(500).json({ message: 'Erro de configuração do servidor' });
    }

    // Gerar token
    let token;
    try {
      token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
    } catch (jwtError) {
      console.error('Erro ao gerar token:', jwtError);
      return res.status(500).json({ message: 'Erro ao gerar token de autenticação' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    console.error('Stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
});

// Verificar token
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

