FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_BASE_PATH
ARG VITE_MAX_ID

COPY package*.json ./
RUN npm ci
COPY . .

ARG DIST_DIR=dist
RUN npm run build

FROM nginx:stable-alpine AS runtime
ARG DIST_DIR=dist
COPY --from=build /app/${DIST_DIR} /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]