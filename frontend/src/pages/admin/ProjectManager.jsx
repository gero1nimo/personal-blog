import { useEffect, useState } from "react";
import { adminProjectsApi, getErrorMessage } from "../../services/api";
import DataTable from "../../components/admin/DataTable";

const STATUS_OPTIONS = [
  { value: "planned", label: "Planlanıyor" },
  { value: "in-progress", label: "Devam Ediyor" },
  { value: "completed", label: "Tamamlandı" },
  { value: "archived", label: "Arşivlendi" },
];
const statusLabel = (s) => STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;

const emptyForm = {
  name: "",
  description: "",
  status: "planned",
  tags: "",
  techStack: "",
  link: "",
  githubLink: "",
  featured: false,
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
};

const toTagsArray = (str) =>
  str
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const ProjectManager = () => {
  const [view, setView] = useState("list");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await adminProjectsApi.getAll({ page, size: 20 });
        if (cancelled) return;
        setItems(data?.items ?? []);
        setPages(data?.pages ?? 1);
        setTotal(data?.total ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Projeler yüklenemedi."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, reloadKey]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOriginal(null);
    setFormError("");
    setView("form");
  };

  const openEdit = async (id) => {
    setFormError("");
    try {
      const data = await adminProjectsApi.getById(id);
      const loaded = {
        name: data.name ?? "",
        description: data.description ?? "",
        status: data.status ?? "planned",
        tags: (data.tags ?? []).join(", "),
        techStack: (data.techStack ?? []).join(", "),
        link: data.link ?? "",
        githubLink: data.githubLink ?? "",
        featured: !!data.featured,
      };
      setEditingId(id);
      setForm(loaded);
      setOriginal(loaded);
      setView("form");
    } catch (err) {
      setError(getErrorMessage(err, "Proje yüklenemedi."));
    }
  };

  const buildCreatePayload = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      tags: toTagsArray(form.tags),
      techStack: toTagsArray(form.techStack),
      featured: form.featured,
    };
    // Boş URL alanlarını göndermiyoruz (URL doğrulamasına takılmasın).
    if (form.link.trim()) payload.link = form.link.trim();
    if (form.githubLink.trim()) payload.githubLink = form.githubLink.trim();
    return payload;
  };

  const buildPatchPayload = () => {
    const patch = {};
    if (form.name.trim() !== original.name) patch.name = form.name.trim();
    if (form.description.trim() !== original.description) patch.description = form.description.trim();
    if (form.status !== original.status) patch.status = form.status;
    const newTags = toTagsArray(form.tags);
    if (JSON.stringify(newTags) !== JSON.stringify(toTagsArray(original.tags))) {
      patch.tags = newTags;
    }
    const newTech = toTagsArray(form.techStack);
    if (JSON.stringify(newTech) !== JSON.stringify(toTagsArray(original.techStack))) {
      patch.techStack = newTech;
    }
    if (form.link.trim() !== original.link) patch.link = form.link.trim();
    if (form.githubLink.trim() !== original.githubLink) patch.githubLink = form.githubLink.trim();
    if (form.featured !== original.featured) patch.featured = form.featured;
    return patch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId == null) {
        await adminProjectsApi.create(buildCreatePayload());
      } else {
        const patch = buildPatchPayload();
        if (Object.keys(patch).length > 0) {
          await adminProjectsApi.update(editingId, patch); // PATCH: yalnızca değişen alanlar
        }
      }
      setView("list");
      setForm(emptyForm);
      setEditingId(null);
      setOriginal(null);
      setPage(1);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setFormError(getErrorMessage(err, "Kaydedilemedi."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      await adminProjectsApi.remove(id);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Silinemedi."));
    }
  };

  const columns = [
    {
      key: "name",
      label: "Ad",
      render: (r) => <span className="font-medium text-gray-900">{r.name}</span>,
    },
    {
      key: "status",
      label: "Durum",
      render: (r) => (
        <div className="flex gap-2">
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
            {statusLabel(r.status)}
          </span>
          {r.featured ? (
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
              Öne çıkan
            </span>
          ) : null}
        </div>
      ),
    },
    { key: "createdAt", label: "Tarih", render: (r) => formatDate(r.createdAt) },
  ];

  const renderActions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => openEdit(row.id)}
        className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
      >
        Düzenle
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

  if (view === "form") {
    return (
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId == null ? "Yeni Proje" : "Projeyi Düzenle"}
          </h2>
          <button
            type="button"
            onClick={() => setView("list")}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Listeye dön
          </button>
        </div>

        {formError && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
            {formError}
          </div>
        )}

        <div className="space-y-5 bg-white p-6 rounded-xl border border-gray-200">
          <Field label="Ad">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Açıklama">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Durum">
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Etiketler (virgülle ayırın)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="web, api"
              className={inputClass}
            />
          </Field>

          <Field label="Teknolojiler (virgülle ayırın)">
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => setField("techStack", e.target.value)}
              placeholder="Python, FastAPI, Docker"
              className={inputClass}
            />
          </Field>

          <Field label="Canlı Bağlantı (link)">
            <input
              type="url"
              value={form.link}
              onChange={(e) => setField("link", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>

          <Field label="GitHub Bağlantısı">
            <input
              type="url"
              value={form.githubLink}
              onChange={(e) => setField("githubLink", e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField("featured", e.target.checked)}
            />
            Öne çıkan
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
          >
            İptal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Proje Yönetimi</h2>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500"
        >
          Yeni Proje
        </button>
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
        emptyText="Henüz proje yok."
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        renderActions={renderActions}
      />
    </div>
  );
};

export default ProjectManager;
