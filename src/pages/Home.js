import React from 'react';
import {Hero} from "../components/Home/Hero.jsx"
import {Header} from "../components/Home/Header.js"
import Products from '../components/Home/Products.jsx';
import  {Clients}  from '../components/Home/Client.jsx';
import Footer from '../components/Home/Footer';
import Testimonials from "../components/Home/Testonomials.jsx"
import { Helmet } from "react-helmet";

export const Home = () => {
  


  return (
    <div className="App overflow-x-hidden">
      <Helmet>
        <title>Smartone: A Smart Campus Initiative</title>
      </Helmet>
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