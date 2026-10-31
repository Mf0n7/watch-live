@echo off
cd /d "%~dp0"
rem Passe a URL da Vercel como argumento para usar o site hospedado:
rem   assistir.bat https://seu-projeto.vercel.app
node tools\watch.js %1
