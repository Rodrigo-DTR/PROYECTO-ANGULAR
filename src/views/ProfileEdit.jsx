import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileEdit.css"; // si deseas separar los estilos
import { toast } from 'react-toastify';

export default function ProfileEdit() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        const storedUser = JSON.parse(raw);
        setUsuario(storedUser);
        setNombre(storedUser.nombre);
        setEmail(storedUser.email);
      }
    } catch (e) {
      setUsuario(null);
    }
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/auth/profile/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre, password: password || undefined }),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 501) {
          const localUser = { ...usuario, nombre };
          localStorage.setItem("usuario", JSON.stringify(localUser));
          toast.info("Cambios guardados localmente (API no implementada).", { autoClose: 3500 });
          navigate("/dashboard");
          return;
        }

        const errBody = await res.json().catch(() => ({}));
        toast.error(errBody.error || "Error al actualizar perfil");
        return;
      }

      const updatedUser = await res.json().catch(() => null);
      if (updatedUser) {
        delete updatedUser.password;
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
      } else {
        const localUser = { ...usuario, nombre };
        localStorage.setItem("usuario", JSON.stringify(localUser));
      }

      toast.success("Perfil actualizado!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const localUser = { ...usuario, nombre };
      localStorage.setItem("usuario", JSON.stringify(localUser));
      toast.info("Cambios guardados localmente (sin conexión).", { autoClose: 3500 });
      navigate("/dashboard");
    }
  };

  if (!usuario) {
    return (
      <div className="profile-edit-container">
        <div className="profile-card">
          <h2>No autenticado</h2>
          <p>Inicia sesión para editar tu perfil.</p>
          <div className="form-actions">
            <button className="btn-save" onClick={() => navigate("/login")}>
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-card">
        <h2>Editar perfil</h2>

        <form className="profile-form" onSubmit={guardar}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} disabled />
            <small>Este correo no se puede modificar.</small>
          </div>

          <div className="form-section">
            <h3>Cambiar contraseña</h3>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                placeholder="Dejar en blanco = sin cambio"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>
                Si dejas este campo vacío, tu contraseña seguirá igual.
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Guardar
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
