import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const router = Router();

// ==========================================
// REGISTRAR USUARIO
// ==========================================

router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado",
      });
    }

    // Cifrar contraseña
    const passwordCifrado = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: passwordCifrado,
        rol: "EMPLEADO",
      },
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al registrar el usuario",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    // Comparar contraseña
    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      secret,
      {
        expiresIn: "8h",
      }
    );

    return res.json({
      mensaje: "Inicio de sesión correcto",

      token,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
});

export default router;