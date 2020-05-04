FROM node:13.3.0 AS build
WORKDIR /opt/
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN ng build --prod

FROM nginx:latest AS final
COPY --from=build /opt/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/nginx-compression.conf /etc/nginx/conf.d/compression.conf
COPY --from=build /opt/dist /usr/share/nginx/html/
EXPOSE 80:80