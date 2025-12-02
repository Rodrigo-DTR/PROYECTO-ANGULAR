import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"; // Opcional si tienes estilos separados
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol: "usuario",
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Error al registrar");

      toast.success("Registro exitoso! Ahora puedes iniciar sesión");
      navigate("/login");

    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registro</h2>

        <p className="register-subtitle">
          Crea tu cuenta para recibir las noticias del Instituto Tecnológico de Orizaba.
        </p>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre completo"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <small className="hint">
              Usa una contraseña segura que recuerdes con facilidad.
            </small>
          </div>

          <button type="submit" className="btn-submit">
            Registrarse
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
