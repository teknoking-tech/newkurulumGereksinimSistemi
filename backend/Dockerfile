# Backend Dockerfile
FROM python:3.9-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# 5000 portunu dışa aç
EXPOSE 5000

# Uygulamayı çalıştır
CMD ["python", "app.py"]