import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

/**
 * Nav component
 * - يحسّن استدعاء البيانات للـ navbar
 * - يضع زر "اطلب الآن" في القائمة المنسدلة على الموبايل
 * - يحتفظ بالزر ظاهرًا على الديسكتوب
 * - إغلاق الموبايل مِنو عند الضغط على أي رابط
 * - تعامل مرن مع أشكال استجابة الـ API
 */

// ثابتات الـ API (لو عايز تغيرها)
const API_URL = "https://restaurant-back-end-ehus.vercel.app/api/data?collection=navbar";
const API_KEY = ""; // إن وُجد (مش آمن للـ client العام)

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = API_KEY ? { "x-api-key": API_KEY } : {};
        const response = await fetch(API_URL, { headers, signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        // مرونة في التعامل مع أشكال الاستجابة
        let navbar = null;

        if (!json) {
          navbar = null;
        } else if (json.navbar) {
          navbar = Array.isArray(json.navbar) ? json.navbar[0] || null : json.navbar;
        } else if (json.data && json.data.navbar) {
          navbar = Array.isArray(json.data.navbar) ? json.data.navbar[0] || null : json.data.navbar;
        } else if (Array.isArray(json) && json.length > 0) {
          const found = json.find((item) => item && item.navbar);
          if (found && found.navbar) navbar = Array.isArray(found.navbar) ? found.navbar[0] : found.navbar;
          else navbar = json[0];
        } else if (typeof json === "object") {
          if (json.navbar) navbar = Array.isArray(json.navbar) ? json.navbar[0] : json.navbar;
          else navbar = json;
        } else {
          navbar = null;
        }

        setData(navbar);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching navbar:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []); // لا تعتمد على متغيرات قابلة للتغيير هنا

  // فتح رابط واتساب/رقم تِلفون بشكل مرن
  function goToWhatsAppLink(raw) {
    if (!raw) return;
    let link = String(raw).trim();

    // لو الرقم فقط (أرقام فقط) نركّب رابط واتساب
    const digitsOnly = link.replace(/[^\d+]/g, "");
    if (!/^https?:\/\//i.test(link) && (digitsOnly.length >= 6 && digitsOnly.length <= 15)) {
      // نستخدم رابط wa.me (أفضل للروابط القصيرة) أو api.whatsapp
      link = `https://wa.me/${digitsOnly.replace(/^\+/, "")}`;
    } else if (!/^https?:\/\//i.test(link)) {
      // لو موجود مسار مثل wa.me/..
      if (link.startsWith("wa.me") || link.startsWith("api.whatsapp.com")) {
        link = `https://${link}`;
      } else {
        // كنهاية: أضف https://
        link = `https://${link}`;
      }
    }

    // افتح في تاب جديد
    window.open(link, "_blank", "noopener,noreferrer");
  }

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const closeMenu = () => setIsMenuOpen(false);

  // استخراج القيم مع fallbacks
  const name = data?.restaurantName || data?.name;
  const txtHome = data?.home;
  const txtMenu = data?.menu;
  const txtAbout = data?.aboutUs || data?.about;
  const txtContact = data?.contactText || data?.contact;
  const txtLocation = data?.location;
  const txtOrder = data?.orderOnline;

  // مرشحات لرابط واتساب/الهاتف
  const whatsappCandidates = [
    data?.watsappLink,
    data?.whatsapp,
    data?.contact?.watsapp,
    data?.contact?.whatsapp,
    data?.contact?.phone,
    data?.phone,
  ];
  const whatsappLink = whatsappCandidates.find(Boolean);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-amber-700">
              <i className="fas fa-utensils mr-2"></i>{name}
            </h1>
          </div>
          <div className="flex items-center">
            {/* مؤشر تحميل بسيط */}
            <div className="text-sm text-gray-500">جاري التحميل...</div>
            <button className="ml-4 md:hidden text-gray-700 text-xl focus:outline-none" aria-hidden>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-red-600">
              <i className="fas fa-exclamation-triangle mr-2"></i>خطأ في التحميل
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-amber-700">
            <i className="fas fa-utensils mr-2"></i>
            {name}
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/">{txtHome}</NavLink>
          <NavLink to="/menu">{txtMenu}</NavLink>
          <NavLink to="/aboutus">{txtAbout}</NavLink>
          <NavLink to="/contact">{txtContact}</NavLink>
          <NavLink to="/location">{txtLocation}</NavLink>

          {/* زر اطلب الآن يظهر على الديسكتوب فقط */}
          <button
            onClick={() => goToWhatsAppLink(whatsappLink)}
            className="ml-4 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition text-sm md:text-base"
            aria-label="اطلب الآن"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            {txtOrder}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          {/* على الموبايل نخفي زر الطلب من الشريط ونضعه في المينيو */}
          <button
            className="text-gray-700 text-2xl focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden bg-white shadow-lg transform transition-transform duration-200 ease-out ${
          isMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
        role="menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="px-6 py-4 flex flex-col space-y-3">
          <MobileNavLink to="/" onClick={closeMenu}>
            {txtHome}
          </MobileNavLink>
          <MobileNavLink to="/menu" onClick={closeMenu}>
            {txtMenu}
          </MobileNavLink>
          <MobileNavLink to="/aboutus" onClick={closeMenu}>
            {txtAbout}
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={closeMenu}>
            {txtContact}
          </MobileNavLink>
          <MobileNavLink to="/location" onClick={closeMenu}>
            {txtLocation}
          </MobileNavLink>

          {/* زر اطلب الآن داخل الموبايل */}
          <button
            onClick={() => {
              closeMenu();
              goToWhatsAppLink(whatsappLink);
            }}
            className="w-full text-right bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition text-base mt-2"
            aria-label="اطلب الآن"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            {txtOrder}
          </button>

          {/* خيار عرض رقم الهاتف (لو موجود) */}
          {data?.contact?.phone || data?.phone ? (
            <div className="text-sm text-gray-600 pt-2">
              <div className="font-medium">هاتف:</div>
              <div>
                <a
                  href={`tel:${(data?.contact?.phone || data?.phone).replace(/\s+/g, "")}`}
                  onClick={closeMenu}
                  className="text-amber-700 hover:underline"
                >
                  {(data?.contact?.phone || data?.phone)}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/* Desktop NavLink */
const NavLink = ({ to, children }) => (
  <Link to={to} className="text-gray-700 hover:text-amber-700 font-medium transition-colors duration-300">
    {children}
  </Link>
);

/* Mobile NavLink */
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="text-gray-700 hover:text-amber-700 font-medium py-2 border-b border-gray-100 block"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Nav;
