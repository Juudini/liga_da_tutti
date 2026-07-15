import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Ese email ya está registrado" });
    }

    const user = await User.create({
      email: normalizedEmail,
      passwordHash: password,
      role: "common",
    });

    const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ese email ya está registrado" });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    const passwordMatches = user ? await user.comparePassword(password) : false;

    if (!user || !passwordMatches) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    res.status(200).json({ token, user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
};
