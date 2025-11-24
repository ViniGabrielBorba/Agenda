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

// Dashboard Analytics Avançado
router.get('/analytics', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query; // period: 'day', 'week', 'month'
    const where = req.user.role === 'PROFESSIONAL' 
      ? { professionalId: req.user.id }
      : {};

    // Definir período padrão (últimos 30 dias se não especificado)
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : new Date();

    where.startTime = {
      gte: start,
      lte: end
    };

    // Receita ao longo do tempo
    const appointments = await prisma.appointment.findMany({
      where: {
        ...where,
        status: { in: ['COMPLETED', 'CONFIRMED'] }
      },
      include: {
        service: {
          select: {
            price: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    // Agrupar por período
    const revenueByPeriod = {};
    const appointmentsByPeriod = {};
    const servicesByPeriod = {};

    appointments.forEach(apt => {
      const date = new Date(apt.startTime);
      let key;
      
      if (period === 'day') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (period === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      }

      const revenue = apt.payment?.status === 'PAID' 
        ? apt.payment.amount 
        : apt.service.price;

      revenueByPeriod[key] = (revenueByPeriod[key] || 0) + revenue;
      appointmentsByPeriod[key] = (appointmentsByPeriod[key] || 0) + 1;
      
      if (!servicesByPeriod[key]) {
        servicesByPeriod[key] = {};
      }
      servicesByPeriod[key][apt.serviceId] = (servicesByPeriod[key][apt.serviceId] || 0) + 1;
    });

    // Horários mais procurados
    const hourStats = {};
    appointments.forEach(apt => {
      const hour = new Date(apt.startTime).getHours();
      hourStats[hour] = (hourStats[hour] || 0) + 1;
    });

    const popularHours = Object.entries(hourStats)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Taxa de cancelamento
    const totalAppointments = await prisma.appointment.count({ where });
    const cancelledAppointments = await prisma.appointment.count({
      where: { ...where, status: 'CANCELLED' }
    });
    const cancellationRate = totalAppointments > 0 
      ? (cancelledAppointments / totalAppointments) * 100 
      : 0;

    // Clientes novos vs recorrentes
    const clientStats = await prisma.appointment.groupBy({
      by: ['clientId'],
      where,
      _count: {
        id: true
      }
    });

    const newClients = clientStats.filter(c => c._count.id === 1).length;
    const recurringClients = clientStats.filter(c => c._count.id > 1).length;

    // Previsão de receita (baseada na média dos últimos períodos)
    const revenueValues = Object.values(revenueByPeriod);
    const avgRevenue = revenueValues.length > 0
      ? revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length
      : 0;

    res.json({
      revenue: {
        total: Object.values(revenueByPeriod).reduce((a, b) => a + b, 0),
        byPeriod: revenueByPeriod,
        average: avgRevenue,
        forecast: avgRevenue * 1.1 // Previsão otimista (+10%)
      },
      appointments: {
        total: totalAppointments,
        byPeriod: appointmentsByPeriod,
        cancelled: cancelledAppointments,
        cancellationRate: parseFloat(cancellationRate.toFixed(2))
      },
      clients: {
        new: newClients,
        recurring: recurringClients,
        total: clientStats.length
      },
      popularHours,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        type: period
      }
    });
  } catch (error) {
    console.error('Erro ao gerar analytics:', error);
    res.status(500).json({ message: 'Erro ao gerar analytics', error: error.message });
  }
});

// Relatório de horários mais procurados
router.get('/popular-hours', authenticate, authorize('PROFESSIONAL', 'ADMIN'), async (req, res) => {
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

    const appointments = await prisma.appointment.findMany({
      where,
      select: {
        startTime: true
      }
    });

    const hourStats = {};
    const dayStats = {};

    appointments.forEach(apt => {
      const date = new Date(apt.startTime);
      const hour = date.getHours();
      const day = date.getDay(); // 0 = Domingo, 6 = Sábado

      hourStats[hour] = (hourStats[hour] || 0) + 1;
      dayStats[day] = (dayStats[day] || 0) + 1;
    });

    const popularHours = Object.entries(hourStats)
      .map(([hour, count]) => ({
        hour: parseInt(hour),
        hourFormatted: `${String(hour).padStart(2, '0')}:00`,
        count
      }))
      .sort((a, b) => b.count - a.count);

    const popularDays = Object.entries(dayStats)
      .map(([day, count]) => ({
        day: parseInt(day),
        dayName: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][parseInt(day)],
        count
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      byHour: popularHours,
      byDay: popularDays
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de horários:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
});

module.exports = router;

