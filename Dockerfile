FROM node:23-bookworm AS base
RUN mkdir -p /app /app/data
COPY server.js index.html /app
COPY data/* /app/data/
