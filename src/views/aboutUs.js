// AboutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendar, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import RestaurantLoading from '../components/loading.js' // تأكد أن المسار صحيح

/**
 * AboutPage — يجلب البيانات من API (collection=aboutus)
 * يركز على التعامل السليم مع كل الحقول والصور (lazy, fallback, skeleton).
 */

const API_URL = 'https://restaurant-back-end-ehus.vercel.app/api/data?collection=aboutus';
const API_KEY = ''; // لو عندك مفتاح حطه هنا (مش آمن للعموم - استخدم proxy لو خاص)

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    // placeholder بسيط متناسق مع التصميم
    return (
      <div className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500 ${className || ''}`}>
        <span>صورة غير متوفرة</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'image'}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history');

  // fetch function قابلة لإعادة الاستخدام (retry)
  const fetchData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    const headers = API_KEY ? { 'x-api-key': API_KEY } : {};

    try {
      const res = await fetch(API_URL, { headers, signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // مرونة في قراءة شكل الاستجابة
      let payload = null;
      if (!json) payload = null;
      else if (Array.isArray(json)) payload = json[0] || null;
      else if (json.aboutus) payload = Array.isArray(json.aboutus) ? json.aboutus[0] : json.aboutus;
      else if (json.data && json.data.aboutus) payload = Array.isArray(json.data.aboutus) ? json.data.aboutus[0] : json.data.aboutus;
      else payload = json; // fallback: استخدم الكائن كما هو

      if (!payload) throw new Error('Unexpected API response shape for aboutus');

      // Normalize fields to avoid runtime errors
      const normalized = {
        hero: payload.hero || { title: '', subtitle: '', backgroundImage: '' },
        history: payload.history || { title: '', content: '', image: '', milestones: [] },
        achievements: payload.achievements || { title: '', items: [] },
        mission: payload.mission || { title: '', content: '', image: '', values: [] },
        team: payload.team || { title: '', members: [] },
        contact: payload.contact || { watsapp: '#' }
      };

      setAbout(normalized);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Fetch aboutus error:', err);
      setError(err.message || 'خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }

    // clean-up: لو أردنا إلغاء لاحقًا
    return () => controller.abort();
  };

  useEffect(() => {
    // نستخدم fetchData داخل useEffect
    const maybeCleanup = fetchData();
    // إذا fetchData أعادت دالة تنظيف، تعالجها
    return () => {
      if (typeof maybeCleanup === 'function') maybeCleanup();
    };
  }, []); // تشغيل لمرة واحدة عند المونت

  function goToWatsapp() {
    const w = about?.contact?.watsapp || '#';
    if (w && w !== '#') window.location.href = w;
    else console.warn('WhatsApp link not available');
  }

  // skeleton loader component بسيط (يبقى احتياطي لو حبيت استخدام محلي)
  const Skeleton = ({ height = 24, className = '' }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} style={{ height }} />
  );

  // — هنا استخدمنا الـ RestaurantLoading بدل الـ skeleton المحلي —
  // if (loading) {
  //   return <RestaurantLoading />;
  // }

  // شاشة الخطأ مع زر إعادة المحاولة
  if (error) {
    return (
      <div className="font-sans bg-amber-50 min-h-screen">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg inline-block mb-6">
            حدث خطأ أثناء جلب بيانات الصفحة: {error}
          </div>
          <div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchData();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = about || {
    hero: { title: '', subtitle: '', backgroundImage: '' },
    history: { title: '', content: '', image: '', milestones: [] },
    achievements: { title: '', items: [] },
    mission: { title: '', content: '', image: '', values: [] },
    team: { title: '', members: [] },
    contact: { watsapp: '#' }
  };

  return (
    <div className="font-sans text-gray-800 bg-amber-50">
      {/* Hero */}
      <section
        className="relative py-28 md:py-40 text-center"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${data.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">{data.hero.title}</h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">{data.hero.subtitle}</p>
          <div className="mt-12 flex justify-center">
            <Link to="/menu">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold flex items-center transition-colors">
                تصفح القائمة <FaArrowLeft className="mr-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveTab('history')} className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${activeTab === 'history' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}>تاريخنا</button>
            <button onClick={() => setActiveTab('achievements')} className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${activeTab === 'achievements' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}>إنجازاتنا</button>
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${activeTab === 'mission' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}>رسالتنا</button>
            <button onClick={() => setActiveTab('team')} className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${activeTab === 'team' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}>فريقنا</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-amber-700">
              {activeTab === 'history' && data.history.title}
              {activeTab === 'achievements' && data.achievements.title}
              {activeTab === 'mission' && data.mission.title}
              {activeTab === 'team' && data.team.title}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full" />
          </div>

          {/* Sections */}
          {activeTab === 'history' && (
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <ImageWithFallback src={data.history.image} alt={data.history.title} className="w-full h-auto rounded-xl shadow-lg" />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold text-amber-700 mb-6">{data.history.title}</h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{data.history.content}</p>
                <div className="grid grid-cols-2 gap-4">
                  {(data.history.milestones || []).map((m, i) => (
                    <div key={i} className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                      <div className="text-amber-700 font-bold text-xl">{m.year}</div>
                      <div className="text-gray-700">{m.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(data.achievements.items || []).map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105">
                  <div className="text-5xl mb-4">{item.icon || '★'}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mission' && (
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="md:w-1/2">
                <ImageWithFallback src={data.mission.image} alt={data.mission.title} className="w-full h-auto rounded-xl shadow-lg" />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold text-amber-700 mb-6">{data.mission.title}</h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{data.mission.content}</p>
                <div className="space-y-4">
                  {(data.mission.values || []).map((v, i) => (
                    <div key={i} className="flex items-start">
                      <div className="mt-1 mr-3 text-amber-600"><FaStar /></div>
                      <div className="text-gray-700 font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(data.team.members || []).map((member, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-xl text-center">
                  <div className="relative">
                    <ImageWithFallback src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-amber-600 mt-2">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl md:text-5xl font-bold mb-2">13+</div><div className="text-lg">سنوات من الخبرة</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">25+</div><div className="text-lg">جوائز عالمية</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">500K+</div><div className="text-lg">عميل سعيد</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">50+</div><div className="text-lg">طاهٍ محترف</div></div>
          </div>
        </div>
      </section>

      {/* Testimonials (static) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-amber-700 mb-16">آراء عملائنا</h2>
          <div className="relative">
            <div className="bg-amber-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl">★</div>
              </div>
              <p className="text-gray-700 text-lg italic mb-6">"تجربة لا تُنسى! الطعام كان رائعًا والخدمة ممتازة..."</p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
                <div className="mr-4">
                  <div className="font-bold text-gray-800">أحمد محمد</div>
                  <div className="text-gray-600">عميل دائم منذ 2015</div>
                </div>
              </div>
            </div>

            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-amber-100">
              <FaChevronLeft className="text-amber-700" />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-6 w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-amber-100">
              <FaChevronRight className="text-amber-700" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">انضم إلى رحلتنا الطهوية</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">اكتشف عالمًا من النكهات الفريدة وكن جزءًا من قصتنا المستمرة</p>
          <button onClick={goToWatsapp} className="bg-amber-500 hover:bg-amber-400 text-amber-900 px-8 py-4 rounded-full text-lg font-bold transition-colors flex items-center justify-center mx-auto">
            اطلب اونلاين <FaCalendar className="mr-2" />
          </button>
        </div>
      </section>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AboutPage;
