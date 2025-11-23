const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { SERVICES_CONFIG } = require('../config/services');

const router = express.Router();
const prisma = new PrismaClient();

// Popular serviços padrão para um profissional
router.post('/setup-default', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    // Verificar serviços existentes
    const existingServices = await prisma.service.findMany({
      where: { professionalId: req.user.id }
    });

    // Criar todos os serviços
    const allServices = []
    
    SERVICES_CONFIG.categories.forEach(category => {
      category.services.forEach(service => {
        allServices.push({
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          professionalId: req.user.id,
          isActive: true
        })
      })
    })

    // Criar serviços que ainda não existem
    let created = 0
    for (const service of allServices) {
      const exists = existingServices.some(s => s.name === service.name)
      if (!exists) {
        try {
          await prisma.service.create({ data: service })
          created++
        } catch (error) {
          console.error(`Erro ao criar serviço ${service.name}:`, error)
        }
      }
    }
    
    // Buscar todos os serviços
    const services = await prisma.service.findMany({
      where: { professionalId: req.user.id },
      orderBy: { name: 'asc' }
    });

    res.json({
      message: `Serviços padrão criados com sucesso! ${created} novos serviços adicionados.`,
      created,
      total: services.length,
      services
    });
  } catch (error) {
    console.error('Erro ao criar serviços padrão:', error);
    res.status(500).json({ message: 'Erro ao criar serviços padrão', error: error.message });
  }
});

// Obter serviços organizados por categoria
router.get('/by-category', async (req, res) => {
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

    // Organizar por categoria baseado no nome
    const categorized = SERVICES_CONFIG.categories.map(category => {
      const categoryServices = services.filter(service => {
        // Verificar se o serviço pertence a esta categoria
        return category.services.some(catService => 
          service.name.toLowerCase().includes(catService.name.toLowerCase().substring(0, 10))
        );
      });

      return {
        ...category,
        services: categoryServices.length > 0 ? categoryServices : []
      };
    }).filter(cat => cat.services.length > 0);

    res.json(categorized);
  } catch (error) {
    console.error('Erro ao buscar serviços por categoria:', error);
    res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
});

// Obter configuração de categorias
router.get('/categories', (req, res) => {
  res.json(SERVICES_CONFIG.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon
  })));
});

module.exports = router;

