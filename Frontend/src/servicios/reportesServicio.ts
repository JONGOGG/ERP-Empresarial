import type { ReporteGeneral } from "../tipos/Reporte";

import { apiFetch } from "./api";

export async function obtenerReporteGeneral(
  fechaInicio: string,
  fechaFin: string,
): Promise<ReporteGeneral> {
  const parametros = new URLSearchParams({
    fechaInicio,
    fechaFin,
  });

  const respuesta = await apiFetch(
    `/reportes/general?${parametros.toString()}`,
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    let mensaje = "No se pudo obtener el reporte";

    try {
      const error = JSON.parse(texto);

      if (error.mensaje) {
        mensaje = error.mensaje;
      }
    } catch {
      // Mensaje genérico
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}
