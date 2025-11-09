FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG DIST_DIR=build
RUN npm run build

FROM nginx:stable-alpine AS runtime
ARG DIST_DIR=build
COPY --from=build /app/${DIST_DIR} /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]