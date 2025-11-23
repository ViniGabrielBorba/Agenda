require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewDatabase() {
  try {
    console.log('📊 Visualizando dados do banco de dados...\n');
    console.log('🔗 String de conexão:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('📋 Extraindo informações da URL...\n');
    
    const dbUrl = process.env.DATABASE_URL || '';
    const match = dbUrl.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
    
    if (match) {
      const [, user, , cluster, database] = match;
      console.log('👤 Usuário:', user);
      console.log('🌐 Cluster:', cluster);
      console.log('💾 Banco de dados:', database);
      console.log('\n📱 Acesse o MongoDB Atlas em: https://cloud.mongodb.com');
      console.log('   - Faça login com sua conta');
      console.log('   - Selecione o cluster:', cluster);
      console.log('   - Clique em "Browse Collections"');
      console.log('   - Selecione o banco:', database);
      console.log('\n');
    }
    
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados!\n');
    
    // Contar registros
    const [users, services, appointments, payments, workingHours] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.appointment.count(),
      prisma.payment.count(),
      prisma.workingHours.count()
    ]);
    
    console.log('📊 Estatísticas do banco:\n');
    console.log(`👥 Usuários: ${users}`);
    console.log(`💅 Serviços: ${services}`);
    console.log(`📅 Agendamentos: ${appointments}`);
    console.log(`💳 Pagamentos: ${payments}`);
    console.log(`⏰ Horários de trabalho: ${workingHours}\n`);
    
    // Listar usuários
    if (users > 0) {
      console.log('👥 Usuários cadastrados:');
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      allUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📱 Telefone: ${user.phone || 'Não informado'}`);
        console.log(`   👤 Role: ${user.role}`);
        console.log(`   📅 Criado em: ${user.createdAt.toLocaleString('pt-BR')}`);
      });
    }
    
    // Listar serviços
    if (services > 0) {
      console.log('\n\n💅 Serviços cadastrados:');
      const allServices = await prisma.service.findMany({
        include: {
          professional: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      allServices.forEach((service, index) => {
        console.log(`\n${index + 1}. ${service.name}`);
        console.log(`   💰 Preço: R$ ${service.price.toFixed(2)}`);
        console.log(`   ⏱️ Duração: ${service.duration} min`);
        console.log(`   👤 Profissional: ${service.professional.name}`);
        console.log(`   ${service.isActive ? '✅ Ativo' : '❌ Inativo'}`);
      });
    }
    
    // Listar agendamentos
    if (appointments > 0) {
      console.log('\n\n📅 Agendamentos:');
      const allAppointments = await prisma.appointment.findMany({
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          },
          professional: {
            select: {
              name: true
            }
          },
          service: {
            select: {
              name: true,
              price: true
            }
          }
        },
        orderBy: { startTime: 'desc' },
        take: 10
      });
      
      allAppointments.forEach((apt, index) => {
        console.log(`\n${index + 1}. ${apt.service.name}`);
        console.log(`   👤 Cliente: ${apt.client.name}`);
        console.log(`   💼 Profissional: ${apt.professional.name}`);
        console.log(`   📅 Data: ${apt.startTime.toLocaleString('pt-BR')}`);
        console.log(`   💰 Valor: R$ ${apt.service.price.toFixed(2)}`);
        console.log(`   📊 Status: ${apt.status}`);
      });
      
      if (appointments > 10) {
        console.log(`\n   ... e mais ${appointments - 10} agendamento(s)`);
      }
    }
    
    console.log('\n\n✅ Visualização concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao visualizar banco:', error.message);
    console.error('\n💡 Verifique:');
    console.error('1. Se a string de conexão está correta no .env');
    console.error('2. Se seu IP está na whitelist do MongoDB Atlas');
    console.error('3. Se o cluster está ativo');
  } finally {
    await prisma.$disconnect();
  }
}

viewDatabase();

