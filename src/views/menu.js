import React, { useState, useEffect } from 'react';
// import RestaurantLoading from '../components/loading.js'

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watsappLink, setWatsappLink] = useState('');

  function goToWatsapp() {
    if (watsappLink) {
      window.location.href = watsappLink;
    }
  }

  useEffect(() => {
    // جلب البيانات من API
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restaurant-back-end-ehus.vercel.app/api/data');
        
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات');
        }
        
        const data = await response.json();
        
        // افتراض أن البيانات تحتوي على معلومات الاتصال والمنتجات
        // قد تحتاج إلى تعديل هذا الجزء حسب هيكل البيانات الفعلي
        setMenuData(data.menu || data.products || data);
        
        // استخراج رابط واتساب من البيانات
        if (data.contact && data.contact.watsapp) {
          setWatsappLink(data.contact.watsapp);
        }
        
        // استخراج جميع الفئات
        const allCategories = Array.isArray(data.menu || data.products || data) 
          ? (data.menu || data.products || data).map(cat => ({
              id: cat.id || cat.categoryId,
              name: cat.name || cat.categoryName
            }))
          : [];
            
        setCategories([{ id: 'all', name: 'الكل' }, ...allCategories]);

        // تعيين العناصر الافتراضية
        filterItems('all', data.menu || data.products || data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterItems = (categoryId, data = menuData) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      // عرض جميع العناصر من جميع الفئات
      const allItems = Array.isArray(data) 
        ? data.flatMap(category => category.items || [])
        : [];
      setFilteredItems(allItems);
    } else {
      // عرض العناصر الخاصة بالفئة المحددة
      const category = Array.isArray(data) 
        ? data.find(cat => (cat.id || cat.categoryId) === categoryId)
        : null;
      setFilteredItems(category ? (category.items || []) : []);
    }
  };

  // if (loading) {
  //   return (
  //     <RestaurantLoading />
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-red-500 text-xl">حدث خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            قائمة المطعم
          </h1>
          <p className="text-lg text-amber-700 max-w-3xl mx-auto">
            استمتع بتجربة فريدة من أشهى الأطباق المحضرة بعناية من أفضل المكونات
          </p>
        </div>

        {/* فلتر الفئات */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => filterItems(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-amber-700 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-100 shadow'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* عرض العناصر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id || index}
              className="bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="h-48 bg-gray-200 border-2 border-dashed rounded-t-2xl overflow-hidden">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {item.price} ج.م
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                {/* المعلومات الغذائية - عرضها فقط إذا كانت متوفرة */}
                {item.nutrition && (
                  <div className="bg-amber-50 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-amber-800 mb-2">المكونات الغذائية</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {item.nutrition.calories && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">السعرات</span>
                          <span className="font-medium">{item.nutrition.calories}</span>
                        </div>
                      )}
                      {item.nutrition.protein && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">البروتين</span>
                          <span className="font-medium">{item.nutrition.protein}</span>
                        </div>
                      )}
                      {item.nutrition.carbs && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">الكربوهيدرات</span>
                          <span className="font-medium">{item.nutrition.carbs}</span>
                        </div>
                      )}
                      {item.nutrition.fat && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">الدهون</span>
                          <span className="font-medium">{item.nutrition.fat}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <button onClick={goToWatsapp} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center">
                  <span>اطلب اونلاين</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة عندما لا يوجد عناصر */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-amber-800">لا توجد عناصر في هذه الفئة</h3>
            <p className="text-amber-600 mt-2">الرجاء اختيار فئة أخرى</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;