@echo off
echo ==========================================
echo   FLOWGEST - Iniciando Sistema
echo ==========================================
echo.

echo [1/2] Iniciando Backend...
start "FlowGest Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend...
start "FlowGest Frontend" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo   Sistema iniciado!
echo ==========================================
echo.
echo Aguarde alguns segundos e acesse:
echo http://localhost:3000
echo.
echo Pressione qualquer tecla para abrir no navegador...
pause >nul

start http://localhost:3000

echo.
echo Navegador aberto!
echo.

