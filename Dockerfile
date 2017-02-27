FROM node:latest

RUN npm install nodemon -g

WORKDIR /src
RUN npm install

EXPOSE 80

CMD npm start
