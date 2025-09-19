import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { contactService } from '../services/contactService';

function Landing() {
  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // Handle contact form input changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);

    try {
      await contactService.submitContactForm(contactForm);
      setContactSuccess(true);
      setContactForm({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setContactError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const features = [
    {
      icon: '💳',
      title: 'Multi-Wallet Management',
      description: 'Manage multiple wallets including cash, bank accounts, and credit cards all in one place.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Get detailed insights into your spending patterns with beautiful charts and reports.'
    },
    {
      icon: '🎯',
      title: 'Budget Planning',
      description: 'Set budgets, track expenses, and get alerts when you\'re approaching your limits.'
    },
    {
      icon: '🔄',
      title: 'Recurring Transactions',
      description: 'Automate your recurring income and expenses to save time and never miss a payment.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access your finances anywhere, anytime with our fully responsive design.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure with industry-standard security measures.'
    }
  ];

  const whyChooseUs = [
    {
      icon: '🚀',
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone, from beginners to finance experts.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Quick transactions, instant updates, and real-time synchronization.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, clean interface with dark mode support for comfortable usage.'
    },
    {
      icon: '📈',
      title: 'Smart Insights',
      description: 'AI-powered recommendations to help you make better financial decisions.'
    }
  ];

  const teamMembers = [
    {
      name: 'Team Member 1',
      role: 'Full Stack Developer & Project Lead',
      avatar: 'KS',
      // photo: '/path/to/member1.jpg', // Add photo path when available
      skills: ['React', 'Node.js', 'MongoDB', 'System Architecture'],
      description: 'Led the development of BachatBuddy with expertise in full-stack development and project management.',
      github: 'https://github.com/ksingla1885',
      linkedin: 'https://linkedin.com/in/kunal-singla'
    },
    {
      name: 'Team Member 2',
      role: 'Frontend Developer',
      avatar: 'MS',
      // photo: '/path/to/member2.jpg', // Add photo path when available
      skills: ['React', 'Tailwind CSS', 'UI/UX Design', 'Responsive Design'],
      description: 'Specialized in creating beautiful and intuitive user interfaces with modern design principles.',
      github: 'https://github.com/teammember2',
      linkedin: 'https://linkedin.com/in/teammember2'
    },
    {
      name: 'Team Member 3',
      role: 'Backend Developer',
      avatar: 'MY',
      // photo: '/path/to/member3.jpg', // Add photo path when available
      skills: ['Node.js', 'Express.js', 'Database Design', 'API Development'],
      description: 'Focused on building robust backend systems and secure API endpoints for the application.',
      github: 'https://github.com/teammember3',
      linkedin: 'https://linkedin.com/in/teammember3'
    },
    {
      name: 'Team Member 4',
      role: 'DevOps & Quality Assurance',
      avatar: 'PR',
      // photo: '/path/to/member4.jpg', // Add photo path when available
      skills: ['Testing', 'Deployment', 'Performance Optimization', 'Security'],
      description: 'Ensured application quality, performance optimization, and smooth deployment processes.',
      github: 'https://github.com/teammember4',
      linkedin: 'https://linkedin.com/in/teammember4'
    }
  ];

  const reviews = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      avatar: 'PS',
      rating: 5,
      comment: 'BachatBuddy has completely transformed how I manage my finances. The multi-wallet feature is a game-changer!'
    },
    {
      name: 'Rahul Kumar',
      role: 'Business Owner',
      avatar: 'RK',
      rating: 5,
      comment: 'The budget tracking and analytics features help me keep my business expenses in check. Highly recommended!'
    },
    {
      name: 'Anita Patel',
      role: 'Student',
      avatar: 'AP',
      rating: 5,
      comment: 'Perfect for students like me! The recurring transaction feature helps me track my monthly expenses effortlessly.'
    },
    {
      name: 'Vikram Singh',
      role: 'Freelancer',
      avatar: 'VS',
      rating: 5,
      comment: 'As a freelancer, managing multiple income sources was chaotic. BachatBuddy made it simple and organized.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8 animate-fadeInUp">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-large animate-float3D">
                <span className="text-white font-bold text-4xl">₹</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
                BachatBuddy
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Your Smart Financial Companion for Better Money Management
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                Take control of your finances with our comprehensive personal finance management platform. 
                Track expenses, manage budgets, and achieve your financial goals with ease.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideInRight">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 shadow-large hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">🚀</span>
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 shadow-medium hover:shadow-large transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">👋</span>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your finances effectively, all in one beautiful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-modern p-8 text-center card-hover group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-6xl mb-6 group-hover:animate-wiggle">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                About BachatBuddy
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                BachatBuddy was born from the vision of making personal finance management 
                accessible, intuitive, and powerful for everyone. We believe that financial 
                wellness should not be a luxury but a fundamental right.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our team of financial experts and technology enthusiasts have crafted a 
                platform that combines the best of both worlds - sophisticated financial 
                tools with an interface so simple that anyone can use it.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Founded in 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">10,000+ Happy Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">99.9% Uptime</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slideInRight">
              <div className="card-modern p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-6">🎯</div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    To empower individuals and families to take control of their financial 
                    future through innovative, user-friendly tools and personalized insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate developers behind BachatBuddy who made this vision a reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="card-modern p-6 text-center card-hover group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Profile Photo */}
                <div className="relative mb-6">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover shadow-large group-hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-large group-hover:scale-105 transition-transform duration-300">
                      {member.avatar}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>

                {/* Member Info */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
                    title="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Team Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">4</div>
              <p className="text-gray-600 dark:text-gray-300">Dedicated Developers</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">6+</div>
              <p className="text-gray-600 dark:text-gray-300">Months of Development</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">100%</div>
              <p className="text-gray-600 dark:text-gray-300">Passion & Dedication</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BachatBuddy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Why Choose BachatBuddy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not just another finance app. Here's what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 p-8 card-modern card-hover animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our amazing community has to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="card-modern p-6 card-hover animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-fadeInUp">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                    📧
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">support@bachatbuddy.com</p>
                    <p className="text-gray-600 dark:text-gray-300">hello@bachatbuddy.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl">
                    📱
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
                    <p className="text-gray-600 dark:text-gray-300">Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">123 Finance Street</p>
                    <p className="text-gray-600 dark:text-gray-300">Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slideInRight">
              <form className="card-modern p-8 space-y-6" onSubmit={handleContactSubmit}>
                {/* Success Message */}
                {contactSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 animate-fadeInUp">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Thank you for your message! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {contactError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-fadeInUp">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">{contactError}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={contactForm.fullName}
                    onChange={handleContactChange}
                    className="input-modern"
                    placeholder="Enter your full name"
                    required
                    disabled={contactLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="input-modern"
                    placeholder="Enter your email"
                    required
                    disabled={contactLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    className="input-modern"
                    placeholder="What's this about?"
                    required
                    disabled={contactLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="input-modern resize-none"
                    placeholder="Tell us more..."
                    required
                    disabled={contactLoading}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={contactLoading}
                >
                  {contactLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInUp">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-fadeInUp">
            Join thousands of users who have already transformed their financial lives with BachatBuddy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInRight">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-large"
            >
              <span className="mr-2">🚀</span>
              Start Your Journey
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">👋</span>
              Welcome Back
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
