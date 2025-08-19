import React, { useState, useEffect } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import '../index.css'; // ستايلات إضافية (لو محتاج)
import RestaurantLoading from '../components/loading.js'; // تأكد من المسار الصحيح

// API
const API_URL =
  'https://restaurant-back-end-ehus.vercel.app/api/data?collection=contact';
const API_KEY = ''; // لو عندك مفتاح حطه هنا (⚠️ مش آمن في الكود العام)

const ContactPage = () => {
  const [data, setData] = useState(null); // normalized payload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  // Fetch Data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    const headers = API_KEY ? { 'x-api-key': API_KEY } : {};

    fetch(API_URL, { headers, signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        let payload = null;
        if (!json) payload = null;
        else if (Array.isArray(json)) payload = json[0] || null;
        else if (json.contact)
          payload = Array.isArray(json.contact) ? json.contact[0] : json.contact;
        else if (json.contactInfo) payload = json;
        else payload = json;

        if (!payload) throw new Error('Unexpected API response shape for contact');

        // Normalize
        const normalized = {
          hero: payload.hero || { title: '', subtitle: '', backgroundImage: '' },
          contactInfo:
            payload.contactInfo ||
            payload.contactInfoItems ||
            payload.contact ||
            { title: '', items: [] },
          faq: payload.faq || { title: '', items: [] },
          contact: payload.contact || payload.contactInfo || payload,
        };

        // Ensure arrays
        normalized.contactInfo.items = Array.isArray(
          normalized.contactInfo.items,
        )
          ? normalized.contactInfo.items
          : normalized.contactInfo.items
          ? [normalized.contactInfo.items]
          : [];

        normalized.faq.items = Array.isArray(normalized.faq.items)
          ? normalized.faq.items
          : normalized.faq.items
          ? [normalized.faq.items]
          : [];

        setData(normalized);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Fetch contact error:', err);
          setError(err.message || 'خطأ في جلب البيانات');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Helpers
  const toggleFaq = (index) =>
    setActiveFaq(activeFaq === index ? null : index);

  const goToWhatsapp = () => {
    if (!data) return;
    const candidates = [
      data.contact?.watsapp,
      data.contact?.whatsapp,
      data.contact?.phone,
      data.contactInfo?.watsapp,
      data.contactInfo?.whatsapp,
    ];
    const link = candidates.find(Boolean);
    if (link && link !== '#') window.location.href = link;
    else console.warn('WhatsApp link not available');
  };

  // States
  if (loading) return <RestaurantLoading />;

  if (error) {
    return (
      <div className="font-sans bg-amber-50 min-h-screen">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg inline-block">
            حدث خطأ أثناء جلب بيانات الصفحة: {error}
          </div>
        </div>
      </div>
    );
  }

  // Fallback data
  const c = data || {
    hero: { title: '', subtitle: '', backgroundImage: '' },
    contactInfo: { title: '', items: [] },
    faq: { title: '', items: [] },
    contact: { watsapp: '#' },
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative py-28 md:py-40 text-center"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${c.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
            {c.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            {c.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-amber-700">
              {c.contactInfo.title || 'تواصل معنا'}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {(c.contactInfo.items || []).map((item, index) => (
              <div
                key={index}
                className="bg-amber-50 p-8 rounded-xl text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4">
                  {item.icon || <FaMapMarkerAlt />}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-amber-700">
              {c.faq.title || 'الأسئلة الشائعة'}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {(c.faq.items || []).map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.question}
                  </h3>
                  {activeFaq === index ? (
                    <FaChevronUp className="text-amber-600" />
                  ) : (
                    <FaChevronDown className="text-amber-600" />
                  )}
                </button>

                {activeFaq === index && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            احجز طاولتك الآن واطلب اونلاين
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            استمتع بتجربة فريدة من أشهى الأطباق في أجواء مميزة
          </p>
          <button
            onClick={goToWhatsapp}
            className="bg-white text-amber-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-100 transition-colors"
          >
            احجز الآن أو اطلب اونلاين
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
