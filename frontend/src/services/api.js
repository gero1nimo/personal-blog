import axios from 'axios';

// Backend adresi .env dosyasından gelir: VITE_API_URL=http://localhost:8000/api/v1
// (Vite sadece VITE_ önekli değişkenleri tarayıcıya açar.)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

// ImageKit'in doğrudan yükleme adresi (dosya backend'e değil buraya gider)
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

// ---------------------------------------------------------------- token yönetimi
// Token anahtarı tek yerde tanımlı; Login, ProtectedRoute ve interceptor hep bunu kullanır.
export const TOKEN_KEY = 'access_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Token var mı ve süresi dolmamış mı? (İmzayı doğrulamaz; gerçek doğrulamayı backend 401 ile yapar.)
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------- axios örneği
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      // Token süresi doldu (15 dk) ya da geçersiz: temizle ve giriş sayfasına gönder
      clearToken();
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Backend hatasını ekranda gösterilebilir bir metne çevirir.
// 401/404/409 -> detail metin, 422 -> detail dizi, 429 -> slowapi gövdesinde detail yok.
export function getErrorMessage(err, fallback = 'Bir hata oluştu. Lütfen tekrar deneyin.') {
  if (!err?.response) return 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.';
  const { status, data } = err.response;
  if (status === 429) return 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.';
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((d) => d.msg).join(' ');
  }
  return fallback;
}

// ---------------------------------------------------------------- Auth
export const authApi = {
  // Backend OAuth2PasswordRequestForm kullanıyor: JSON değil form verisi, e-posta "username" alanında.
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // { access_token, token_type }
  },
  me: async () => (await api.get('/auth/me')).data,
};

// ---------------------------------------------------------------- Public: projeler
// Liste uçları sayfalı döner: { items, total, page, size, pages }
export const projectsApi = {
  getAll: async ({ page = 1, size = 20 } = {}) =>
    (await api.get('/projects/', { params: { page, size } })).data,
  getById: async (id) => (await api.get(`/projects/${id}`)).data,
  getBySlug: async (slug) => (await api.get(`/projects/slug/${encodeURIComponent(slug)}`)).data,
};

// ---------------------------------------------------------------- Public: blog
// Public tarafta sadece yayınlanmış (isPublished) yazılar gelir.
export const blogApi = {
  getAll: async ({ page = 1, size = 20, tag } = {}) =>
    (await api.get('/blogs/', { params: { page, size, ...(tag ? { tag } : {}) } })).data,
  getById: async (id) => (await api.get(`/blogs/${id}`)).data,
  getBySlug: async (slug) => (await api.get(`/blogs/slug/${encodeURIComponent(slug)}`)).data,
};

// ---------------------------------------------------------------- Public: iletişim formu
// Başarıda 201 ve { ok: true }. `website` honeypot alanıdır: gerçek kullanıcı boş bırakır.
export const contactApi = {
  send: async ({ name, email, subject, message, website = '' }) =>
    (await api.post('/contact/', { name, email, subject, message, website })).data,
};

// ---------------------------------------------------------------- Admin (token gerekir)
const adminCrud = (resource) => ({
  getAll: async ({ page = 1, size = 20 } = {}) =>
    (await api.get(`/admin/${resource}/`, { params: { page, size } })).data,
  getById: async (id) => (await api.get(`/admin/${resource}/${id}`)).data,
  create: async (data) => (await api.post(`/admin/${resource}/`, data)).data,
  update: async (id, data) => (await api.patch(`/admin/${resource}/${id}`, data)).data, // kısmi güncelleme
  replace: async (id, data) => (await api.put(`/admin/${resource}/${id}`, data)).data,
  remove: async (id) => {
    await api.delete(`/admin/${resource}/${id}`); // 204, gövde yok
  },
});

export const adminProjectsApi = adminCrud('projects');
export const adminBlogApi = adminCrud('blogs');

export const adminContactApi = {
  // isRead: true | false | undefined (undefined -> hepsi). Sorgu parametresi backend'de `is_read`.
  getAll: async ({ page = 1, size = 20, isRead } = {}) =>
    (
      await api.get('/admin/contact/', {
        params: { page, size, ...(isRead === undefined ? {} : { is_read: isRead }) },
      })
    ).data,
  getById: async (id) => (await api.get(`/admin/contact/${id}`)).data,
  markRead: async (id, isRead = true) => (await api.patch(`/admin/contact/${id}`, { isRead })).data,
  remove: async (id) => {
    await api.delete(`/admin/contact/${id}`);
  },
};

// ---------------------------------------------------------------- ImageKit (signed upload)
export const mediaApi = {
  // { token, expire, signature, publicKey, urlEndpoint }
  getUploadAuth: async () => (await api.get('/admin/media/auth')).data,

  // Dosya backend'e uğramaz: önce imza alınır, sonra doğrudan ImageKit'e yüklenir.
  // Dönen nesnede `url` (coverImgUrl'e yazılacak) ve `fileId` (silmek için saklanır) bulunur.
  upload: async (file) => {
    const auth = await mediaApi.getUploadAuth();
    const form = new FormData();
    form.append('file', file);
    form.append('fileName', file.name);
    form.append('publicKey', auth.publicKey);
    form.append('signature', auth.signature);
    form.append('expire', String(auth.expire));
    form.append('token', auth.token);
    // Üçüncü taraf adrese bizim Bearer token'ımızı göndermemek için `api` değil çıplak axios
    const response = await axios.post(IMAGEKIT_UPLOAD_URL, form);
    return response.data;
  },

  remove: async (fileId) => {
    await api.delete(`/admin/media/${encodeURIComponent(fileId)}`);
  },
};

// ---------------------------------------------------------------- Profil
// Backend'de profil ucu yok (tek kullanıcılı site). Hero bileşeni bu fonksiyonu çağırdığı
// için bilerek null döner; Hero kendi varsayılan değerlerine düşer.
export const profileApi = {
  get: async () => null,
};
