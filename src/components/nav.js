import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import data from "../data/navbar.json"; // Assuming you have a navData.json file with the necessary data

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function goToWatsapp() {
    const watsappLink = data.watsappLink; // الحصول على الرابط من ملف JSON
    window.location.href = watsappLink;
  }


  return (
    <div className="nav">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-amber-700">
              <i className="fas fa-utensils mr-2"></i>{data.restaurantName}
            </h1>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <NavLink to="/">{data.home}</NavLink>
            <NavLink to="/menu">{data.menu}</NavLink>
            <NavLink to="/aboutus">{data.aboutUs}</NavLink>
            <NavLink to="/contact">{data.contact}</NavLink>
            <NavLink to="/location">{data.location}</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button onClick={ () => { goToWatsapp() }} className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base">
              <i className="fas fa-shopping-cart mr-2"></i>{data.orderOnline}
            </button>
            <button 
              className="md:hidden text-gray-700 text-xl focus:outline-none"
              onClick={toggleMenu}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Appears when hamburger is clicked */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-6 shadow-lg">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" onClick={toggleMenu}>{data.home}</MobileNavLink>
              <MobileNavLink to="/menu" onClick={toggleMenu}>{data.menu}</MobileNavLink>
              <MobileNavLink to="/about" onClick={toggleMenu}>{data.aboutUs}</MobileNavLink>
              <MobileNavLink to="/contact" onClick={toggleMenu}>{data.contact}</MobileNavLink>
              <MobileNavLink to="/location" onClick={toggleMenu}>{data.location}</MobileNavLink>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

// Component for desktop links
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-700 hover:text-amber-700 font-medium transition-colors duration-300"
  >
    {children}
  </Link>
);

// Component for mobile links
const MobileNavLink = ({ to, children, onClick }) => (
  <Link 
    to={to} 
    className="text-gray-700 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Nav;
