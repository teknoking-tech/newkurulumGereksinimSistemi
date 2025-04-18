# Frontend Dockerfile
FROM nginx:alpine

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Statik dosyaları kopyala
COPY . /usr/share/nginx/html/

# 80 portunu dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]