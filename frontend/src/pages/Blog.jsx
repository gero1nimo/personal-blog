import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../services/api';

// Kart vurgu rengi backend'de yok; sıraya göre sabit bir renk döngüsü kullanıyoruz.
const colorMap = {
  blue: { border: 'hover:border-blue-400/50', accent: 'text-blue-400', bg: 'bg-blue-400/10' },
  purple: { border: 'hover:border-purple-400/50', accent: 'text-purple-400', bg: 'bg-purple-400/10' },
  pink: { border: 'hover:border-pink-400/50', accent: 'text-pink-400', bg: 'bg-pink-400/10' },
};
const colorKeys = ['blue', 'purple', 'pink'];

// createdAt (ISO) -> "Dec 15, 2024"
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError('');
        // Etiket filtresi backend'de ?tag= ile; arama istemci tarafında yapılır.
        const data = await blogApi.getAll({
          size: 100,
          ...(selectedTag !== 'all' ? { tag: selectedTag } : {}),
        });
        if (cancelled) return;
        const items = data?.items ?? [];
        setPosts(items);
        // Çip listesini yalnızca filtresiz ("all") yüklemede tazele ki çipler sabit kalsın.
        if (selectedTag === 'all') {
          setAllTags(['all', ...new Set(items.flatMap((post) => post.tags ?? []))]);
        }
      } catch {
        if (cancelled) return;
        setPosts([]);
        setError('Failed to load articles. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [selectedTag, reloadKey]);

  // Arama: başlık + özet (summary) üzerinde istemci tarafı filtre.
  const filteredPosts = posts.filter((post) => {
    const q = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      (post.summary ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-xs tracking-[0.3em] uppercase font-medium">Latest Articles</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Insights &
              <span className="block gradient-text-accent">Tutorials</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
              Deep dives into backend development, DevOps practices,
              and the technologies that power modern applications.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              <div>
                <p className="text-3xl font-bold text-white">{posts.length}</p>
                <p className="text-gray-500 text-sm">Articles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{allTags.length - 1}</p>
                <p className="text-gray-500 text-sm">Topics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-black/80 backdrop-blur-md border-y border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search articles, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap justify-center">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-sm font-medium tracking-wider rounded-full transition-all ${
                  selectedTag === tag
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                {tag === 'all' ? 'ALL' : tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-6">{error}</p>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <p className="text-gray-500 mb-10 text-sm tracking-wider">
                SHOWING {filteredPosts.length} OF {posts.length} ARTICLES
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post, idx) => {
                  const colors = colorMap[colorKeys[idx % colorKeys.length]];
                  return (
                    <article
                      key={post.id}
                      className={`group relative bg-gray-900/30 border border-gray-800 rounded-2xl p-8 ${colors.border} transition-all duration-300 hover:shadow-xl`}
                    >
                      {/* Date & Read time */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
                        {post.readingTime ? (
                          <span className={`text-xs font-medium ${colors.accent}`}>{post.readingTime} min read</span>
                        ) : null}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags ?? []).map((tag, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.accent}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:gradient-text-accent transition-all leading-tight">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-end pt-4 border-t border-gray-800">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-white text-sm font-medium hover:gap-4 transition-all"
                        >
                          Read Article
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('all');
                }}
                className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
