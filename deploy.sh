
#!/bin/bash
set -e

APP_DIR=/home/ubuntu/service-orders
cd $APP_DIR

echo "==> Verificando instalación de Node y npm..."
if ! command -v node &> /dev/null; then
    echo "Node.js no está instalado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "==> Verificando instalación de PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "PM2 no encontrado. Instalando..."
    sudo npm install -g pm2
fi

echo "==> Instalando dependencias..."
npm ci --omit=dev

echo "==> Iniciando/reiniciando servicio con PM2..."
if pm2 list | grep -q "service-orders"; then
    pm2 restart service-orders
else
    pm2 start index.js --name service-orders
fi
