# Use Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port your service runs on
EXPOSE 5002

# Run the service in development (or change to start in prod)
CMD ["npm", "run", "dev"]
