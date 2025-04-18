# Backend Dockerfile - Version 2
FROM python:3.9-slim

# Sürümü kontrol etmek için bir ortam değişkeni
ENV DOCKERFILE_VERSION="2"

# Gerekli sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    libpq-dev \
    libgirepository1.0-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Versiyon kontrol satırı, değişiklikleri görmek için
RUN echo "Version 2 - $(date)" > /app/version.txt

# 5000 portunu dışa aç
EXPOSE 5000

# Uygulamayı çalıştır
CMD ["python", "app.py"]