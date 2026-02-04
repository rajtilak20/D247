import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Deals from './pages/Deals';
import DealDetail from './pages/DealDetail';
import Stores from './pages/Stores';
import AdminLogin from './pages/AdminLogin';
import AdminDeals from './pages/AdminDeals';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:slug" element={<DealDetail />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/deals" element={<AdminDeals />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
