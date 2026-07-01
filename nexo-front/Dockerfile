FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:18080/api/v1
ARG VITE_WS_URL=ws://localhost:18080/ws/notifications/
ARG VITE_OAUTH_AUTHORITY=http://localhost:18080/realms/nexojobs
ARG VITE_OAUTH_CLIENT_ID=nexojobs-front
ARG VITE_OAUTH_REDIRECT_PATH=/auth/callback

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_OAUTH_AUTHORITY=$VITE_OAUTH_AUTHORITY
ENV VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID
ENV VITE_OAUTH_REDIRECT_PATH=$VITE_OAUTH_REDIRECT_PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.k8s.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
