const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const servicesSetupRoutes = require('./routes/services-setup');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const workingHoursRoutes = require('./routes/working-hours');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/services-setup', servicesSetupRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/working-hours', workingHoursRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Verificar conexão com banco antes de iniciar
async function startServer() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Testar conexão
    console.log('🔄 Testando conexão com banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão com banco de dados estabelecida');
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
    
    // Iniciar jobs de lembretes
    try {
      require('./jobs/reminders');
    } catch (jobError) {
      console.warn('⚠️ Erro ao iniciar jobs de lembretes:', jobError.message);
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    console.error('\n📋 Verifique:');
    console.error('1. Seu IP está na whitelist do MongoDB Atlas');
    console.error('2. A string de conexão no .env está correta');
    console.error('3. As credenciais estão corretas');
    console.error('4. O cluster não está pausado');
    console.error('\n💡 Acesse: https://cloud.mongodb.com -> Network Access -> Add IP Address');
    console.error('\n⚠️ Servidor iniciado, mas sem conexão com banco. Algumas funcionalidades podem não funcionar.');
    
    app.listen(PORT, () => {
      console.log(`⚠️ Servidor rodando na porta ${PORT} (sem conexão com banco)`);
    });
  }
}

startServer();

