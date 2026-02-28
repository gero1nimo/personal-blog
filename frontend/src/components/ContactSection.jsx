import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-8 md:px-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-medium">Get in Touch</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Let's Build
              <span className="block gradient-text-accent">Something Great</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Have a project in mind or just want to chat about opportunities? 
              I'm always excited to discuss new ideas and collaborations.
            </p>

            {/* Contact info */}
            <div className="space-y-6">
              <a href="mailto:mehmetakif@example.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 border border-gray-800 rounded-xl flex items-center justify-center group-hover:border-blue-400/50 group-hover:bg-blue-400/10 transition-all">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-xs tracking-wider uppercase">Email</p>
                  <p className="text-white group-hover:text-blue-400 transition-colors">mehmetakif@example.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gray-800 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-xs tracking-wider uppercase">Location</p>
                  <p className="text-white">Istanbul, Turkey</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gray-800 rounded-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs tracking-wider uppercase">Availability</p>
                  <p className="text-green-400">Open to opportunities</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-10 pt-10 border-t border-gray-800">
              <p className="text-gray-500 text-xs tracking-wider uppercase mb-4">Find me on</p>
              <div className="flex gap-4">
                {[
                  { name: 'GitHub', href: 'https://github.com', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-gray-800 rounded-xl flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="relative">
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-400/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Thank you for reaching out. I'll get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-blue-400 text-sm tracking-wider hover:text-white transition-colors"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-transparent border-0 border-b border-gray-800 text-white placeholder-gray-600 py-4 px-0 focus:outline-none focus:border-blue-400 transition-colors text-base peer"
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 peer-focus:w-full"></div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full bg-transparent border-0 border-b border-gray-800 text-white placeholder-gray-600 py-4 px-0 focus:outline-none focus:border-blue-400 transition-colors text-base peer"
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 peer-focus:w-full"></div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="w-full bg-transparent border-0 border-b border-gray-800 text-white placeholder-gray-600 py-4 px-0 focus:outline-none focus:border-blue-400 transition-colors text-base peer"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 peer-focus:w-full"></div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="w-full bg-transparent border-0 border-b border-gray-800 text-white placeholder-gray-600 py-4 px-0 focus:outline-none focus:border-blue-400 transition-colors text-base resize-none peer"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 peer-focus:w-full"></div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
