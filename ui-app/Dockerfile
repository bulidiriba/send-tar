# The node version from wich the app built
FROM node:16.1.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# install the packages
RUN npm install

# add app
COPY . ./

# start app
CMD npm start