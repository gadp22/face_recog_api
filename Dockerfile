FROM node:10.15.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD bash -c "npm run tsc && npm start"