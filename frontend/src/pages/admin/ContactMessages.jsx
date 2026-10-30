import { useEffect, useState } from "react";
import { adminContactApi, getErrorMessage } from "../../services/api";
import DataTable from "../../components/admin/DataTable";

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "unread", label: "Okunmamış" },
  { key: "read", label: "Okunmuş" },
];

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
};

const ContactMessages = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        // adminContactApi, isRead tanımlıysa ?is_read= olarak gönderir; 'all'da parametre yok.
        const isRead = filter === "all" ? undefined : filter === "read";
        const data = await adminContactApi.getAll({ page, size: 20, isRead });
        if (cancelled) return;
        setItems(data?.items ?? []);
        setPages(data?.pages ?? 1);
        setTotal(data?.total ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Mesajlar yüklenemedi."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, filter, reloadKey]);

  const toggleRead = async (row) => {
    try {
      await adminContactApi.markRead(row.id, !row.isRead); // PATCH { isRead }
      setSelected((s) => (s && s.id === row.id ? { ...s, isRead: !row.isRead } : s));
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Güncellenemedi."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await adminContactApi.remove(id);
      setSelected((s) => (s && s.id === id ? null : s));
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Silinemedi."));
    }
  };

  const columns = [
    {
      key: "name",
      label: "Gönderen",
      render: (r) => <span className="font-medium text-gray-900">{r.name}</span>,
    },
    { key: "email", label: "E-posta", render: (r) => <span className="text-gray-600">{r.email}</span> },
    { key: "subject", label: "Konu" },
    {
      key: "isRead",
      label: "Durum",
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            r.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"
          }`}
        >
          {r.isRead ? "Okundu" : "Okunmadı"}
        </span>
      ),
    },
    { key: "createdAt", label: "Tarih", render: (r) => formatDate(r.createdAt) },
  ];

  const renderActions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => setSelected(row)}
        className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
      >
        Görüntüle
      </button>
      <button
        type="button"
        onClick={() => toggleRead(row)}
        className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
      >
        {row.isRead ? "Okunmadı yap" : "Okundu yap"}
      </button>
      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        className="px-3 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
      >
        Sil
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Mesajları</h2>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm rounded-lg border ${
              filter === f.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyText="Mesaj yok."
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        renderActions={renderActions}
      />

      {selected && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selected.name} · {selected.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(selected.createdAt)}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-700 text-sm"
            >
              Kapat
            </button>
          </div>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{selected.message}</p>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
