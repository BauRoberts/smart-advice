#!/bin/bash

# Script para ejecutar los tests de Responsabilidad Civil

# Asegurarse de que las dependencias estén instaladas
echo "Instalando dependencias..."
npm install

# Crear directorio de tests si no existe
mkdir -p __tests__/integration

# Copiar archivo de test al directorio
echo "Configurando tests de Responsabilidad Civil..."
cp ./tests/integration/responsabilidadCivil.test.ts ./__tests__/integration/

# Ejecutar los tests
echo "Ejecutando tests de Responsabilidad Civil..."
npm run test:rc

# Si los tests pasan, mostrar mensaje de éxito
if [ $? -eq 0 ]; then
  echo "✅ Todos los tests han pasado correctamente."
  echo "Las recomendaciones de Responsabilidad Civil se están generando según lo esperado."
else
  echo "❌ Algunos tests han fallado."
  echo "Por favor, revisa los errores y ajusta el código de la aplicación según sea necesario."
fi