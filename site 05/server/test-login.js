require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔄 Testando processo de login...\n');
    
    const email = 'vinigabrielborba@gmail.com';
    const password = '123456'; // Senha de teste - você pode mudar
    
    console.log('📧 Email:', email);
    console.log('🔑 Testando senha...\n');
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Email normalizado:', normalizedEmail);
    
    // Buscar usuário
    console.log('🔍 Buscando usuário no banco...');
    const user = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });
    
    if (!user) {
      console.error('❌ Usuário não encontrado');
      process.exit(1);
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Verificar senha
    console.log('\n🔐 Verificando senha...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.error('❌ Senha incorreta');
      console.log('\n💡 Dica: A senha pode estar diferente. Tente criar um novo usuário ou verificar a senha.');
      process.exit(1);
    }
    
    console.log('✅ Senha válida!');
    
    // Gerar token
    console.log('\n🎫 Gerando token JWT...');
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não está definido no .env');
      process.exit(1);
    }
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    console.log('✅ Token gerado com sucesso!');
    console.log('\n✅ Login funcionando corretamente!');
    console.log('\n📋 Resumo:');
    console.log('- Conexão com MongoDB: OK');
    console.log('- Busca de usuário: OK');
    console.log('- Verificação de senha: OK');
    console.log('- Geração de token: OK');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro no teste de login:');
    console.error('Nome:', error.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();

