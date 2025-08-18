import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import contactData from '../data/contactData.json';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
function goToWatsapp() {
  // الرابط الذي يؤدي إلى محادثة واتساب مع الرقم المحدد
  const watsappLink = contactData.contact.watsapp;
  
  // توجيه المستخدم إلى الرابط
  window.location.href = watsappLink;
}


  const [activeFaq, setActiveFaq] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };
  
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="font-sans text-gray-800">
      
      {/* Hero Section */}
      <section 
        className="relative py-28 md:py-40 text-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${contactData.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
            {contactData.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            {contactData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-amber-700">
              {contactData.contactInfo.title}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactData.contactInfo.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-amber-50 p-8 rounded-xl text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-amber-700">
              {contactData.faq.title}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="space-y-4">
            {contactData.faq.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-bold text-gray-800">{item.question}</h3>
                  {activeFaq === index ? 
                    <FaChevronUp className="text-amber-600" /> : 
                    <FaChevronDown className="text-amber-600" />
                  }
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

      {/* CTA Section */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" >
            احجز طاولتك الآن و اطلب اونلاين
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            استمتع بتجربة فريدة من أشهى الأطباق في أجواء مميزة
          </p>
          <button onClick={() => { goToWatsapp() }} className="bg-white text-amber-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-100 transition-colors">
            احجز الآن او اطلب اونلاين
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;