import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../servicios/authServicio";

export function InicioSesion() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");
      setCargando(true);

      const respuesta = await iniciarSesion(
        correo,
        password
      );

      localStorage.setItem(
        "token",
        respuesta.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.usuario)
      );

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Ocurrió un error al iniciar sesión"
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <section>
        <h1>ERP Empresarial</h1>

        <p>Inicia sesión para continuar</p>

        <form onSubmit={manejarEnvio}>
          <div>
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(event) =>
                setCorreo(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}