FROM node:latest AS builder

# change working directory to the folder
WORKDIR /webapp/

# copy npm packages config to install them
COPY package*.json ./
# install npm dependencies
RUN npm install 
#--silent

# copy all source files to a folder
COPY . .

# build app
RUN npm run build

# start secure nginx server
FROM nginx:latest

# copy build files and folders to container nginx folder
COPY --from=builder /webapp/build /var/www/build/

# copy nginx configuration file
ARG nginx_config_file
COPY ./nginx/${nginx_config_file} /etc/nginx/conf.d/default.conf

EXPOSE 80 443

# start nginx with weird command (where in the world makind daemon off will start daemon, maybe in nginx world)
CMD ["nginx", "-g", "daemon off;"]