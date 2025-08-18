import React, { useState } from 'react';
import {
  FaStar,
  FaCalendar,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import aboutData from '../data/aboutUsData.json';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('history');
  function GotoWatsapp() {
    // الرابط الذي يؤدي إلى محادثة واتساب مع الرقم المحدد
    const watsappLink = aboutData.contact.watsapp;
    // توجيه المستخدم إلى الرابط
    window.location.href = watsappLink;
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img
                src={aboutData.history.image}
                alt="تاريخ المطعم"
                className="w-full h-auto rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentNode.innerHTML =
                    '<div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">صورة تاريخ المطعم</div>';
                }}
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-amber-700 mb-6">
                {aboutData.history.title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {aboutData.history.content}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {aboutData.history.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600"
                  >
                    <div className="text-amber-700 font-bold text-xl">
                      {milestone.year}
                    </div>
                    <div className="text-gray-700">{milestone.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.achievements.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        );
      case 'mission':
        return (
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="md:w-1/2">
              <img
                src={aboutData.mission.image}
                alt="رسالة المطعم"
                className="w-full h-auto rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentNode.innerHTML =
                    '<div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">صورة رسالة المطعم</div>';
                }}
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-amber-700 mb-6">
                {aboutData.mission.title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {aboutData.mission.content}
              </p>
              <div className="space-y-4">
                {aboutData.mission.values.map((value, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-3 text-amber-600">
                      <FaStar />
                    </div>
                    <div className="text-gray-700 font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.team.members.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-xl text-center"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentNode.innerHTML =
                        '<div class="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-64 flex items-center justify-center text-gray-500">صورة العضو</div>';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 mt-2">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-amber-50">
      {/* Hero Section */}
      <section
        className="relative py-28 md:py-40 text-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${aboutData.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
            {aboutData.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            {aboutData.hero.subtitle}
          </p>
          <div className="mt-12 flex justify-center">
            <Link to="/menu">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold flex items-center transition-colors">
                تصفح القائمة <FaArrowLeft className="mr-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('history')}
            >
              تاريخنا
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('achievements')}
            >
              إنجازاتنا
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
                activeTab === 'mission'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('mission')}
            >
              رسالتنا
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
                activeTab === 'team'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('team')}
            >
              فريقنا
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-amber-700">
              {activeTab === 'history' && aboutData.history.title}
              {activeTab === 'achievements' && aboutData.achievements.title}
              {activeTab === 'mission' && aboutData.mission.title}
              {activeTab === 'team' && aboutData.team.title}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {renderSection()}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">13+</div>
              <div className="text-lg">سنوات من الخبرة</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-lg">جوائز عالمية</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-lg">عميل سعيد</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg">طاهٍ محترف</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-amber-700 mb-16">
            آراء عملائنا
          </h2>

          <div className="relative">
            <div className="bg-amber-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl mr-2">★</div>
                <div className="text-amber-400 text-3xl">★</div>
              </div>
              <p className="text-gray-700 text-lg italic mb-6">
                "تجربة لا تُنسى! الطعام كان رائعًا والخدمة ممتازة. سأعود
                بالتأكيد مع أسرتي وأصدقائي. أشكر الفريق بأكمله على هذه التجربة
                الفريدة."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16"></div>
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

      {/* CTA Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            انضم إلى رحلتنا الطهوية
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            اكتشف عالمًا من النكهات الفريدة وكن جزءًا من قصتنا المستمرة
          </p>
            <button onClick={() => {GotoWatsapp() }} className="bg-amber-500 hover:bg-amber-400 text-amber-900 px-8 py-4 rounded-full text-lg font-bold transition-colors flex items-center justify-center mx-auto">
              اطلب اونلاين <FaCalendar className="mr-2" />
            </button>
        </div>
      </section>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
