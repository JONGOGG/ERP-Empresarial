import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  obtenerReporteGeneral,
} from "../services/reportes.service.js";

export async function reporteGeneral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      fechaInicio,
      fechaFin,
    } = req.query;

    if (
      !fechaInicio ||
      !fechaFin ||
      typeof fechaInicio !== "string" ||
      typeof fechaFin !== "string"
    ) {
      return res.status(400).json({
        mensaje:
          "Debes proporcionar fechaInicio y fechaFin",
      });
    }

    const inicio = new Date(
      `${fechaInicio}T00:00:00`
    );

    const fin = new Date(
      `${fechaFin}T23:59:59.999`
    );

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fin.getTime())
    ) {
      return res.status(400).json({
        mensaje: "Las fechas no son válidas",
      });
    }

    if (inicio > fin) {
      return res.status(400).json({
        mensaje:
          "La fecha inicial no puede ser mayor que la fecha final",
      });
    }

    const reporte =
      await obtenerReporteGeneral({
        fechaInicio: inicio,
        fechaFin: fin,
      });

    return res.json(reporte);
  } catch (error) {
    next(error);
  }
}