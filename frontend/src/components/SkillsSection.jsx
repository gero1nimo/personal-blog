const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'USING NOW',
      description: 'Technologies I work with daily',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      skills: ['Python', 'FastAPI', 'Docker', 'Laravel', 'PHP', 'Git', 'Tailwind CSS'],
      color: 'blue',
    },
    {
      title: 'LEARNING',
      description: 'Currently expanding knowledge',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      skills: ['Reinforcement Learning', 'Kubernetes', 'AWS'],
      color: 'purple',
    },
    {
      title: 'OTHER SKILLS',
      description: 'Complementary expertise',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      skills: ['Project Management', 'Calculus', 'System Design'],
      color: 'pink',
    },
  ];

  const colorMap = {
    blue: { 
      bg: 'bg-blue-500/10', 
      iconBg: 'bg-blue-500/20',
      text: 'text-blue-400', 
      border: 'border-blue-500/20',
      bullet: 'bg-blue-400',
      hover: 'hover:bg-blue-500/15',
      glow: 'group-hover:shadow-blue-500/20'
    },
    purple: { 
      bg: 'bg-purple-500/10', 
      iconBg: 'bg-purple-500/20',
      text: 'text-purple-400', 
      border: 'border-purple-500/20',
      bullet: 'bg-purple-400',
      hover: 'hover:bg-purple-500/15',
      glow: 'group-hover:shadow-purple-500/20'
    },
    pink: { 
      bg: 'bg-pink-500/10', 
      iconBg: 'bg-pink-500/20',
      text: 'text-pink-400', 
      border: 'border-pink-500/20',
      bullet: 'bg-pink-400',
      hover: 'hover:bg-pink-500/15',
      glow: 'group-hover:shadow-pink-500/20'
    },
  };

  return (
    <section id="skills" className="relative py-24 md:py-32 bg-gradient-to-b from-gray-900 via-gray-900 to-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">What I Bring</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Skills & <span className="gradient-text-accent">Expertise</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit built over years of hands-on experience in backend development and DevOps
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const colors = colorMap[category.color];
            return (
              <div 
                key={index} 
                className={`group relative p-8 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colors.glow}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.text}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text} tracking-wider`}>
                      {category.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                  </div>
                </div>

                {/* Skills List */}
                <ul className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <li 
                      key={skillIndex} 
                      className={`flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] ${colors.hover} transition-all duration-200 cursor-default`}
                    >
                      <span className={`w-2 h-2 ${colors.bullet} rounded-full flex-shrink-0`}></span>
                      <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Decorative gradient line at top */}
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${colors.text.replace('text-', 'via-')} to-transparent opacity-50`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-6">Want to know more about my technical background?</p>
          <a 
            href="/about" 
            className="inline-flex items-center gap-3 text-white hover:text-blue-400 transition-colors group"
          >
            <span className="text-sm tracking-widest">VIEW FULL RESUME</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
