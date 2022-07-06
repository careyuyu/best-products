# syntax=docker/dockerfile:1
# Dockerfile for Express API

# Build react client
FROM node:latest
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./
RUN npm install
RUN yarn install

COPY . ./

# start app
CMD ["npm", "start"]