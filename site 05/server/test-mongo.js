require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com MongoDB...');
    console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'NÃO CONFIGURADO');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar uma query simples
    console.log('🔄 Testando query no banco...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query executada com sucesso! Total de usuários: ${userCount}`);
    
    // Testar buscar um usuário
    if (userCount > 0) {
      const firstUser = await prisma.user.findFirst();
      console.log('✅ Usuário encontrado:', {
        id: firstUser.id,
        email: firstUser.email,
        name: firstUser.name,
        role: firstUser.role
      });
    } else {
      console.log('ℹ️ Nenhum usuário encontrado no banco');
    }
    
    console.log('\n✅ Todos os testes passaram! MongoDB está funcionando corretamente.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao conectar com MongoDB:');
    console.error('Nome do erro:', error.name);
    console.error('Mensagem:', error.message);
    console.error('\n📋 Possíveis causas:');
    console.error('1. IP não está na whitelist do MongoDB Atlas');
    console.error('2. String de conexão incorreta no .env');
    console.error('3. Credenciais incorretas');
    console.error('4. Cluster pausado ou inacessível');
    console.error('5. Problema de rede/firewall');
    console.error('\n💡 Solução:');
    console.error('1. Acesse: https://cloud.mongodb.com');
    console.error('2. Vá em Network Access');
    console.error('3. Adicione seu IP ou use 0.0.0.0/0 (apenas desenvolvimento)');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

