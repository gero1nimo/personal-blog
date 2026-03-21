import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Az önce yazdığımız Axios motoru

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // DİKKAT: FastAPI varsayılan olarak OAuth2 kullanır ve login verisini 
      // JSON olarak değil, Form Data (application/x-www-form-urlencoded) olarak bekler.
      // Bu yüzden veriyi URLSearchParams ile paketliyoruz.
      const params = new URLSearchParams();
      params.append('username', email); // FastAPI OAuth2 varsayılan olarak 'username' alanı arar
      params.append('password', password);

      const response = await api.post('/login/access-token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Backend'den gelen token'ı yakala (Genelde access_token olarak döner)
      const { access_token } = response.data;

      if (access_token) {
        // Token'ı tarayıcıya kaydet
        localStorage.setItem('access_token', access_token);
        
        // Başarılı giriş sonrası Dashboard'a yönlendir
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      // Backend'den gelen spesifik bir hata mesajı varsa onu göster, yoksa genel mesaj ver
      setError(
        err.response?.data?.detail || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-wider text-black border-black inline-block px-4 py-2 border">
            YÖNETİCİ GİRİŞİ
          </h1>
          <div className="mt-4 text-gray-400 tracking-widest">-///-</div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm border-l-4 border-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="E-POSTA ADRESİ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="ŞİFRE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-black text-white font-bold py-3 px-4 tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center"
          >
            {loading ? 'YÜKLENİYOR...' : '| GİRİŞ YAP |'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          Güvenli bağlantı sağlanmaktadır.
        </div>
      </div>
    </div>
  );
};

export default Login;