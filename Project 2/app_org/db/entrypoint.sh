#!/bin/bash

# Iniciar o SQL Server e executar em background
/opt/mssql/bin/sqlservr &

# Esperar até que o SQL Server esteja pronto
sleep 30

# Criar o banco de dados Deti_Store
mssql-cli -S localhost -U SA -P "Olaola123" -Q "CREATE DATABASE Deti_Store"

# Executar o script SQL dentro do banco de dados Deti_Store
mssql-cli -S localhost -U SA -P "Olaola123" -d Deti_Store -i /tmp/Deti_Store.sql

# Manter o container em execução
tail -f /dev/null