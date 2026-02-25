import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { projectsApi } from '../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual API call when backend is ready
  const mockProjects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React, FastAPI, and PostgreSQL. Features include user authentication, product catalog, shopping cart, and payment integration with Stripe.',
      techStack: ['React', 'FastAPI', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Docker'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: true,
    },
    {
      id: 2,
      name: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redux'],
      status: 'In Progress',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: true,
    },
    {
      id: 3,
      name: 'Weather Dashboard',
      description: 'A responsive weather dashboard that displays current conditions and forecasts using data from multiple weather APIs.',
      techStack: ['React', 'OpenWeather API', 'Chart.js', 'Tailwind CSS'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: false,
    },
    {
      id: 4,
      name: 'Blog CMS',
      description: 'A content management system for blogs built with FastAPI and React. Features markdown support, image uploads, and SEO optimization.',
      techStack: ['FastAPI', 'React', 'PostgreSQL', 'AWS S3', 'Redis'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: false,
    },
    {
      id: 5,
      name: 'Social Media Analytics',
      description: 'A dashboard for tracking social media metrics and generating insights. Integrates with Twitter, Instagram, and LinkedIn APIs.',
      techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Plotly'],
      status: 'In Progress',
      link: null,
      githubLink: 'https://github.com',
      featured: false,
    },
    {
      id: 6,
      name: 'Portfolio Website',
      description: 'This very portfolio website! Built with React and Tailwind CSS, featuring a modern design and smooth animations.',
      techStack: ['React', 'Tailwind CSS', 'Vite', 'FastAPI'],
      status: 'Completed',
      link: 'https://example.com',
      githubLink: 'https://github.com',
      featured: true,
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch from API first
        // const data = await projectsApi.getAll();
        // setProjects(data);
        
        // Using mock data for now
        setTimeout(() => {
          setProjects(mockProjects);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data
        setProjects(mockProjects);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get unique statuses for filter
  const statuses = ['all', ...new Set(projects.map(p => p.status.toLowerCase()))];

  // Filter projects based on search and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || project.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Portfolio</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            A collection of my projects showcasing my skills in full-stack development, 
            from concept to deployment.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              {/* Results count */}
              <p className="text-gray-600 mb-8">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Interested in working together?
          </h2>
          <p className="text-indigo-100 mb-8">
            I'm always open to discussing new projects and opportunities.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
