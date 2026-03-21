const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-800">Admin Panel</div>
      <nav className="flex-1 p-4">
        {/* Menü linkleri daha sonra eklenecek */}
        <ul className="space-y-2">
          <li>Kontrol Paneli</li>
          <li>Blog Yönetimi</li>
          <li>Proje Yönetimi</li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar; // İşte hataya sebep olan eksik kısım buydu!