FROM nginx:latest 
COPY /nginx-default.conf /etc/nginx/conf.d/default.conf
COPY /dist/assets /usr/share/nginx/html/assets
COPY /dist/* /usr/share/nginx/html/
EXPOSE 80:80