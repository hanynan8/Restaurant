import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // استخدم endpoint مخصص للـ navbar عشان يكون أخف
  const API_URL = 'https://restaurant-back-end-ehus.vercel.app/api/data?collection=navbar';
  const API_KEY = ''; // لو عندك مفتاح اكتبُه هنا (مش آمن للـ client العام)

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = API_KEY ? { 'x-api-key': API_KEY } : {};
        const response = await fetch(API_URL, { headers, signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        // مرونة في التعامل مع أشكال الاستجابة:
        // 1) { navbar: { ... } }
        // 2) directly an object for navbar
        // 3) whole collections object { home:..., navbar: [...] }
        let navbar = null;

        if (!json) {
          navbar = null;
        } else if (json.navbar) {
          navbar = Array.isArray(json.navbar) ? json.navbar[0] || null : json.navbar;
        } else if (json.data && json.data.navbar) {
          navbar = Array.isArray(json.data.navbar) ? json.data.navbar[0] || null : json.data.navbar;
        } else if (Array.isArray(json) && json.length > 0) {
          // إذا رجع مصفوفة، خذ العنصر الأول أو ابحث عن navbar داخلها
          const found = json.find(item => item && item.navbar);
          if (found && found.navbar) navbar = Array.isArray(found.navbar) ? found.navbar[0] : found.navbar;
          else navbar = json[0];
        } else if (typeof json === 'object') {
          // لو رجع كائن كبير (كل الـ collections)
          if (json.navbar) navbar = Array.isArray(json.navbar) ? json.navbar[0] : json.navbar;
          else navbar = json; // fallback: استخدم الكائن كما هو
        } else {
          navbar = null;
        }

        setData(navbar);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching navbar:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [API_URL, API_KEY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  function goToWatsapp() {
    if (!data) return;
    // محاولات متعددة لاستخراج رابط الواتساب بناءً على أشكال البيانات المختلفة
    const candidates = [
      data.watsappLink,
      data.whatsapp,
      data.contact?.watsapp,
      data.contact?.whatsapp,
      data.contact?.phone // كخيار بديل
    ];
    const link = candidates.find(Boolean);
    if (link) window.location.href = link;
  }

  // fallbacks بسيطة عند العرض
  const name = data?.restaurantName || data?.name || 'مطعمنا';
  const txtHome = data?.home || 'الرئيسية';
  const txtMenu = data?.menu || 'القائمة';
  const txtAbout = data?.aboutUs || data?.about || 'من نحن';
  const txtContact = data?.contactText || data?.contact || 'اتصل بنا';
  const txtLocation = data?.location || 'الموقع';
  const txtOrder = data?.orderOnline || data?.order || 'اطلب الآن';

  if (loading) {
    return (
      <div className="nav">
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-amber-700">
                <i className="fas fa-utensils mr-2"></i>جاري التحميل...
              </h1>
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nav">
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-amber-700">
                <i className="fas fa-utensils mr-2"></i>خطأ في التحميل
              </h1>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="nav">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-amber-700">
              <i className="fas fa-utensils mr-2"></i>{name}
            </h1>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <NavLink to="/">{txtHome}</NavLink>
            <NavLink to="/menu">{txtMenu}</NavLink>
            <NavLink to="/aboutus">{txtAbout}</NavLink>
            <NavLink to="/contact">{txtContact}</NavLink>
            <NavLink to="/location">{txtLocation}</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button onClick={goToWatsapp} className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base">
              <i className="fas fa-shopping-cart mr-2"></i>{txtOrder}
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
              <MobileNavLink to="/" onClick={toggleMenu}>{txtHome}</MobileNavLink>
              <MobileNavLink to="/menu" onClick={toggleMenu}>{txtMenu}</MobileNavLink>
              <MobileNavLink to="/aboutus" onClick={toggleMenu}>{txtAbout}</MobileNavLink>
              <MobileNavLink to="/contact" onClick={toggleMenu}>{txtContact}</MobileNavLink>
              <MobileNavLink to="/location" onClick={toggleMenu}>{txtLocation}</MobileNavLink>
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
