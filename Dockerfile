FROM nginx:latest AS base
EXPOSE 80

FROM node:12.16.2 AS build
COPY package.json package-lock.json ./
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
## Build the angular app in production mode and store the artifacts in dist folder
RUN ./node_modules/.bin/ng build --prod --output-path=dist

FROM base AS final
COPY --from=build /ng-app/nginx-default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /ng-app/nginx-compression.conf /etc/nginx/conf.d/compression.conf
COPY --from=build /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]