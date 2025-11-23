require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = process.argv[2] || 'vinigabrielborba@gmail.com';
    const newPassword = process.argv[3] || '123456';
    
    console.log('🔄 Resetando senha...\n');
    console.log('📧 Email:', email);
    console.log('🔑 Nova senha:', newPassword);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });
    
    if (!user) {
      console.error('❌ Usuário não encontrado');
      process.exit(1);
    }
    
    console.log('✅ Usuário encontrado:', user.name);
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Senha resetada com sucesso!');
    console.log('\n📋 Agora você pode fazer login com:');
    console.log('Email:', email);
    console.log('Senha:', newPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();

