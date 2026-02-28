import { useState, useEffect } from 'react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const mockPosts = [
    {
      id: 1,
      title: 'Getting Started with FastAPI: A Complete Guide',
      content: 'FastAPI is a modern, fast web framework for building APIs with Python 3.7+. In this comprehensive guide, we will explore how to set up a FastAPI project from scratch, implement authentication, and deploy to production.',
      tags: ['Python', 'FastAPI', 'Backend'],
      published: true,
      views: 1250,
      readTime: '8 min read',
      date: 'Dec 15, 2024',
      color: 'blue',
    },
    {
      id: 2,
      title: 'Docker Best Practices for Production',
      content: 'Learn how to optimize your Docker containers for production environments. We cover multi-stage builds, security considerations, performance tuning, and orchestration strategies.',
      tags: ['Docker', 'DevOps', 'Infrastructure'],
      published: true,
      views: 980,
      readTime: '12 min read',
      date: 'Dec 10, 2024',
      color: 'purple',
    },
    {
      id: 3,
      title: 'Building CI/CD Pipelines with GitHub Actions',
      content: 'Automate your deployment workflow using GitHub Actions. This tutorial covers everything from basic workflows to advanced deployment strategies and monitoring.',
      tags: ['DevOps', 'CI/CD', 'Git'],
      published: true,
      views: 756,
      readTime: '10 min read',
      date: 'Dec 5, 2024',
      color: 'pink',
    },
    {
      id: 4,
      title: 'Laravel vs FastAPI: When to Use What',
      content: 'A comparison of Laravel and FastAPI for backend development. We examine performance benchmarks, ecosystem maturity, and ideal use cases for each framework.',
      tags: ['Laravel', 'FastAPI', 'Backend'],
      published: true,
      views: 543,
      readTime: '6 min read',
      date: 'Nov 28, 2024',
      color: 'blue',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag && post.published;
  });

  const colorMap = {
    blue: { border: 'hover:border-blue-400/50', accent: 'text-blue-400', bg: 'bg-blue-400/10' },
    purple: { border: 'hover:border-purple-400/50', accent: 'text-purple-400', bg: 'bg-purple-400/10' },
    pink: { border: 'hover:border-pink-400/50', accent: 'text-pink-400', bg: 'bg-pink-400/10' },
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

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
                <p className="text-3xl font-bold text-white">{posts.reduce((acc, p) => acc + p.views, 0).toLocaleString()}</p>
                <p className="text-gray-500 text-sm">Total Views</p>
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
          ) : filteredPosts.length > 0 ? (
            <>
              <p className="text-gray-500 mb-10 text-sm tracking-wider">
                SHOWING {filteredPosts.length} OF {posts.filter(p => p.published).length} ARTICLES
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post, idx) => {
                  const colors = colorMap[post.color] || colorMap.blue;
                  return (
                    <article 
                      key={post.id} 
                      className={`group relative bg-gray-900/30 border border-gray-800 rounded-2xl p-8 ${colors.border} transition-all duration-300 hover:shadow-xl`}
                    >
                      {/* Date & Read time */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-gray-500 text-sm">{post.date}</span>
                        <span className={`text-xs font-medium ${colors.accent}`}>{post.readTime}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
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
                        {post.content}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.views.toLocaleString()} views
                        </div>
                        <a 
                          href="#" 
                          className="inline-flex items-center gap-2 text-white text-sm font-medium hover:gap-4 transition-all"
                        >
                          Read Article
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
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

      {/* Newsletter Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 text-center relative">
          {subscribed ? (
            <div className="py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-400/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h2>
              <p className="text-gray-400">Thank you for subscribing. You'll receive updates on new articles.</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-400/10 rounded-full mb-6">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-purple-400 text-sm font-medium">Stay Updated</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Subscribe to
                <span className="gradient-text-accent"> My Newsletter</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Get the latest articles, tutorials, and insights delivered straight to your inbox. 
                No spam, unsubscribe anytime.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-gray-900/50 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20 flex items-center justify-center gap-2"
                >
                  Subscribe
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
