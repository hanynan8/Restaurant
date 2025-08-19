import React, { useState, useEffect } from 'react';
import '../index.css';

function Footer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // لو عندك API_KEY حطه هنا (مش آمن للـ client العام، استخدم proxy لو خاص)
  const API_URL = 'https://restaurant-back-end-ehus.vercel.app/api/data?collection=footer';
  const API_KEY = ''; // مثال: 'your_key_here'

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = API_KEY ? { 'x-api-key': API_KEY } : {};
        const res = await fetch(API_URL, { headers, signal });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();

        // مرونة في التعامل مع أشكال الاستجابة:
        // 1) { footer: { ... } }
        // 2) { footer: [ {...} ] }
        // 3) { home: ..., footer: [...] , ... } (كل الـ collections)
        // 4) directly an array or object for footer
        let footer = null;

        if (json == null) {
          footer = null;
        } else if (json.footer) {
          // حالة وجود مفتاح footer
          footer = Array.isArray(json.footer) ? json.footer[0] || null : json.footer;
        } else if (json.data && json.data.footer) {
          // بعض APIs ترجع { data: { footer: ... } }
          footer = Array.isArray(json.data.footer) ? json.data.footer[0] || null : json.data.footer;
        } else if (Array.isArray(json) && json.length > 0) {
          // لو رجع مصفوفة، نحاول إيجاد كائن footer داخلها أو نأخذ العنصر الأول
          const found = json.find(item => item && item.footer);
          if (found && found.footer) footer = Array.isArray(found.footer) ? found.footer[0] : found.footer;
          else footer = json[0];
        } else if (typeof json === 'object') {
          // لو الـ API رجع object كبير (كل الـ collections)، نأخذ property footer لو موجود
          if (json.footer) footer = Array.isArray(json.footer) ? json.footer[0] : json.footer;
          else footer = json; // fallback: استخدم الكائن كما هو
        } else {
          footer = null;
        }

        setData(footer);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching footer:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [API_URL, API_KEY]);

  // fallbacks بسيطة للعرض لو بعض الحقول مش موجودة
  const footer = data || {};
  const restaurantName = footer.restaurantName || footer.name || 'مطعمنا';
  const description = footer.description || footer.desc || '';
  const socialLinks = Array.isArray(footer.socialLinks) ? footer.socialLinks : footer.social || [];
  const quickLinks = Array.isArray(footer.quickLinks) ? footer.quickLinks : footer.links || [];
  const workHours = Array.isArray(footer.workHours) ? footer.workHours : footer.hours || [];
  const address = footer.address || footer.location || '';
  const phone = footer.phone || footer.tel || '';
  const email = footer.email || footer.mail || '';
  const copyright = footer.copyright || '';

  if (loading) {
    return (
      <div className="nav">
        <footer className="footer py-12 bg-gray-900">
          <div className="container mx-auto px-4 text-center text-amber-500">
            جاري تحميل بيانات الفوتر...
          </div>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nav">
        <footer className="footer py-12 bg-gray-900">
          <div className="container mx-auto px-4 text-center text-red-500">
            حدث خطأ أثناء جلب بيانات الفوتر: {error}
          </div>
        </footer>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="nav">
        <footer className="footer py-12 bg-gray-900">
          <div className="container mx-auto px-4 text-center text-gray-300">
            لا توجد بيانات للفوتر حالياً
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="nav">
      <footer className="footer py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-amber-500">
                <i className="fas fa-utensils mr-2" /> {restaurantName}
              </h3>
              <p className="text-gray-300 mb-4">{description}</p>
              <div className="grid grid-cols-4 gap-x-4">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link, index) => (
                    <a key={index} href={link.url || '#'} className="text-gray-300 hover:text-amber-500">
                      {/* link.icon متوقع كلمة زي "facebook" أو "instagram" */}
                      {link.icon ? <i className={`fab fa-${link.icon}`}></i> : <i className="fas fa-share-alt"></i>}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="text-gray-300 hover:text-amber-500"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="text-gray-300 hover:text-amber-500"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="text-gray-300 hover:text-amber-500"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="text-gray-300 hover:text-amber-500"><i className="fab fa-youtube"></i></a>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">روابط سريعة</h4>
              <ul className="space-y-2">
                {quickLinks && quickLinks.length > 0 ? (
                  quickLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url || '#'} className="text-gray-300 hover:text-amber-500">
                        {link.name || link.title || 'رابط'}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href="#" className="text-gray-300 hover:text-amber-500">الرئيسية</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-amber-500">القائمة</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-amber-500">من نحن</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-amber-500">اتصل بنا</a></li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">ساعات العمل</h4>
              <ul className="space-y-2 text-gray-300">
                {workHours && workHours.length > 0 ? (
                  workHours.map((hour, index) => (
                    // hour ممكن يكون string أو object { day: '', time: '' }
                    <li key={index}>
                      {typeof hour === 'string' ? hour : `${hour.day || ''} ${hour.time || ''}`}
                    </li>
                  ))
                ) : (
                  <>
                    <li>الأحد - الخميس: 9 ص - 11 م</li>
                    <li>الجمعة - السبت: 1 م - 12 م</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {address || 'عنوان غير متوفر'}
                </li>
                <li>
                  <i className="fas fa-phone mr-2"></i>
                  {phone || 'هاتف غير متوفر'}
                </li>
                <li>
                  <i className="fas fa-envelope mr-2"></i>
                  {email || 'بريد إلكتروني غير متوفر'}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {restaurantName}. {copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
