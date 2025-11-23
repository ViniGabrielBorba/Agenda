const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Relatório de serviços mais agendados
router.get('/popular-services', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      status: { not: 'CANCELLED' },
      ...(req.user.role === 'PROFESSIONAL' && { professionalId: req.user.id })
    };

    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.startTime = {
        ...where.startTime,
        lte: new Date(endDate)
      };
    }

    const services = await prisma.appointment.groupBy({
      by: ['serviceId'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    const serviceIds = services.map(s => s.serviceId);
    const serviceDetails = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: {
        id: true,
        name: true,
        price: true
      }
    });

    const result = services.map(service => {
      const details = serviceDetails.find(s => s.id === service.serviceId);
      return {
        serviceId: service.serviceId,
        serviceName: details?.name || 'Serviço removido',
        count: service._count.id,
        revenue: (details?.price || 0) * service._count.id
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
});

// Relatório de receita
router.get('/revenue', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      status: 'PAID',
      ...(req.user.role === 'PROFESSIONAL' && {
        appointment: {
          professionalId: req.user.id
        }
      })
    };

    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate)
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            service: true
          }
        }
      }
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const revenueByMethod = payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      revenueByMethod,
      totalTransactions: payments.length,
      period: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de receita:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
});

// Relatório de clientes recorrentes
router.get('/recurring-clients', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      status: { not: 'CANCELLED' },
      ...(req.user.role === 'PROFESSIONAL' && { professionalId: req.user.id })
    };

    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.startTime = {
        ...where.startTime,
        lte: new Date(endDate)
      };
    }

    const clients = await prisma.appointment.groupBy({
      by: ['clientId'],
      where,
      _count: {
        id: true
      },
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    const clientIds = clients.map(c => c.clientId);
    const clientDetails = await prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    const result = clients.map(client => {
      const details = clientDetails.find(c => c.id === client.clientId);
      return {
        clientId: client.clientId,
        clientName: details?.name || 'Cliente removido',
        email: details?.email,
        phone: details?.phone,
        appointmentCount: client._count.id
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
});

// Estatísticas gerais
router.get('/stats', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const where = req.user.role === 'PROFESSIONAL' 
      ? { professionalId: req.user.id }
      : {};

    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue
    ] = await Promise.all([
      prisma.appointment.count({ where }).catch(() => 0),
      prisma.appointment.count({ where: { ...where, status: 'PENDING' } }).catch(() => 0),
      prisma.appointment.count({ where: { ...where, status: 'CONFIRMED' } }).catch(() => 0),
      prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }).catch(() => 0),
      prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } }).catch(() => 0),
      prisma.payment.aggregate({
        where: {
          status: 'PAID',
          ...(req.user.role === 'PROFESSIONAL' && {
            appointment: {
              professionalId: req.user.id
            }
          })
        },
        _sum: {
          amount: true
        }
      }).catch(() => ({ _sum: { amount: 0 } }))
    ]);

    res.json({
      appointments: {
        total: totalAppointments || 0,
        pending: pendingAppointments || 0,
        confirmed: confirmedAppointments || 0,
        completed: completedAppointments || 0,
        cancelled: cancelledAppointments || 0
      },
      revenue: {
        total: totalRevenue?._sum?.amount || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    // Retornar valores padrão em caso de erro
    res.json({
      appointments: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      },
      revenue: {
        total: 0
      }
    });
  }
});

module.exports = router;

