import "dotenv/config";

const REQUIRED_VARS = ["MONGO_URI", "JWT_SECRET"];

function readEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[env] Faltan variables de entorno obligatorias: ${missing.join(", ")}. ` +
        "Copiá .env.example a .env y completá los valores antes de arrancar el servidor.",
    );
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  };
}

export const env = readEnv();
