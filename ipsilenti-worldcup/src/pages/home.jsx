import React from 'react';
import GridSection from '../components/GridSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32 }}>
        <Header />
        <GridSection />
        <Button>버튼</Button>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
