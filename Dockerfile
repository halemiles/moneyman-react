# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Build app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start app
CMD ["npm", "start"]

