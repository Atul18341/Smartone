import React from 'react';
import {Hero} from "../components/Home/Hero.jsx"
import {Header} from "../components/Home/Header.js"
import Products from '../components/Home/Products.jsx';
import  {Clients}  from '../components/Home/Client.jsx';
import Footer from '../components/Home/Footer';
import Testimonials from "../components/Home/Testonomials.jsx"

export const Home = () => {
  


  return (
    <div className="App overflow-x-hidden">
      <Header />
      <main className="animate-fade">
        <Hero />
        <Products/>
        <Clients />
      <Testimonials/>
      </main>
      <Footer />
    </div>
  );
};