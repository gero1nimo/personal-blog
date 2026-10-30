import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../../services/api';

const ProtectedRoute = () => {
  // Token yoksa ya da süresi dolmuşsa (backend token ömrü 15 dk) giriş sayfasına yönlendir.
  // 'replace' prop'u, kullanıcının geri tuşuyla bu sayfaya dönmesini engeller.
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token geçerliyse iç içe geçmiş rotaları (Outlet) render et.
  return <Outlet />;
};

export default ProtectedRoute;
