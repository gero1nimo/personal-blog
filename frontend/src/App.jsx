import { Routes, Route, useLocation } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Blog from './pages/Blog'
import ProjectDetail from './pages/ProjectDetail'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProjectManager from './pages/admin/ProjectManager'
import BlogManager from './pages/admin/BlogManager'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (

      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />

        {/* --- KORUMALI YÖNETİCİ (ADMIN) ROTALARI --- */}
        {/* Önce ProtectedRoute'tan geçiyoruz, geçersek AdminLayout iskeleti giydiriliyor */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/blog" element={<BlogManager />} />
            <Route path="/admin/projects" element={<ProjectManager />} />
          </Route>
        </Route>
      </Routes>

  )
}

export default App
