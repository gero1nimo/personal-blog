const AdminTopbar = () => {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Yönetim Paneli</h1>
      <div>
        <span className="text-sm text-gray-500 mr-4">Hoş geldin, Mehmet Akif</span>
        <button className="text-red-500 hover:text-red-700 text-sm">Çıkış Yap</button>
      </div>
    </header>
  );
};

export default AdminTopbar;