import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '/src/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error en la autenticación");
        setLoading(false);
        return;
      }

      if (data.usuario) {
        login(data.usuario, data.token);
      }

      setLoading(false);
      toast.success(data.message || 'Login exitoso');

      const rol = data.usuario?.rol;
      if (rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectarse al servidor");
      toast.error("Error al conectarse al servidor");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
