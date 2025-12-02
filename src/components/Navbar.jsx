import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css' // aquí pones tus estilos
import logo from '/src/assets/ITO.png';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Cargar usuario desde localStorage
  const cargarUsuario = () => {
    const raw = localStorage.getItem('usuario')
    if (raw) {
      try {
        setUsuario(JSON.parse(raw))
      } catch (e) {
        setUsuario(null)
        localStorage.removeItem('usuario')
      }
    } else {
      setUsuario(null)
    }
    setRol(localStorage.getItem('rol'))
  }

  useEffect(() => {
    cargarUsuario()
  }, [])

  // Cada vez que cambias de ruta, refresca datos
  useEffect(() => {
    cargarUsuario()
  }, [location.pathname])

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const irPerfil = () => {
    setShowMenu(false)
    navigate('/perfil')
  }

  const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
    localStorage.removeItem('token')
    setUsuario(null)
    setRol(null)
    setShowMenu(false)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          Instituto Tecnológico de Orizaba
        </Link>
      </div>

      {/* Centered logo */}
      <div className="brand-center">
        <Link to="/" className="brand-link-center">
          <img src={logo} alt="ITO" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-menu">
        {/* Menú central vacío */}
      </div>

      <div className="navbar-user">
        {/* Panel de control solo para admin */}
        {usuario && rol === 'admin' && (
          <Link to="/admin" className="btn-nav btn-admin">
            Panel de control
          </Link>
        )}

        {/* Dropdown de usuario */}
        {usuario ? (
          <div className="user-dropdown">
            <button onClick={toggleMenu} className="btn-user">
              👤 {usuario.nombre}
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={irPerfil} className="dropdown-item">
                  Modificar Perfil
                </button>
                <button onClick={logout} className="dropdown-item">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-primary">Iniciar sesión</Link>
            <Link to="/register" className="btn-secondary">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
