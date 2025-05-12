FROM node:23-bookworm
RUN mkdir -p /app/data
RUN npm i -g nodemon
COPY *-server.js index.html /app
COPY data/* /app/data/
