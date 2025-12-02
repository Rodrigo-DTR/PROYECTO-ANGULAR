import React, { useEffect, useState } from "react";
import "./Home.css";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://localhost:3000";

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNoticias = async () => {
    try {
      const res = await fetch(`${API_URL}/noticias`);

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error HTTP:", res.status, txt);
        toast.error("Error al cargar noticias (HTTP " + res.status + ")");
        return;
      }

      const data = await res.json();
      setNoticias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error de red:", err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const formatFecha = (f) => {
    if (!f) return "";
    return new Date(f).toLocaleString();
  };

  return (
    <div className="home-container">
      <section className="home-banner">
        <h1>Noticias</h1>
        <p>“Lo nuevo del Tec en un solo lugar: eventos, anuncios y lo más top. ¡No te pierdas nada!”</p>
      </section>

      <section className="announcements-section">
        <h2>Noticias recientes</h2>

        {loading ? (
          <div>Cargando noticias...</div>
        ) : (
          <motion.div
            className="announcements-grid"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {noticias.length === 0 ? (
              <article className="announcement-card empty-card">
                <div className="card-content">
                  <h3>Sin noticias por ahora</h3>
                  <p className="card-preview">
                    Aún no se han publicado avisos. Vuelve más tarde para ver
                    las últimas noticias del Instituto Tecnológico de Orizaba.
                  </p>
                </div>
              </article>
            ) : (
              noticias.map((n) => (
                <motion.article key={n.id} className="announcement-card" variants={itemVariants} layout>
                  {n.imagen_url && (
                    <div className="card-image">
                      <img src={API_URL + n.imagen_url} alt="Imagen de la noticia" />
                    </div>
                  )}

                  <div className="card-content">
                    <h3>{n.titulo}</h3>
                    <p className="card-preview">{n.contenido}</p>

                    <div className="card-meta">
                      <span>{formatFecha(n.fecha)}</span>

                      {n.archivo_url && (
                        <a href={API_URL + n.archivo_url} target="_blank" rel="noreferrer" className="btn-download">
                          Descargar archivo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const containerVariants = prefersReduced
  ? { hidden: {}, visible: {} }
  : {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
    };

const itemVariants = prefersReduced
  ? { hidden: {}, visible: {} }
  : {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    };
