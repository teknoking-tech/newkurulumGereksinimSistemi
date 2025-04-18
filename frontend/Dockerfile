# Frontend Dockerfile
FROM node:16-alpine AS build

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodlarını kopyala
COPY . .

# Uygulamayı üret
RUN npm run build

# Nginx tabanlı dağıtım aşaması
FROM nginx:alpine

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build aşamasından üretilen dosyaları kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# 80 portunu dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]