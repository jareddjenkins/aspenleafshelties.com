FROM node:13.3.0 AS restore-packages
WORKDIR /opt/
COPY . .
RUN npm install -g yarn
RUN yarn
RUN yarn global add @angular/cli

FROM restore-packages AS build-image
RUN ng build --prod

FROM nginx:latest AS final
COPY --from=build-image /opt/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-image /opt/dist /usr/share/nginx/html/
EXPOSE 80:80