# Use Node.js 18
FROM node:18

# Install Bash shell (Bash is usually installed by default in Debian-based images, so you may not need this step)
RUN apt-get update && apt-get install -y bash bash-completion

## change default shell dash -> bash (again, usually not needed in Debian-based images)
RUN sed -i 's|/bin/sh|/bin/bash|g' /etc/passwd

# Create dir for container
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies and build
RUN npm ci
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "prod" ]