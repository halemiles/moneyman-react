# Base image
FROM node:22.9-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source code
COPY . .

# Expose port 3000 (React default port)
EXPOSE 3000

# Start app in development mode
CMD ["npm", "start"]

