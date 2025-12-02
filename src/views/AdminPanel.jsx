import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import Modal from '/src/components/Modal.jsx';
import { toast } from 'react-toastify';

const apiBase = "http://localhost:3000";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const imagenInputRef = useRef(null);
  const archivoInputRef = useRef(null);
  const [imagen, setImagen] = useState(null);
  const [archivo, setArchivo] = useState(null);

  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editContenido, setEditContenido] = useState("");
  const editImagenInputRef = useRef(null);
  const editArchivoInputRef = useRef(null);
  const [editImagen, setEditImagen] = useState(null);
  const [editArchivo, setEditArchivo] = useState(null);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      setUsuario(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setUsuario(null);
      localStorage.removeItem("usuario");
    }
  }, []);

  const esAdmin = usuario && usuario.rol === "admin";

  const onImagenChange = (e) => {
    setImagen(e.target.files[0] || null);
  };

  const onArchivoChange = (e) => {
    setArchivo(e.target.files[0] || null);
  };

  const onEditImagenChange = (e) => {
    setEditImagen(e.target.files[0] || null);
  };

  const onEditArchivoChange = (e) => {
    setEditArchivo(e.target.files[0] || null);
  };

  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/noticias`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error HTTP al cargar noticias:", res.status, txt);
        toast.error("Error al cargar noticias (HTTP " + res.status + ")");
        return;
      }
      const data = await res.json();
      setNoticias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error de red al cargar noticias:", err);
      toast.error("Error de red al cargar noticias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const crearNoticia = async (e) => {
    e?.preventDefault?.();
    if (!esAdmin) return toast.error("No autorizado") && null;
    if (imagen && imagen.size > 2 * 1024 * 1024) {
      return toast.error("La imagen excede el tamaño máximo recomendado de 2 MB.");
    }
    if (archivo && archivo.size > 5 * 1024 * 1024) {
      return toast.error("El archivo excede el tamaño máximo recomendado de 5 MB.");
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("contenido", contenido);
      formData.append("rol", usuario.rol);
      if (imagen) formData.append("imagen", imagen);
      if (archivo) formData.append("archivo", archivo);

      const res = await fetch(`${apiBase}/noticias`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Respuesta no OK:", res.status, data);
        toast.error(data.error || `Error al crear noticia (HTTP ${res.status})`);
        setCreating(false);
        return;
      }

      toast.success(data.message || "Noticia creada");

      setTitulo("");
      setContenido("");
      setImagen(null);
      setArchivo(null);
      if (imagenInputRef.current) imagenInputRef.current.value = "";
      if (archivoInputRef.current) archivoInputRef.current.value = "";

      if (data.noticia) {
        setNoticias((prev) => [data.noticia, ...prev]);
      } else {
        await fetchNoticias();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear noticia");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (n) => {
    setEditing(true);
    setEditId(n.id);
    setEditTitulo(n.titulo);
    setEditContenido(n.contenido);
    setEditImagen(null);
    setEditArchivo(null);
    if (editImagenInputRef.current) editImagenInputRef.current.value = "";
    if (editArchivoInputRef.current) editArchivoInputRef.current.value = "";
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditId(null);
    setEditTitulo("");
    setEditContenido("");
    setEditImagen(null);
    setEditArchivo(null);
    if (editImagenInputRef.current) editImagenInputRef.current.value = "";
    if (editArchivoInputRef.current) editArchivoInputRef.current.value = "";
  };

  const guardarEdicion = async () => {
    if (!esAdmin) return toast.error("No autorizado") && null;
    try {
      const formData = new FormData();
      formData.append("titulo", editTitulo);
      formData.append("contenido", editContenido);
      formData.append("rol", usuario.rol);
      if (editImagen) formData.append("imagen", editImagen);
      if (editArchivo) formData.append("archivo", editArchivo);

      const res = await fetch(`${apiBase}/noticias/${editId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Error editar:", res.status, data);
        toast.error(data.error || `Error al editar (HTTP ${res.status})`);
        return;
      }

      toast.success(data.message || "Editada");
      cancelEdit();
      await fetchNoticias();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar noticia");
    }
  };

  const eliminar = async (id) => {
    if (!esAdmin) return toast.error("No autorizado") && null;
    if (!window.confirm("¿Eliminar noticia?")) return;
    try {
      const res = await fetch(`${apiBase}/noticias/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: usuario.rol }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Error eliminar:", res.status, data);
        toast.error(data.error || `Error al eliminar (HTTP ${res.status})`);
        return;
      }

      toast.success(data.message || "Eliminada");
      await fetchNoticias();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar noticia");
    }
  };

  const formatFecha = (f) => {
    try {
      return new Date(f).toLocaleString();
    } catch {
      return f;
    }
  };

  const editingNoticia = noticias.find((x) => x.id === editId) || null;

  useEffect(() => {
    if (usuario === null) {
    } else if (!esAdmin) {
    }
  }, [usuario]);

  return (
    <div className="admin-panel-container">
      <h1>Panel de administración</h1>

      <section className="create-section">
        <h2>Crear noticia</h2>

        <form className="announcement-form" onSubmit={crearNoticia}>
          <div className="form-group">
            <label>Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="form-group">
            <label>Contenido</label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows="4"
              placeholder="Escribe el contenido de la noticia"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Imagen (opcional)</label>

              <label className="file-label">
                Seleccionar imagen
                <input
                  ref={imagenInputRef}
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={onImagenChange}
                />
              </label>

              <small>Formatos recomendados: JPG, PNG, máximo 2&nbsp;MB.</small>
            </div>

            <div className="form-group">
              <label>Archivo adjunto (opcional)</label>

              <label className="file-label">
                Seleccionar archivo
                <input
                  ref={archivoInputRef}
                  type="file"
                  className="file-input"
                  onChange={onArchivoChange}
                />
              </label>

              <small>PDF, DOCX, etc., máximo 5&nbsp;MB.</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={creating}>
              {creating ? "Creando..." : "Crear noticia"}
            </button>
          </div>
        </form>
      </section>

      {/* EDITOR DE noticia */}
      <Modal open={editing} onClose={cancelEdit}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Editar noticia</h2>

        <div className="form-group">
          <label>Título</label>
          <input
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label>Contenido</label>
          <textarea
            value={editContenido}
            onChange={(e) => setEditContenido(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Imagen actual</label>
            {editingNoticia && editingNoticia.imagen_url ? (
              <div>
                <img src={apiBase + editingNoticia.imagen_url} alt="Imagen actual" className="news-image" />
              </div>
            ) : (
              <div>
                <small>No hay imagen adjunta.</small>
              </div>
            )}

            <label className="file-label">
              Seleccionar nueva imagen
              <input
                ref={editImagenInputRef}
                type="file"
                accept="image/*"
                className="file-input"
                onChange={onEditImagenChange}
              />
            </label>
            <small>Si no seleccionas nada, se mantiene la imagen actual.</small>
          </div>

          <div className="form-group">
            <label>Archivo actual</label>
            {editingNoticia && editingNoticia.archivo_url ? (
              <div>
                <a href={apiBase + editingNoticia.archivo_url} target="_blank" rel="noreferrer">Ver archivo</a>
              </div>
            ) : (
              <div>
                <small>No hay archivo adjunto.</small>
              </div>
            )}

            <label className="file-label">
              Seleccionar nuevo archivo
              <input
                ref={editArchivoInputRef}
                type="file"
                className="file-input"
                onChange={onEditArchivoChange}
              />
            </label>
            <small>Si no seleccionas nada, se mantiene el archivo actual.</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
          <button className="btn-save" onClick={guardarEdicion}>Guardar cambios</button>
          <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
        </div>
      </Modal>

      <section className="manage-section">
        <h2>Noticias existentes</h2>

        {loading ? (
          <div className="no-announcements">Cargando noticias...</div>
        ) : noticias.length === 0 ? (
          <div className="no-announcements">No hay noticias registradas.</div>
        ) : (
          <div className="announcements-list">
            {noticias.map((n) => (
              <article key={n.id} className="announcement-item">
                <div className="item-header">
                  <div className="item-info">
                    <h3>{n.titulo}</h3>
                    <p>{n.contenido}</p>

                    <div className="item-meta">
                      <span>{formatFecha(n.fecha)}</span>

                      {n.imagen_url && (
                        <span>
                          Imagen:{" "}
                          <a href={apiBase + n.imagen_url} target="_blank" rel="noreferrer">
                            Ver
                          </a>
                        </span>
                      )}

                      {n.archivo_url && (
                        <span>
                          Archivo:{" "}
                          <a href={apiBase + n.archivo_url} target="_blank" rel="noreferrer">
                            Descargar
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => startEdit(n)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => eliminar(n.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
