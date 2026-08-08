import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function InicioSesion() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (correo === "admin@erp.com" && contrasena === "admin123") {
      setError("");
      navigate("/dashboard");
      return;
    }

    setError("Correo o contraseña incorrectos");
  };

  return (
    <main>
      <section>
        <h1>ERP Empresarial</h1>
        <p>Inicia sesión para continuar</p>

        <form onSubmit={manejarEnvio}>
          <div>
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              placeholder="admin@erp.com"
            />
          </div>

          <div>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              placeholder="********"
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit">Iniciar sesión</button>
        </form>
      </section>
    </main>
  );
}