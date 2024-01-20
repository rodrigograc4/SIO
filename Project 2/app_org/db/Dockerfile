# Use a imagem do SQL Server
FROM mcr.microsoft.com/mssql/server:2019-latest

# Mudar para o usuário root para instalar pacotes
USER root

# Instalar Python e mssql-cli
RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && pip3 install mssql-cli

# Copiar seu script SQL para o container
COPY Deti_Store.sql /tmp/Deti_Store.sql

# Copiar o script de inicialização
COPY entrypoint.sh /tmp/entrypoint.sh

# Tornar o script de inicialização executável
RUN chmod +x /tmp/entrypoint.sh

# Configurar o script de inicialização para ser executado
CMD /bin/bash /tmp/entrypoint.sh
