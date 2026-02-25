import { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock blog posts - Replace with actual API call
  const mockPosts = [
    {
      id: 1,
      title: 'Getting Started with FastAPI: A Complete Guide',
      content: 'FastAPI is a modern, fast web framework for building APIs with Python 3.7+. In this comprehensive guide, we will explore how to set up a FastAPI project from scratch, create endpoints, handle authentication, and deploy to production. FastAPI offers automatic documentation, type checking, and incredible performance.',
      tags: ['Python', 'FastAPI', 'Backend'],
      published: true,
      views: 1250,
    },
    {
      id: 2,
      title: 'React State Management: Context API vs Redux',
      content: 'Choosing the right state management solution for your React application can be challenging. In this article, we compare React Context API with Redux, discussing their pros and cons, use cases, and when to choose one over the other. We will also look at modern alternatives like Zustand and Jotai.',
      tags: ['React', 'JavaScript', 'Frontend'],
      published: true,
      views: 980,
    },
    {
      id: 3,
      title: 'Building Responsive UIs with Tailwind CSS',
      content: 'Tailwind CSS has revolutionized the way we write CSS. Learn how to leverage utility-first CSS to build beautiful, responsive user interfaces faster than ever. We will cover responsive design principles, custom configurations, and best practices for maintaining clean code.',
      tags: ['CSS', 'Tailwind', 'Frontend'],
      published: true,
      views: 756,
    },
    {
      id: 4,
      title: 'Deploying Full-Stack Applications with Docker',
      content: 'Docker simplifies deployment by containerizing your applications. This tutorial walks through containerizing a full-stack application with React frontend and FastAPI backend, setting up Docker Compose for development, and best practices for production deployments.',
      tags: ['Docker', 'DevOps', 'Deployment'],
      published: true,
      views: 543,
    },
    {
      id: 5,
      title: 'Authentication Patterns in Modern Web Apps',
      content: 'Security is crucial for any web application. Explore different authentication patterns including JWT, OAuth 2.0, and session-based authentication. Learn how to implement secure authentication in your FastAPI backend and React frontend.',
      tags: ['Security', 'Authentication', 'Backend'],
      published: true,
      views: 892,
    },
    {
      id: 6,
      title: 'Working with PostgreSQL and SQLModel',
      content: 'SQLModel combines the best of SQLAlchemy and Pydantic for working with databases in Python. Learn how to define models, create relationships, perform queries, and manage migrations in your FastAPI applications.',
      tags: ['Python', 'Database', 'PostgreSQL'],
      published: true,
      views: 421,
    },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try to fetch from API
        // const data = await blogApi.getAll();
        // setPosts(data);

        // Using mock data
        setTimeout(() => {
          setPosts(mockPosts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(mockPosts);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get all unique tags
  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag && post.published;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development, programming, 
            and technology.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag === 'all' ? 'All Posts' : tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              {/* Results count */}
              <p className="text-gray-600 mb-8">
                Showing {filteredPosts.length} of {posts.filter(p => p.published).length} articles
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('all');
                }}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Subscribe to my Newsletter
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Get the latest articles, tutorials, and updates delivered straight to your inbox. 
            No spam, unsubscribe anytime.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
