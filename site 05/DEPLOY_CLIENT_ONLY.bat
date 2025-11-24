@echo off
echo ==========================================
echo   DEPLOY APENAS PASTA CLIENT
echo ==========================================
echo.

cd /d "%~dp0client"

echo [1/4] Verificando Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Instalando Vercel CLI...
    call npm install -g vercel
)

echo.
echo [2/4] Verificando se esta na pasta client...
if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    echo Certifique-se de estar na pasta client
    pause
    exit /b 1
)

echo OK! Pasta client encontrada.
echo.

echo [3/4] Fazendo login no Vercel (se necessario)...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo IMPORTANTE: 
    echo 1. Uma janela do navegador vai abrir
    echo 2. Faça login na sua conta Vercel
    echo 3. Autorize o acesso
    echo 4. Volte aqui e pressione ENTER
    echo.
    vercel login
    pause
)

echo.
echo [4/4] Fazendo deploy em producao...
echo.
vercel --prod

echo.
echo ==========================================
echo   DEPLOY CONCLUIDO!
echo ==========================================
echo.
echo O Vercel usou APENAS a pasta client!
echo Nao precisa configurar Root Directory.
echo.
pause

