import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminBlogApi,
  adminProjectsApi,
  adminContactApi,
  getErrorMessage,
} from "../../services/api";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
};

const StatCard = ({ label, value, to }) => (
  <Link
    to={to}
    className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
  >
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ posts: 0, projects: 0, unread: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [blogs, projects, unread] = await Promise.all([
          adminBlogApi.getAll({ size: 5 }),
          adminProjectsApi.getAll({ size: 5 }),
          adminContactApi.getAll({ size: 1, isRead: false }),
        ]);
        if (cancelled) return;
        setStats({
          posts: blogs?.total ?? 0,
          projects: projects?.total ?? 0,
          unread: unread?.total ?? 0,
        });
        // Backend liste sıralaması sözleşmede yok; "son eklenenler" için createdAt'e göre istemcide sıralıyoruz.
        const merged = [
          ...(blogs?.items ?? []).map((b) => ({
            id: `blog-${b.id}`,
            type: "Yazı",
            title: b.title,
            createdAt: b.createdAt,
          })),
          ...(projects?.items ?? []).map((p) => ({
            id: `project-${p.id}`,
            type: "Proje",
            title: p.name,
            createdAt: p.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setRecent(merged);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Veriler yüklenemedi."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontrol Paneli</h2>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Toplam Yazı" value={loading ? "…" : stats.posts} to="/admin/blog" />
        <StatCard label="Toplam Proje" value={loading ? "…" : stats.projects} to="/admin/projects" />
        <StatCard label="Okunmamış Mesaj" value={loading ? "…" : stats.unread} to="/admin/contact" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Son Eklenenler</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Tür</th>
              <th className="px-6 py-3 font-medium">Başlık</th>
              <th className="px-6 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                  Yükleniyor...
                </td>
              </tr>
            ) : recent.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                  Henüz kayıt yok.
                </td>
              </tr>
            ) : (
              recent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{item.title}</td>
                  <td className="px-6 py-3 text-gray-500">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
