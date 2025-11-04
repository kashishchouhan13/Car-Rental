FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -D ts-node typescript @types/node
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["npm", "start"]
