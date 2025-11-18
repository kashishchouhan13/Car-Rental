# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# RUN npm install -D ts-node typescript @types/node
# COPY . .
# RUN npm run build
# EXPOSE 5001
# CMD ["npm", "start"]

FROM node:18

WORKDIR /app

# copy package files
COPY package*.json ./

# install deps
RUN npm install

# copy rest of code
COPY . .

# delete old build
RUN rm -rf dist

# build fresh dist
RUN npm run build

EXPOSE 5001

CMD ["node", "dist/index.js"]