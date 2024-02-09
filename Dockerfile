# Base image
FROM node:21.6.1-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
#COPY package*.json ./


# Copy app source code
COPY . .

# Install dependencies
RUN npm install

# Build app
#RUN npm run build

# Expose port 3002
EXPOSE 3002

# Start app
CMD ["npm", "start"]

