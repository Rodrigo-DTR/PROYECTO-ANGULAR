import { Navigate } from 'react-router-dom'
import Home from '../views/Home'
import Login from '../views/Login'
import Register from '../views/Register'
import Dashboard from '../views/Dashboard'
import ProfileEdit from '../views/ProfileEdit'
import AdminPanel from '../views/AdminPanel'

const isAuthenticated = () => {
  const raw = localStorage.getItem('usuario')
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem('usuario')
    return null
  }
}
const getRol = () => {
  const raw = localStorage.getItem('usuario');
  try {
    const u = raw ? JSON.parse(raw) : null;
    return u?.rol || localStorage.getItem('rol');
  } catch {
    return localStorage.getItem('rol');
  }
}

const RequireAuth = ({ children }) => {
  const usuario = isAuthenticated();
  return usuario ? children : <Navigate to="/login" />;
};

const RequireAdmin = ({ children }) => {
  const usuario = isAuthenticated();
  const rol = getRol();
  return usuario && rol === 'admin' ? children : <Navigate to="/" />;
};
export const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: <RequireAuth><Dashboard /></RequireAuth>
  },
  {
    path: '/perfil',
    element: <RequireAuth><ProfileEdit /></RequireAuth>
  },
  {
    path: '/admin',
    element: <RequireAdmin><AdminPanel /></RequireAdmin>
  }
]
