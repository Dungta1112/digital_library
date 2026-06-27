FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for node-gyp (e.g. bcrypt) and Prisma
RUN apk add --no-cache python3 make g++ openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:dev"]
