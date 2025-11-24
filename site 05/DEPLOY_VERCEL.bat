@echo off
echo ==========================================
echo   DEPLOY FLOWGEST NO VERCEL
echo ==========================================
echo.

cd /d "%~dp0client"

echo [1/3] Verificando Vercel CLI...
vercel --version
if errorlevel 1 (
    echo.
    echo Instalando Vercel CLI...
    call npm install -g vercel
)

echo.
echo [2/3] Fazendo login no Vercel...
echo.
echo IMPORTANTE: 
echo 1. Uma janela do navegador vai abrir
echo 2. Faça login na sua conta Vercel
echo 3. Autorize o acesso
echo 4. Volte aqui e pressione ENTER
echo.
pause

echo.
echo [3/3] Fazendo deploy em producao...
echo.
vercel --prod

echo.
echo ==========================================
echo   DEPLOY CONCLUIDO!
echo ==========================================
echo.
pause

