import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/nav';
import Footer from './components/footer';
import Home from './views/home.js';
import Menu from './views/menu.js';
import ContactPage from './views/contactUs.js';
import AboutPage from './views/aboutUs.js';
import LocationsPage from './views/location.js';

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen bg-gray-50">
        <Nav />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/aboutus" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/location" element={<LocationsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;