# Lanapp
Proyecto escolar de una aplicación basada en Fastapi con una interfaz de Reactnative

Paso a paso para correr el proyecto

cd backend
python -m venv venv
venv\Scripts\activate     # En Windows
# source venv/bin/activate  <-- En Mac/Linux

pip install fastapi uvicorn sqlalchemy pymysql alembic
pip freeze > requirements.txt

Instalar en carpeta frontend para graficas
npm install axios react-native-chart-kit react-native-svg
