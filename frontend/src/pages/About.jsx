import { useState, useEffect } from 'react';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const education = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Istanbul Technical University',
      year: '2020 - 2022',
      description: 'Specialized in Software Engineering and Distributed Systems.',
      icon: '🎓',
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      school: 'Boğaziçi University',
      year: '2016 - 2020',
      description: 'Graduated with honors. Focus on algorithms and web development.',
      icon: '📚',
    },
  ];

  const experience = [
    {
      role: 'Senior Backend Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Leading development of enterprise backend systems using Python and FastAPI. Implementing DevOps practices and mentoring junior developers.',
      current: true,
    },
    {
      role: 'Backend Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Developed scalable backend services for various clients. Worked with Python, Docker, and cloud technologies.',
      current: false,
    },
    {
      role: 'Junior Developer',
      company: 'Startup Hub',
      period: '2019 - 2020',
      description: 'Built APIs and backend services. Gained experience with Laravel and PHP.',
      current: false,
    },
  ];

  const values = [
    { title: 'Clean Code', description: 'Writing maintainable, readable code that teams can work with', icon: '✨' },
    { title: 'Continuous Learning', description: 'Always exploring new technologies and best practices', icon: '📖' },
    { title: 'Problem Solving', description: 'Finding elegant solutions to complex technical challenges', icon: '🧩' },
    { title: 'Collaboration', description: 'Building great products through effective teamwork', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Profile Image */}
            <div className={`flex justify-center lg:justify-start order-2 lg:order-1 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative group">
                {/* Animated border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl border border-gray-800 bg-gray-900/50 flex items-center justify-center overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-blue-400/50"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-purple-400/50"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-pink-400/50"></div>
                  
                  <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center border border-gray-700">
                    <span className="text-5xl md:text-6xl font-bold gradient-text-accent">MA</span>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-green-400/20 border border-green-400/30 rounded-full text-green-400 text-xs font-medium">
                  Available
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className={`text-center lg:text-left order-1 lg:order-2 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">About Me</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Hi, I'm
                <span className="block gradient-text-accent">Mehmet Akif</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-6">
                Backend Developer & DevOps Enthusiast
              </p>
              
              <p className="text-gray-500 leading-relaxed mb-8 max-w-lg">
                I'm a passionate developer with 3+ years of experience building scalable 
                systems and implementing DevOps practices. I love turning complex 
                infrastructure challenges into elegant, maintainable solutions.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">3+</p>
                  <p className="text-gray-500 text-sm">Years Experience</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">15+</p>
                  <p className="text-gray-500 text-sm">Projects Completed</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-gray-500 text-sm">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-xs tracking-[0.3em] uppercase font-medium">What Drives Me</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Core <span className="gradient-text-accent">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-400/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">Career</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Work <span className="gradient-text-accent">Experience</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 via-purple-400 to-transparent"></div>

            <div className="space-y-12">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-8 md:pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 md:left-8 top-2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${exp.current ? 'border-green-400 bg-green-400/20' : 'border-gray-600 bg-gray-900'}`}>
                    {exp.current && <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25"></div>}
                  </div>

                  <div className="group p-6 bg-gray-900/30 border border-gray-800 rounded-2xl hover:border-blue-400/30 transition-all">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-sm text-gray-500">{exp.period}</span>
                      {exp.current && (
                        <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                    <p className="text-blue-400 font-medium mb-3">{exp.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-pink-400 text-xs tracking-[0.3em] uppercase font-medium">Background</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              <span className="gradient-text-accent">Education</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="group p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-pink-400/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-pink-400/10 flex items-center justify-center text-2xl shrink-0">
                    {edu.icon}
                  </div>
                  <div>
                    <span className="text-sm text-pink-400 font-medium">{edu.year}</span>
                    <h3 className="text-lg font-semibold text-white mt-1">{edu.degree}</h3>
                    <p className="text-gray-400">{edu.school}</p>
                    <p className="text-gray-500 mt-3 text-sm">{edu.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Resume CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-black to-black"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Want to Know <span className="gradient-text-accent">More?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Download my resume for a detailed overview of my experience, skills, and achievements.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
