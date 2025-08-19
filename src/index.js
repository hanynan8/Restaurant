import React from 'react';
import ReactDOM from 'react-dom/client'; // استيراد createRoot من 'react-dom/client'
import './index.css'; // اختياري إذا كان لديك ملف CSS
import App from './app.js'; // تأكد أن الملف موجود

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
