import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import ProfileEdit from './views/ProfileEdit'
import AdminPanel from './views/AdminPanel'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<ProfileEdit />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
