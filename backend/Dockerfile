# Backend Dockerfile
FROM python:3.9-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları yüklemek için requirements.txt dosyasını kopyala
COPY requirements.txt .

# Bağımlılıkları yükle
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kaynak kodlarını kopyala
COPY . .

# Uygulama portunu dışa aç
EXPOSE 5000

# Uygulamayı çalıştır
CMD ["python", "app.py"]