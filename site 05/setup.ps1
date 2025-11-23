# Script de Setup para Windows PowerShell

Write-Host "🚀 Configurando Sistema de Agendamento Online..." -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado. Por favor, instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se PostgreSQL está rodando (opcional)
Write-Host ""
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgTest = psql --version 2>$null
    Write-Host "✓ PostgreSQL encontrado" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL não encontrado no PATH. Certifique-se de que está instalado." -ForegroundColor Yellow
}

# Instalar dependências
Write-Host ""
Write-Host "Instalando dependências..." -ForegroundColor Yellow
Write-Host "  - Dependências do projeto raiz..." -ForegroundColor Cyan
npm install

Write-Host "  - Dependências do servidor..." -ForegroundColor Cyan
Set-Location server
npm install
Set-Location ..

Write-Host "  - Dependências do cliente..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..

Write-Host "✓ Dependências instaladas!" -ForegroundColor Green

# Gerar Prisma Client
Write-Host ""
Write-Host "Gerando Prisma Client..." -ForegroundColor Yellow
Set-Location server
npx prisma generate
Set-Location ..

Write-Host "✓ Prisma Client gerado!" -ForegroundColor Green

# Verificar arquivos .env
Write-Host ""
Write-Host "Verificando arquivos de configuração..." -ForegroundColor Yellow

if (-not (Test-Path "server\.env")) {
    Write-Host "⚠ Arquivo server\.env não encontrado!" -ForegroundColor Yellow
    Write-Host "  Crie o arquivo server\.env com as configurações (veja SETUP.md)" -ForegroundColor Cyan
} else {
    Write-Host "✓ server\.env encontrado" -ForegroundColor Green
}

if (-not (Test-Path "client\.env.local")) {
    Write-Host "⚠ Arquivo client\.env.local não encontrado!" -ForegroundColor Yellow
    Write-Host "  Crie o arquivo client\.env.local (veja SETUP.md)" -ForegroundColor Cyan
} else {
    Write-Host "✓ client\.env.local encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Configure o banco de dados PostgreSQL" -ForegroundColor Cyan
Write-Host "  2. Crie os arquivos .env (veja SETUP.md)" -ForegroundColor Cyan
Write-Host "  3. Execute: cd server && npm run migrate" -ForegroundColor Cyan
Write-Host "  4. Execute: npm run dev (na raiz do projeto)" -ForegroundColor Cyan
Write-Host ""

