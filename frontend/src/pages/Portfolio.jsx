import { useState, useEffect } from 'react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual API call when backend is ready
  const mockProjects = [
    {
      id: 1,
      name: 'NGO Digital Transformation',
      description: 'A comprehensive digital infrastructure project for non-governmental organizations. Built scalable backend systems with Python and FastAPI, serving 10k+ daily users.',
      techStack: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'CI/CD'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: true,
      metrics: { users: '10K+', uptime: '99.9%' },
      color: 'blue',
    },
    {
      id: 2,
      name: 'E-Learning Platform',
      description: 'A full-stack e-learning platform with video streaming, progress tracking, and certification system. Supporting 5000+ students.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'Docker', 'Redis'],
      status: 'In Progress',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: true,
      metrics: { students: '5K+', courses: '50+' },
      color: 'purple',
    },
    {
      id: 3,
      name: 'DevOps Dashboard',
      description: 'A monitoring dashboard for tracking server health, deployment status, and CI/CD pipelines with real-time alerts.',
      techStack: ['Python', 'FastAPI', 'Docker', 'Tailwind CSS'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: false,
      metrics: { servers: '20+', alerts: '24/7' },
      color: 'pink',
    },
    {
      id: 4,
      name: 'API Gateway Service',
      description: 'A centralized API gateway for microservices architecture with rate limiting, authentication, and request routing.',
      techStack: ['FastAPI', 'Docker', 'Redis', 'JWT'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: false,
      metrics: { requests: '1M+', latency: '<10ms' },
      color: 'blue',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 500);
  }, []);

  const statuses = ['all', ...new Set(projects.map(p => p.status.toLowerCase()))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || project.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const colorMap = {
    blue: { border: 'hover:border-blue-400/50', bg: 'group-hover:bg-blue-400/10', text: 'text-blue-400', glow: 'group-hover:shadow-blue-400/20' },
    purple: { border: 'hover:border-purple-400/50', bg: 'group-hover:bg-purple-400/10', text: 'text-purple-400', glow: 'group-hover:shadow-purple-400/20' },
    pink: { border: 'hover:border-pink-400/50', bg: 'group-hover:bg-pink-400/10', text: 'text-pink-400', glow: 'group-hover:shadow-pink-400/20' },
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">My Work</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Featured
              <span className="block gradient-text-accent">Projects</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
              A collection of my work showcasing expertise in backend development, 
              DevOps automation, and scalable system architecture.
            </p>

            {/* Quick stats */}
            <div className="flex gap-8 mt-10">
              <div>
                <p className="text-3xl font-bold text-white">{projects.length}</p>
                <p className="text-gray-500 text-sm">Projects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'Completed').length}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-gray-500 text-sm">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-black/80 backdrop-blur-md border-y border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-colors"
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

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2 text-sm font-medium tracking-wider rounded-full transition-all ${
                    filter === status
                      ? 'bg-white text-black'
                      : 'text-gray-500 hover:text-white border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              <p className="text-gray-500 mb-10 text-sm tracking-wider">
                SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((project, idx) => {
                  const colors = colorMap[project.color] || colorMap.blue;
                  return (
                    <div 
                      key={project.id} 
                      className={`group relative bg-gray-900/30 border border-gray-800 rounded-2xl p-8 ${colors.border} transition-all duration-300 hover:shadow-xl ${colors.glow}`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Background glow */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 ${colors.bg} transition-opacity duration-300`}></div>
                      
                      <div className="relative">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${project.status === 'Completed' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                            <span className={`text-xs font-medium tracking-wider ${project.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {project.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {project.githubLink && (
                              <a 
                                href={project.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                              </a>
                            )}
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:gradient-text-accent transition-all">
                          {project.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                          {project.description}
                        </p>

                        {/* Metrics */}
                        {project.metrics && (
                          <div className="flex gap-6 mb-6 p-4 bg-black/30 rounded-xl">
                            {Object.entries(project.metrics).map(([key, value]) => (
                              <div key={key}>
                                <p className={`text-lg font-bold ${colors.text}`}>{value}</p>
                                <p className="text-gray-500 text-xs capitalize">{key}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full border border-gray-700/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Let's Build
            <span className="gradient-text-accent"> Something Amazing</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Have a project in mind? I'm always excited to collaborate on innovative ideas 
            and bring them to life with clean, scalable code.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            Start a Conversation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
