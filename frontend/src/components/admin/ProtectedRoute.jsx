import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Gerçek senaryoda bu token'ı state management (Redux/Zustand) veya context API'den de alabilirsin.
  // Şimdilik en basit yöntem olan localStorage üzerinden okuyoruz.
  const token = localStorage.getItem('access_token');

  if (!token) {
    // Token yoksa giriş yapılmamıştır. /admin/login sayfasına yönlendir.
    // 'replace' prop'u, kullanıcının geri tuşuna basıp tekrar bu sayfaya dönmesini engeller.
    return <Navigate to="/admin/login" replace />;
  }

  // Token varsa sıkıntı yok, iç içe geçmiş rotaları (Outlet) render et.
  return <Outlet />;
};

export default ProtectedRoute;