
import express from "express";
import { pathToFileURL } from "node:url";

const productosIniciales = [
  { id: 1, nombre: "Café con leche", precio: 1800, categoria: "bebida" },
  { id: 2, nombre: "Medialuna", precio: 900, categoria: "comida" },
  { id: 3, nombre: "Tostado de jamón y queso", precio: 3500, categoria: "comida" },
  { id: 4, nombre: "Agua mineral", precio: 1200, categoria: "bebida" },
];

function validarProducto(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return "El cuerpo de la solicitud debe ser un objeto JSON.";
  }

  if (typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
    return "El nombre es obligatorio y no puede estar vacío.";
  }

  if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio <= 0) {
    return "El precio debe ser un número mayor que cero.";
  }

  if (
    datos.categoria !== undefined &&
    (typeof datos.categoria !== "string" || datos.categoria.trim() === "")
  ) {
    return "La categoría, si se envía, debe ser un texto no vacío.";
  }

  return null;
}

export function crearAplicacion() {
  const app = express();
  const productos = productosIniciales.map((producto) => ({ ...producto }));

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).send("Bienvenido a la API de la Cafetería CRUI.");
  });

  app.get("/api/productos", (_req, res) => {
    res.status(200).json(productos);
  });

  app.get("/api/productos/:id", (req, res) => {
    const producto = productos.find((item) => item.id === Number(req.params.id));

    if (!producto) {
      return res.status(404).json({ error: "No se encontró el producto solicitado." });
    }

    return res.status(200).json(producto);
  });

  app.post("/api/productos", (req, res) => {
    const error = validarProducto(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const nuevoProducto = {
      id: Math.max(0, ...productos.map((producto) => producto.id)) + 1,
      nombre: req.body.nombre.trim(),
      precio: req.body.precio,
    };

    if (req.body.categoria !== undefined) {
      nuevoProducto.categoria = req.body.categoria.trim();
    }

    productos.push(nuevoProducto);
    return res.status(201).json(nuevoProducto);
  });

  app.put("/api/productos/:id", (req, res) => {
    const producto = productos.find((item) => item.id === Number(req.params.id));

    if (!producto) {
      return res.status(404).json({ error: "No se encontró el producto solicitado." });
    }

    const datosActualizados = {
      nombre: req.body?.nombre ?? producto.nombre,
      precio: req.body?.precio ?? producto.precio,
      categoria: req.body?.categoria ?? producto.categoria,
    };
    const error = validarProducto(datosActualizados);

    if (error) {
      return res.status(400).json({ error });
    }

    producto.nombre = datosActualizados.nombre.trim();
    producto.precio = datosActualizados.precio;
    if (datosActualizados.categoria !== undefined) {
      producto.categoria = datosActualizados.categoria.trim();
    }

    return res.status(200).json(producto);
  });

  app.delete("/api/productos/:id", (req, res) => {
    const indice = productos.findIndex((item) => item.id === Number(req.params.id));

    if (indice === -1) {
      return res.status(404).json({ error: "No se encontró el producto solicitado." });
    }

    const [productoEliminado] = productos.splice(indice, 1);
    return res.status(200).json({
      mensaje: "Producto eliminado correctamente.",
      producto: productoEliminado,
    });
  });

  app.use((error, _req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    const status = Number.isInteger(error.status) && error.status >= 400 ? error.status : 500;
    if (status >= 500) {
      console.error(error);
    }

    const mensaje =
      status === 400
        ? "El cuerpo JSON no es válido."
        : status === 413
          ? "El cuerpo de la solicitud es demasiado grande."
          : "Ocurrió un error interno.";

    return res.status(status).json({ error: mensaje });
  });

  return app;
}

export const app = crearAplicacion();

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const puerto = 3000;
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
  });
}
