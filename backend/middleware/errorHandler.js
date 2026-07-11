import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  let status = err.status ?? err.statusCode ?? 500;
  let message = err.message || "Error interno del servidor";

  if (err.name === "CastError") {
    status = 400;
    message = `Identificador inválido: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = "Datos inválidos";
  }

  if (err.code === 11000) {
    status = 409;
    message = "El recurso ya existe (valor duplicado)";
  }

  const body = { message };

  if (env.nodeEnv !== "production") {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}
