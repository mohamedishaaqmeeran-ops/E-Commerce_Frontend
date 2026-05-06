import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 text-white mt-20">
    
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-cyan-400">ANC Shops</h2>
          <p className="mt-4 text-gray-300">
            ANC Shops offers a seamless online shopping experience with quality products from trusted vendors.
          </p>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-300">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-cyan-400">Home</a></li>
            <li><a href="/login" className="hover:text-cyan-400">Login</a></li>
            <li><a href="/register" className="hover:text-cyan-400">Register</a></li>
          </ul>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-300">Support</h3>
          <ul className="space-y-2 text-gray-300">
            <li>info@ancshops.com</li>
            <li>support@ancshops.com</li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-300">Follow Us</h3>
          <div className="flex space-x-6 text-2xl">

            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-pink-500 transition transform hover:scale-125 text-gray-400"
            >
              <FaInstagram />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-blue-400 transition transform hover:scale-125 text-gray-400"
            >
              <FaFacebook />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              className="hover:text-red-500 transition transform hover:scale-125 text-gray-400"
            >
              <FaYoutube />
            </a>

          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} ANC Shops. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;