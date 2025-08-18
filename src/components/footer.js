import React, { useState, useEffect } from 'react';
import '../index.css'; // اختياري إذا كان لديك ملف CSS
import data from '../data/footer.json'; // تحميل البيانات من ملف JSON


function Footer() {

  // تحميل البيانات من ملف JSON

  return (
    <div className="nav">
      <footer className="footer py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-amber-500">
                <i className="fas fa-utensils mr-2"></i>{data.restaurantName}
              </h3>
              <p className="text-gray-300 mb-4">
                {data.description}
              </p>
<div className="grid grid-cols-4 gap-x-4">
  {data.socialLinks.map((link, index) => (
    <a key={index} href={link.url} className="text-gray-300 hover:text-amber-500">
      <i className={`fab fa-${link.icon}`}></i>
    </a>
  ))}
</div>



            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                {data.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-300 hover:text-amber-500">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">ساعات العمل</h4>
              <ul className="space-y-2 text-gray-300">
                {data.workHours.map((hour, index) => (
                  <li key={index}>{hour}</li>
                ))}
              </ul>
            </div>

            <div>
                <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <i className="fas fa-map-marker-alt mr-2"></i>{data.address}
                </li>
                <li>
                  <i className="fas fa-phone mr-2"></i>{data.phone}
                </li>
                <li>
                  <i className="fas fa-envelope mr-2"></i>{data.email}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {data.restaurantName}. {data.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
