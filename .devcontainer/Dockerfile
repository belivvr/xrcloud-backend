FROM node:lts-alpine

# Development Tools
RUN apk add -f git curl jq tree vim asciinema

# ApacheBench
RUN apk add -f apache2-utils

# --- Bash Install Start
RUN apk add -f bash bash-doc bash-completion

# default shell ash -> bash
RUN sed -i "s|/bin/ash|/bin/bash|g" /etc/passwd

# color prompt
RUN echo 'PS1="\[\033[32m\]\w\[\033[00m\] "' >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias l='ls --color=auto -lA'" >> ~/.bashrc

# Docker Install
RUN DOCKER_PKG="docker-20.10.9.tgz"; \
    curl -fsSLO --compressed "https://download.docker.com/linux/static/stable/$(arch)/$DOCKER_PKG"; \
    tar -xf $DOCKER_PKG --strip-components 1 --directory /usr/local/bin/ docker/docker; \
    rm -f $DOCKER_PKG

# Docker Compose Install
RUN apk add -f py-pip python3-dev libffi-dev openssl-dev gcc libc-dev make
# RUN pip install -v docker-compose

# Expose port
EXPOSE 3000