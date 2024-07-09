import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-5 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">Contact Information</h3>
          <p className="text-gray-400">123 Street Name, City, State, 12345</p>
          <p className="text-gray-400">Phone: (123) 456-7890</p>
          <p className="text-gray-400">Email: info@example.com</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2" style={{textDecoration:"none",listStyle:"none"}}>
            <li style={{textDecoration:"none"}}><a href="#admissions" className="text-gray-400 hover:text-white transition">Admissions</a></li>
            <li style={{textDecoration:"none"}}><a href="#careers" className="text-gray-400 hover:text-white transition">Careers</a></li>
            <li style={{textDecoration:"none"}}><a href="#privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Newsletter Signup</h3>
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded w-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2"
          />
         
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Accreditations and Partnerships</h3>
          <p className="text-gray-400">We are accredited by XYZ organization and partnered with ABC company.</p>
        
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};


