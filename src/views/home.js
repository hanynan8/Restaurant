import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalendar, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RestaurantLoading from '../components/loading.js'
import '../index.css'

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to scroll sections horizontally
  const scrollSection = (sectionId, scrollAmount) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  function goToWatsapp() {
    // سنحتاج إلى تعديل هذا الجزء بعد جلب البيانات
    if (categories.length > 0 && categories[0].contact) {
      const watsappLink = categories[0].contact.watsapp;
      window.location.href = watsappLink;
    }
  }

  // جلب البيانات من API عند بدء التشغيل
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restaurant-back-end-ehus.vercel.app/api/data');
        
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات');
        }
        
        const data = await response.json();
        
        // افتراض أن API يعيد بيانات Home في خاصية معينة
        // إذا كانت البيانات تحتوي على هيكل مختلف، يجب تعديل هذا الجزء
        setCategories(data.home || data); // حسب هيكل البيانات الفعلي
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <RestaurantLoading />
    );
  }

  if (error) {
    return (
      <div className="home flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">حدث خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section 
        className="hero text-white py-20 md:py-32"
        style={{
          background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            أشهى المأكولات بأجود المكونات
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            استمتع بتجربة فريدة من أطباقنا المميزة المحضرة بعناية فائقة لتلبية ذوقك الرفيع
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu">
              <button  className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 text-lg rounded-lg transition font-bold flex items-center">
                تصفح القائمة <FaArrowLeft className="ml-2" />
              </button>
            </Link>
            <button onClick={goToWatsapp} className="one bg-white hover:bg-gray-100 text-amber-700 px-8 py-3 text-lg rounded-lg transition font-bold flex items-center">
              طلب اونلاين <FaCalendar className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* عرض الأقسام الديناميكية */}
      {categories.map((category) => (
        <section 
          key={category.id} 
          className={`py-12 ${category.id === 'dessert-section' || category.id === 'seafood-section' || category.id === 'drinks-section' ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="category-title text-3xl font-bold text-gray-800 relative inline-block mb-8">
              {category.title}
            </h2>
            
            <div className="relative">
              <div 
                id={category.id}
                className="scroll-container flex overflow-x-auto gap-x-5 py-4 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', whiteSpace: 'nowrap' }}
              >
                {category.items.map((item, index) => (
                  <div key={index} className="food-card flex-shrink-0 w-64">
                    <div className='da'>
                      <img src={item.img} alt={item.name} className="food-img w-full h-48 object-cover rounded-lg" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                          <span className="text-amber-700 font-bold">{item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <button onClick={goToWatsapp} className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-lg transition">
                          <i className="fas fa-plus mr-2"></i> اطلب الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Button for scrolling left */}
              <button
                className="nav-btn absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-white bg-opacity-80 shadow-md hover:bg-amber-700 hover:text-white"
                onClick={() => scrollSection(category.id, -300)}
              >
                <FaChevronLeft />
              </button>

              {/* Button for scrolling right */}
              <button
                className="nav-btn absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-white bg-opacity-80 shadow-md hover:bg-amber-700 hover:text-white"
                onClick={() => scrollSection(category.id, 300)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Home;