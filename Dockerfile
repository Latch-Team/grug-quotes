FROM node:23-bookworm
RUN mkdir -q /app/data
RUN npm i -g nodemon
COPY package.json *-server.js index.html /app
RUN cd /app && npm i
