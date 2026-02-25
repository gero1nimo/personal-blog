import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SkillsSection from '../components/SkillsSection';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated featured projects - replace with actual API call
    const mockProjects = [
      {
        id: 1,
        name: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with React, FastAPI, and PostgreSQL. Features include user authentication, product catalog, shopping cart, and payment integration.',
        techStack: ['React', 'FastAPI', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        status: 'Completed',
        link: 'https://example.com',
        githubLink: 'https://github.com',
        featured: true,
      },
      {
        id: 2,
        name: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
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
        featured: true,
      },
    ];

    setTimeout(() => {
      setFeaturedProjects(mockProjects);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A selection of my recent work showcasing various technologies and problem-solving approaches
            </p>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              View All Projects
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Have a project in mind? I'd love to help you bring it to life. 
            Let's connect and discuss how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get in Touch
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
