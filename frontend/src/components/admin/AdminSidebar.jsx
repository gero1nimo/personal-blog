import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Kontrol Paneli" },
  { to: "/admin/blog", label: "Blog Yönetimi" },
  { to: "/admin/projects", label: "Proje Yönetimi" },
  { to: "/admin/contact", label: "İletişim Mesajları" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 shrink-0 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-800">Admin Panel</div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
