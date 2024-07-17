// src/components/Hero.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const slides = [
    {
      image:
        "homepage_intro5.jpg",
      title: "Welcome to Smart Campus",
      subtitle: "Your journey to excellence starts here",
    },
    {
      image:
        "homepage_intro1.jpg",
      title: "Revolutionizing Campus Life with Smart Tech",
      subtitle: "Revolutionizing the campus experience with smart technology and seamless connectivity.",
    },
    {
      image:
        "homepage_intro2.jpg",
      title: "Innovative Solutions",
      subtitle: "Transforming Institution Campus with technology",
    },
    {
      image:
        "homepage_intro3.png",
      title: "Join Our Community",
      subtitle: "Where students and faculty thrive",
    },
  ];

  const navigate=useNavigate();
  return (
    <section className="hero">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={`./images/${slide.image}`}
              alt={slide.title}
              style={{width:"100vw",height:"470px",objectFit:"contain"}}
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center text-white p-4">
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="text-lg mt-2">{slide.subtitle}</p>
              <Button variant="contained" style={{marginTop:"15px"}} onClick={(e)=>{
                navigate('/login')
              }}>Sign in</Button>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};