# API de la Cafetería CRUI

Trabajo práctico de una API REST creada con Node.js y Express para consultar y administrar productos de una cafetería. Los datos se guardan en un array en memoria y se reinician al apagar el servidor.

## Instalación y ejecución

Desde la carpeta del proyecto, ejecutá:

```bash
npm install
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Rutas

| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Muestra un mensaje de bienvenida |
| GET | `/api/productos` | Lista todos los productos |
| GET | `/api/productos/:id` | Busca un producto por ID |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/:id` | Modifica un producto |
| DELETE | `/api/productos/:id` | Elimina un producto |

Para crear o modificar, enviar un cuerpo JSON con `nombre` y `precio`. El nombre no puede estar vacío y el precio debe ser un número mayor que cero.
