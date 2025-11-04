# Step 1: Base image
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Install dev dependencies (typescript, ts-node)
RUN npm install -D ts-node typescript @types/node @types/express

# Step 5: Copy source code
COPY . .

# Step 6: Build TypeScript code
RUN npm run build

# Step 7: Expose port
EXPOSE 5002

# Step 8: Run service
CMD ["npm", "start"]
