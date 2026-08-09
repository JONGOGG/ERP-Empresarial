import type { NextFunction, Request, Response } from "express";

import {
  obtenerResumenDashboard,
  obtenerVentasUltimos7Dias,
} from "../services/dashboard.service.js";

export async function resumenDashboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resumen = await obtenerResumenDashboard();

    return res.json(resumen);
  } catch (error) {
    next(error);
  }
}

export async function ventasUltimos7Dias(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const datos = await obtenerVentasUltimos7Dias();

    return res.json(datos);
  } catch (error) {
    next(error);
  }
}
