FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG REACT_APP_API_URL=/api
ARG REACT_APP_YANDEX_MAPS_API_KEY=
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_YANDEX_MAPS_API_KEY=$REACT_APP_YANDEX_MAPS_API_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
