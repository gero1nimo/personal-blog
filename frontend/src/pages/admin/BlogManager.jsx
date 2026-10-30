import { useEffect, useState } from "react";
import { adminBlogApi, mediaApi, getErrorMessage } from "../../services/api";
import DataTable from "../../components/admin/DataTable";

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  tags: "",
  coverImgUrl: "",
  isPublished: false,
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

const BlogManager = () => {
  const [view, setView] = useState("list"); // list | form
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(null); // PATCH diff'i için
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await adminBlogApi.getAll({ page, size: 20 });
        if (cancelled) return;
        setItems(data?.items ?? []);
        setPages(data?.pages ?? 1);
        setTotal(data?.total ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Yazılar yüklenemedi."));
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
      // Liste (BlogListItem) content içermez; düzenleme için tam kaydı çekiyoruz.
      const data = await adminBlogApi.getById(id);
      const loaded = {
        title: data.title ?? "",
        summary: data.summary ?? "",
        content: data.content ?? "",
        tags: (data.tags ?? []).join(", "),
        coverImgUrl: data.coverImgUrl ?? "",
        isPublished: !!data.isPublished,
        featured: !!data.featured,
      };
      setEditingId(id);
      setForm(loaded);
      setOriginal(loaded);
      setView("form");
    } catch (err) {
      setError(getErrorMessage(err, "Yazı yüklenemedi."));
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const res = await mediaApi.upload(file); // ImageKit'e doğrudan yükler; { url, fileId, ... }
      setField("coverImgUrl", res.url);
    } catch (err) {
      setFormError(getErrorMessage(err, "Görsel yüklenemedi."));
    } finally {
      setUploading(false);
    }
  };

  const buildCreatePayload = () => {
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content,
      tags: toTagsArray(form.tags),
      isPublished: form.isPublished,
      featured: form.featured,
    };
    // Boş coverImgUrl göndermiyoruz (URL doğrulamasına takılmasın); slug/readingTime backend üretir.
    if (form.coverImgUrl) payload.coverImgUrl = form.coverImgUrl;
    return payload;
  };

  const buildPatchPayload = () => {
    const patch = {};
    if (form.title.trim() !== original.title) patch.title = form.title.trim();
    if (form.summary.trim() !== original.summary) patch.summary = form.summary.trim();
    if (form.content !== original.content) patch.content = form.content;
    const newTags = toTagsArray(form.tags);
    if (JSON.stringify(newTags) !== JSON.stringify(toTagsArray(original.tags))) {
      patch.tags = newTags;
    }
    if (form.coverImgUrl !== original.coverImgUrl) patch.coverImgUrl = form.coverImgUrl;
    if (form.isPublished !== original.isPublished) patch.isPublished = form.isPublished;
    if (form.featured !== original.featured) patch.featured = form.featured;
    return patch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId == null) {
        await adminBlogApi.create(buildCreatePayload());
      } else {
        const patch = buildPatchPayload();
        if (Object.keys(patch).length > 0) {
          await adminBlogApi.update(editingId, patch); // PATCH: yalnızca değişen alanlar
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
    if (!window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    try {
      await adminBlogApi.remove(id);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Silinemedi."));
    }
  };

  const columns = [
    {
      key: "title",
      label: "Başlık",
      render: (r) => <span className="font-medium text-gray-900">{r.title}</span>,
    },
    {
      key: "isPublished",
      label: "Durum",
      render: (r) => (
        <div className="flex gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              r.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {r.isPublished ? "Yayında" : "Taslak"}
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
            {editingId == null ? "Yeni Yazı" : "Yazıyı Düzenle"}
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
          <Field label="Başlık">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Özet">
            <textarea
              rows={2}
              value={form.summary}
              onChange={(e) => setField("summary", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="İçerik">
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Etiketler (virgülle ayırın)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="Python, FastAPI"
              className={inputClass}
            />
          </Field>

          <Field label="Kapak Görseli">
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
            {uploading && <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>}
            {form.coverImgUrl && (
              <img
                src={form.coverImgUrl}
                alt="Kapak önizleme"
                className="mt-3 h-32 rounded-lg border border-gray-200 object-cover"
              />
            )}
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setField("isPublished", e.target.checked)}
              />
              Yayında
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField("featured", e.target.checked)}
              />
              Öne çıkan
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
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
        <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500"
        >
          Yeni Yazı
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
        emptyText="Henüz yazı yok."
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        renderActions={renderActions}
      />
    </div>
  );
};

export default BlogManager;
