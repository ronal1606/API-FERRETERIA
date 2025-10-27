# API Ferretería

Pequeña API CRUD con Express + Mongoose diseñada para gestionar empleados, clientes, productos, ventas, etc.

Requisitos
- Node.js 18+
- MongoDB (Atlas o local)

Variables de entorno
- MONGODB_URI: cadena de conexión a MongoDB Atlas (por ejemplo mongodb+srv://user:pass@cluster.mongodb.net/db_name)

Scripts útiles
- `npm install` — instalar dependencias
- `npm run start` — iniciar la API (producción)
- `npm run dev` — iniciar en desarrollo con nodemon
- `npm run migrate` — ejecutar script de migración desde PostgreSQL (si aplica)

Desplegar en Render
1. Push del repo a GitHub (o GitLab).
2. En Render, crea un nuevo Web Service y conecta el repo.
   - Branch: `main` (o la que uses)
   - Build Command: `npm install`
   - Start Command: `npm run start`
   - Node Version: seleccionar 18+
3. En la sección Environment, añade `MONGODB_URI` con tu cadena de conexión (no subas `.env` al repo).
4. Habilita Auto Deploy si quieres que cada push despliegue automáticamente.

Notas operativas
- El servidor escucha en `process.env.PORT || 3000` (Render asignará el puerto en la variable PORT).
- Hay un endpoint `/health` que devuelve el estado de la conexión a MongoDB (útil para checks).
- No subas tu `.env` al repositorio. Usa las variables de entorno de la plataforma de despliegue.

Buenas prácticas
- Rota las credenciales si alguna vez estuvieron expuestas.
- Añade validación en backend para campos sensibles (por ejemplo `sexo` debe ser 'M' o 'F').
- Considera añadir CI (tests) antes del despliegue automático.
# API-FERRETERIA
