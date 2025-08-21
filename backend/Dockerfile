FROM node:18-alpine

WORKDIR /virtual-assistant-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
