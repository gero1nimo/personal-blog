const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'USING NOW',
      description: 'Technologies I work with daily',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'FastAPI', level: 90 },
        { name: 'Docker', level: 88 },
        { name: 'Laravel', level: 85 },
        { name: 'PHP', level: 82 },
        { name: 'Git', level: 90 },
        { name: 'Tailwind CSS', level: 80 },
      ],
      color: 'blue',
    },
    {
      title: 'LEARNING',
      description: 'Currently expanding knowledge',
      skills: [
        { name: 'Reinforcement Learning', level: 45 },
        { name: 'Kubernetes', level: 40 },
        { name: 'AWS', level: 50 },
      ],
      color: 'purple',
    },
    {
      title: 'OTHER SKILLS',
      description: 'Complementary expertise',
      skills: [
        { name: 'Project Management', level: 85 },
        { name: 'Calculus', level: 75 },
        { name: 'System Design', level: 80 },
      ],
      color: 'pink',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-400/20', fill: 'bg-blue-400', text: 'text-blue-400', border: 'border-blue-400/30' },
    purple: { bg: 'bg-purple-400/20', fill: 'bg-purple-400', text: 'text-purple-400', border: 'border-purple-400/30' },
    pink: { bg: 'bg-pink-400/20', fill: 'bg-pink-400', text: 'text-pink-400', border: 'border-pink-400/30' },
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
                className={`relative p-8 rounded-2xl border ${colors.border} bg-white/[0.02] backdrop-blur-sm card-hover`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-3 h-3 ${colors.fill} rounded-full`}></div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text} tracking-wider`}>
                      {category.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{category.description}</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-5">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className={`text-xs ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`h-1.5 ${colors.bg} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${colors.fill} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} rounded-bl-3xl -z-10 opacity-50`}></div>
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
