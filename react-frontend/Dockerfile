# syntax=docker/dockerfile:1
# Dockerfile for React client

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
RUN npm install react-scripts@3.4.1 -g
RUN yarn install

# add app
COPY . ./

# start app
CMD ["npm", "start"]