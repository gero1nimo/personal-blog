import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogApi } from '../services/api';

// createdAt (ISO) -> "Dec 15, 2024"
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await blogApi.getBySlug(slug); // GET /blogs/slug/{slug}
        if (cancelled) return;
        setPost(data ?? null);
      } catch (err) {
        if (cancelled) return;
        setPost(null);
        setError(
          err.response?.status === 404
            ? 'Article not found.'
            : 'This article could not be loaded.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-3xl mx-auto px-8 py-32 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Article not found.'}</h1>
          <p className="text-gray-500 mb-8">
            The article you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // İçerik güvenli biçimde gösterilir: HTML basılmaz, düz metin paragraflarına bölünür.
  // React metni otomatik escape eder; whitespace-pre-line tek satır sonlarını korur.
  const paragraphs = (post.content ?? '')
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-3xl mx-auto px-8 py-20 md:py-28">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors mb-10"
        >
          ← Back to Blog
        </Link>

        {/* Tags */}
        {(post.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium rounded-full bg-purple-400/10 text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-10">
          <span>{formatDate(post.createdAt)}</span>
          {post.readingTime ? (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-700"></span>
              <span>{post.readingTime} min read</span>
            </>
          ) : null}
        </div>

        {/* Cover image */}
        {post.coverImgUrl ? (
          <img
            src={post.coverImgUrl}
            alt={post.title}
            className="w-full rounded-2xl border border-gray-800 mb-10 object-cover"
          />
        ) : null}

        {/* Content */}
        <div className="space-y-6">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line"
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-gray-500">{post.summary}</p>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
