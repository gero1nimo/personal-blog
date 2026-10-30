import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, clearToken } from "../../services/api";

const AdminTopbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const data = await authApi.me(); // GET /auth/me
        if (!cancelled) setUser(data);
      } catch {
        // 401 durumunda api.js interceptor'ı zaten login'e yönlendirir; burada sessiz geçiyoruz.
      }
    };

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  const displayName = user?.name ?? user?.email ?? "Yönetici";

  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Yönetim Paneli</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Hoş geldin, {displayName}</span>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Çıkış Yap
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
