FROM nginx:latest 
COPY /dist/. /usr/share/nginx/html
COPY /nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80:80 443:443