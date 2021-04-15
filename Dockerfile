# ### STAGE 1: Build ###
# FROM node:14-alpine AS builder
# WORKDIR /usr/src/app
# COPY package.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# # RUN npm run build -- --output-path=./dist/out --configuration $configuration

# ### STAGE 2: Run ###
# FROM nginx:1.19-alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

### STAGE 1: Build ###
FROM node:14-alpine AS builder
WORKDIR /usr/src/app
# COPY package.json ./
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod
# RUN npm run build -- --output-path=./dist/out --configuration $configuration

### STAGE 2: Run ###
#FROM nginx:1.13.12-alpine
FROM nginx:1.19-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/few /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]