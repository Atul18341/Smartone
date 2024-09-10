// // src/components/Hero.jsx
// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, Typography } from "@mui/material";
import { Header } from "./Header";
import { Navigate, useNavigate } from "react-router-dom";

// export const Hero = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     arrows: false,
//   };

//   const slides = [
//     {
//       image: "homepage_intro1.jpg",
//       title: "Welcome to Smart Campus",
//       subtitle: "Your journey to excellence starts here",
//     },
//     {
//       image: "homepage_intro2.jpg",
//       title: "Revolutionizing Campus Life with Smart Tech",
//       subtitle: "Revolutionizing the campus experience with smart technology and seamless connectivity.",
//     },
//     {
//       image: "homepage_intro3.png",
//       title: "Innovative Solutions",
//       subtitle: "Transforming Institution Campus with technology",
//     },
//   ];

//   const navigate = useNavigate();

//   return (
//     <section className="hero">
//       <Slider {...settings}>
//         {slides.map((slide, index) => (
//           <div key={index} className="relative">
//             <img
//               src={`./images/${slide.image}`}
//               alt={slide.title}
//               style={{
//                 width: "100vw",
//                 height: "70vh",
//                 objectFit: "contain",
//                 opacity: 0.8,
//               }}
//             />
//             <div
//               className="absolute inset-0 flex flex-col justify-center items-center text-center"
//               style={{
//                 background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)",
//                 color: "white",
//                 padding: "20px",
//               }}
//             >
//               <h2
//                 className="text-4xl font-bold"
//                 style={{
//                   fontSize: "2.5rem",
//                   fontWeight: "700",
//                   margin: "0",
//                   textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
//                 }}
//               >
//                 {slide.title}
//               </h2>
//               <p
//                 className="text-lg mt-2"
//                 style={{
//                   fontSize: "1.2rem",
//                   maxWidth: "800px",
//                   margin: "20px auto",
//                   lineHeight: "1.5",
//                   textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
//                 }}
//               >
//                 {slide.subtitle}
//               </p>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 style={{
//                   marginTop: "20px",

//                   fontSize: "1rem",
//                   boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
//                 }}
//                 onClick={() => navigate("/login")}
//               >
//                 Sign In
//               </Button>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </section>
//   );
// };

export const Hero = () => {

  const navigate=useNavigate();

  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage: "url(../images/homepage_intro1.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 80%",
          backgroundSize: "cover",
          paddingTop: { lg: "4vw", md: "4vw", sm: "4vw", xs: "35vw" },
          paddingBottom: { lg: "13vw", xs: "25vw", md: "15vw" },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay with opacity
            zIndex: 1,
          },
        }}
      >
        <Grid
          container
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            padding: { xs: "20px", sm: "20px", md: "50px" },
          }}
        >
          <Grid item xs={12} sm={12} lg={6} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.4rem",
                  md: "2.6rem",
                  lg: "2.6rem",
                },
                marginTop: { xs: "20px", md: "50px" },
                fontWeight: "bold",
              }}
            >
              Welcome to Smart One
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.2rem",
                  lg: "1.2rem",
                },
                marginTop: "10px",
                fontWeight: "500",
                padding: { xs: "10px", sm: "10px", md: "0px" },
              }}
            >
              Revolutionizing the campus experience with smart technology and
              seamless connectivity.
            </Typography>

            <Button variant="contained" onClick={(e)=>navigate('/login')}
              sx={{borderRadius:"20px",marginTop:"10px",width:{lg:"20%",xs:"30%",sm:"20%"},backgroundColor: "rgb(107, 169, 169)", "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
              transition: 'background-color 0.3s ease-in-out',}}>Sign in</Button>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
    </Box>
  );
};
