class Experience{
    constructor(role, company, period, description) {
        this.role = role;
        this.company = company;
        this.period = period;
        this.description = description;
    }
}

const About = () => {
  const education = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Istanbul Technical University',
      year: '2020 - 2022',
      description: 'Specialized in Software Engineering and Distributed Systems.',
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      school: 'Boğaziçi University',
      year: '2016 - 2020',
      description: 'Graduated with honors. Focus on algorithms and web development.',
    },
  ];

  const experience = [
    {
      role: 'Senior Full-Stack Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Leading development of enterprise web applications using React and FastAPI. Mentoring junior developers and implementing best practices.',
    },
    {
      role: 'Full-Stack Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Developed responsive web applications for various clients. Worked with diverse tech stacks including React, Node.js, and Django.',
    },
    {
      role: 'Frontend Developer Intern',
      company: 'Startup Hub',
      period: '2019 - 2020',
      description: 'Built user interfaces for mobile-first applications. Gained experience with React and modern CSS frameworks.',
    },
  ];

  const technologies = {
    'Languages': ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    'Frontend': ['React.js', 'Next.js', 'Tailwind CSS', 'Redux', 'Vite'],
    'Backend': ['FastAPI', 'Node.js', 'Express.js', 'Django', 'REST APIs'],
    'Database': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'SQLite'],
    'Cloud & DevOps': ['AWS', 'Docker', 'GitHub Actions', 'Vercel', 'Linux'],
    'Tools': ['Git', 'VS Code', 'Postman', 'Figma', 'Jest'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                  <svg className="w-32 h-32 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-50 blur-xl"></div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
              <p className="text-xl text-indigo-100 mb-6">
                Full-Stack Developer | Problem Solver | Tech Enthusiast
              </p>
              <p className="text-lg text-gray-200 leading-relaxed">
                I'm a passionate full-stack developer with over 3 years of experience 
                building modern web applications. I love turning complex problems into 
                simple, beautiful, and intuitive solutions. When I'm not coding, you'll 
                find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge through blog posts and mentorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-indigo-600 font-medium">{edu.year}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{edu.degree}</h3>
                    <p className="text-gray-600 font-medium">{edu.school}</p>
                    <p className="text-gray-500 mt-2">{edu.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Work Experience
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200 hidden md:block"></div>
            
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="relative flex gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-shrink-0 w-16 items-start justify-center">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full ring-4 ring-indigo-100"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <span className="text-sm text-indigo-600 font-medium">{exp.period}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{exp.role}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    <p className="text-gray-500 mt-2">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Technologies & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(technologies).map(([category, techs]) => (
              <div
                key={category}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Resume CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Want to know more?
          </h2>
          <p className="text-gray-400 mb-8">
            Download my resume for a detailed overview of my experience and skills.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
