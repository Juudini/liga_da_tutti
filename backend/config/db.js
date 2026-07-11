import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] Conectado a MongoDB (${mongoose.connection.name})`);
  } catch (error) {
    console.error("[db] Error al conectar a MongoDB:", error.message);
  }
}
