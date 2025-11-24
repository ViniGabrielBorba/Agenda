@echo off
echo ==========================================
echo   DEPLOY FLOWGEST - SOLUCAO FINAL
echo ==========================================
echo.

echo [1/5] Criando diretorio temporario sem espaco...
set TEMP_DIR=%TEMP%\flowgest-deploy
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

echo.
echo [2/5] Copiando pasta client para diretorio temporario...
xcopy /E /I /Y "%~dp0client\*" "%TEMP_DIR%\"

echo.
echo [3/5] Verificando Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Instalando Vercel CLI...
    call npm install -g vercel
)

echo.
echo [4/5] Fazendo login no Vercel (se necessario)...
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
echo [5/5] Fazendo deploy do diretorio temporario...
cd /d "%TEMP_DIR%"
vercel --prod

echo.
echo ==========================================
echo   DEPLOY CONCLUIDO!
echo ==========================================
echo.
echo Limpando diretorio temporario...
cd /d "%~dp0"
rmdir /s /q "%TEMP_DIR%"

echo.
echo Pronto! Seu site esta no ar!
echo.
pause

