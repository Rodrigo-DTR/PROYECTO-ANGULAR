import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // Opcional si usarás estilos
import { toast } from 'react-toastify';

const API_URL = "http://localhost:3000";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem("usuario");
    if (rawUser) {
      try {
        setUsuario(JSON.parse(rawUser));
      } catch {
        setUsuario(null);
      }
    }

    fetch(`${API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => {
        setNoticias(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al conectarse al servidor");
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Noticias publicadas</h2>

      {cargando ? (
        <div>Cargando noticias...</div>
      ) : noticias.length === 0 ? (
        <div>No hay noticias registradas.</div>
      ) : (
        <ul>
          {noticias.map((n) => (
            <li key={n.id} className="announcement-card">
              <div className="card-content">
                <h3>{n.titulo}</h3>
                <p className="card-preview">{n.contenido}</p>

                <div className="file-info">
                  {n.imagen_url && (
                    <img
                      src={API_URL + n.imagen_url}
                      alt="Imagen de la noticia"
                      className="news-image"
                    />
                  )}
                  {n.archivo_url && (
                    <a
                      href={API_URL + n.archivo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-download"
                    >
                      Descargar archivo
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
