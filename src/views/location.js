import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaCar, FaTruck, FaUsers, FaTv, FaWifi, FaChild } from 'react-icons/fa';
import locationsData from '../data/locationsData.json';

const LocationsPage = () => {
  const [activeBranch, setActiveBranch] = useState(0);
  const [currentMapSrc, setCurrentMapSrc] = useState(locationsData.mainLocation.mapEmbedSrc);
  
  // رموز أيقونات الميزات
  const featureIcons = {
    "مواقف مجانية": <FaCar className="text-amber-600 mr-2" />,
    "خدمة التوصيل": <FaTruck className="text-amber-600 mr-2" />,
    "مكان مخصص للعائلات": <FaUsers className="text-amber-600 mr-2" />,
    "شاشات عرض المباريات": <FaTv className="text-amber-600 mr-2" />,
    "إنترنت مجاني سريع": <FaWifi className="text-amber-600 mr-2" />,
    "منطقة ألعاب للأطفال": <FaChild className="text-amber-600 mr-2" />
  };

    function goToWatsapp() {
    // الرابط الذي يؤدي إلى محادثة واتساب مع الرقم المحدد
    const watsappLink = locationsData.contact.watsapp;
    
    // توجيه المستخدم إلى الرابط
    window.location.href = watsappLink;
  }

  // تغيير الخريطة عند اختيار فرع
  const handleBranchSelect = (index) => {
    setActiveBranch(index);
    setCurrentMapSrc(locationsData.branches[index].mapEmbedSrc);
  };

  return (
    <div className="font-sans text-gray-800 bg-amber-50">
      {/* Hero Section */}
      <section 
        className="relative py-28 md:py-40 text-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${locationsData.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
            {locationsData.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            {locationsData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Location & Map */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-amber-700 mb-6">
                {locationsData.mainLocation.title}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-amber-600 mt-1 mr-3 text-xl" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">العنوان</h3>
                    <p className="text-gray-600">{locationsData.mainLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="text-amber-600 mt-1 mr-3 text-xl" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">الهاتف</h3>
                    <p className="text-gray-600">{locationsData.mainLocation.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaClock className="text-amber-600 mt-1 mr-3 text-xl" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">ساعات العمل</h3>
                    <div className="space-y-2">
                      {locationsData.mainLocation.hours.map((hour, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-700">{hour.day}</span>
                          <span className="text-gray-600">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">مميزات الفرع</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {locationsData.mainLocation.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-amber-50 p-3 rounded-lg">
                        {featureIcons[feature] || <FaMapMarkerAlt className="text-amber-600 mr-2" />}
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* خريطة الفروع */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 w-full">
                <iframe 
                  src={currentMapSrc} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="خريطة فروع مطعم الذواقة"
                ></iframe>
              </div>
              <div className="p-4 bg-amber-50 border-t border-amber-100 text-center">
                <a 
                  href={activeBranch === -1 
                    ? locationsData.mainLocation.mapLink 
                    : locationsData.branches[activeBranch]?.mapLink || "#"
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 font-medium flex items-center justify-center"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  <span>فتح الخريطة في تطبيق خرائط جوجل</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Branches List */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-amber-700 mb-8">فروعنا الأخرى</h2>
            
            <div className="space-y-6">
              {locationsData.branches.map((branch, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeBranch === index ? 'ring-2 ring-amber-500' : 'hover:shadow-xl'
                  }`}
                  onClick={() => handleBranchSelect(index)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 bg-gray-200">
                      <img 
                        src={branch.image} 
                        alt={branch.city}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800">{branch.city}</h3>
                        {activeBranch === index && (
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">محدد</span>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-amber-600 mt-1 mr-2" />
                          <span className="text-gray-600">{branch.address}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <FaPhone className="text-amber-600 mt-1 mr-2" />
                          <span className="text-gray-600">{branch.phone}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <FaClock className="text-amber-600 mt-1 mr-2" />
                          <span className="text-gray-600">{branch.hours}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => handleBranchSelect(index)}
                      >
                        عرض على الخريطة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* إحصائيات الفروع */}
            <div className="mt-12 bg-amber-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-4">معلومات الفروع</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-700">8</div>
                  <div className="text-gray-700">فروع في المملكة</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-700">24/7</div>
                  <div className="text-gray-700">خدمة العملاء</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-700">500+</div>
                  <div className="text-gray-700">مواقف سيارات</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-700">12+</div>
                  <div className="text-gray-700">سنة في الخدمة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-amber-700 mb-16">
            أسئلة شائعة عن الفروع
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: "ما هي ساعات العمل في جميع الفروع؟",
                answer: "معظم فروعنا تعمل من الساعة 10 صباحًا حتى 12 منتصف الليل، مع اختلاف بسيط في بعض الفروع. يمكنك الاطلاع على ساعات العمل الدقيقة لكل فرع في صفحة الفروع."
              },
              {
                question: "هل جميع الفروع توفر خدمة التوصيل؟",
                answer: "نعم، جميع فروعنا توفر خدمة التوصيل للمنازل والمكاتب ضمن نطاق جغرافي محدد حول كل فرع."
              },
              {
                question: "هل يمكنني الحجز في أي فرع عبر الإنترنت؟",
                answer: "نعم، يمكنك الحجز في أي فرع من خلال موقعنا الإلكتروني أو تطبيق الجوال. اختر الفرع المفضل ثم حدد الوقت المناسب لك."
              },
              {
                question: "هل توجد أماكن مخصصة للعائلات في جميع الفروع؟",
                answer: "معظم فروعنا تحتوي على قسم خاص للعائلات. يمكنك التأكد من وجود هذه الخدمة في الفرع الذي تختاره من خلال صفحة الفروع."
              },
              {
                question: "كيف يمكنني العثور على أقرب فرع لي؟",
                answer: "يمكنك استخدام خريطة الفروع في هذه الصفحة لتحديد أقرب فرع لموقعك الحالي. كما يمكنك استخدام خدمة تحديد الموقع في التطبيق للعثور على الفروع القريبة منك."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-amber-50 rounded-xl overflow-hidden shadow-md"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            زوروا أقرب فرع لكم واستمتعوا بتجربة فريدة
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            احجزوا الآن لتضمنوا أفضل الأماكن في فرعكم المفضل
          </p>
          <button onClick={() => { goToWatsapp() }} className="bg-amber-500 hover:bg-amber-400 text-amber-900 px-8 py-4 rounded-full text-lg font-bold transition-colors">
            اطلب اونلاين الان
          </button>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;