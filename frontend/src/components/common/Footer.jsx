import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiGithub
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ]

  const socialLinks = [
    { icon: <FiFacebook />, name: 'Facebook', url: '#' },
    { icon: <FiTwitter />, name: 'Twitter', url: '#' },
    { icon: <FiInstagram />, name: 'Instagram', url: '#' },
    { icon: <FiLinkedin />, name: 'LinkedIn', url: '#' },
    { icon: <FiGithub />, name: 'GitHub', url: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                College<span className="text-blue-400">Admit</span>
              </span>
            </div>
            <p className="text-gray-400">
              Streamlining college admissions with modern technology and exceptional user experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Student Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/apply" className="text-gray-400 hover:text-white transition duration-200">Apply for Admission</Link></li>
              <li><Link to="/status" className="text-gray-400 hover:text-white transition duration-200">Check Application Status</Link></li>
              <li><Link to="/documents" className="text-gray-400 hover:text-white transition duration-200">Upload Documents</Link></li>
              <li><Link className="text-gray-400 hover:text-white transition duration-200">FAQ</Link></li>
              <li><Link className="text-gray-400 hover:text-white transition duration-200">Student Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span className="text-gray-400">
                  University Campus,<br />
                  Academic Street,<br />
                  Education City 123456
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">admissions@college.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} College Admission Portal. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Designed and developed with for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer