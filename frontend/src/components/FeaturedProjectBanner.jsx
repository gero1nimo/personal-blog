const FeaturedProjectBanner = () => {
  return (
    <section className="relative bg-black py-20 md:py-28 border-t border-gray-800 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-8 md:px-16 relative">
        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">Featured Project</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              NGO Digital
              <span className="block gradient-text-accent">Transformation</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              A comprehensive digital infrastructure project for non-governmental organizations. 
              Built scalable backend systems with Python and FastAPI, implemented containerized 
              deployments using Docker, and established CI/CD pipelines for seamless delivery.
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-3 mb-10">
              {['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'CI/CD'].map((tech, index) => (
                <span 
                  key={tech} 
                  className="px-4 py-2 bg-white/5 border border-gray-800 text-gray-300 text-sm rounded-full hover:bg-white/10 hover:border-gray-700 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Read More Link */}
            <a 
              href="/portfolio" 
              className="inline-flex items-center group"
            >
              <span className="w-12 h-px bg-white mr-4 transition-all duration-300 group-hover:w-20 group-hover:bg-blue-400"></span>
              <span className="text-white text-sm font-medium tracking-widest group-hover:text-blue-400 transition-colors">
                VIEW PROJECT
              </span>
              <svg className="w-4 h-4 ml-2 text-white group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right Side - Project Preview */}
          <div className="hidden lg:flex justify-end">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              
              {/* Project card */}
              <div className="relative w-80 h-80 border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-black backdrop-blur-sm card-hover">
                {/* Terminal-style header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-gray-500 text-xs ml-2">main.py</span>
                </div>
                
                {/* Code preview */}
                <div className="font-mono text-sm space-y-2">
                  <div><span className="text-purple-400">from</span> <span className="text-blue-400">fastapi</span> <span className="text-purple-400">import</span> FastAPI</div>
                  <div><span className="text-purple-400">from</span> <span className="text-blue-400">app</span> <span className="text-purple-400">import</span> router</div>
                  <div className="text-gray-600"># Initialize application</div>
                  <div><span className="text-gray-300">app</span> = <span className="text-yellow-400">FastAPI</span>()</div>
                  <div className="text-gray-600"># Include routes</div>
                  <div><span className="text-gray-300">app</span>.<span className="text-yellow-400">include_router</span>(router)</div>
                </div>

                {/* Status indicator */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">Deployed</span>
                  </div>
                  <span className="text-gray-500 text-xs">v2.1.0</span>
                </div>
              </div>

              {/* Floating decorations */}
              <div className="absolute -top-4 -right-4 w-8 h-8 border border-blue-400/30 rounded-lg rotate-12"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '99.9%', label: 'Uptime' },
            { value: '< 50ms', label: 'Response Time' },
            { value: '10k+', label: 'API Requests/day' },
            { value: '15+', label: 'Microservices' },
          ].map((stat, index) => (
            <div key={index} className="text-center md:text-left group">
              <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stat.value}</div>
              <div className="text-gray-500 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectBanner;
