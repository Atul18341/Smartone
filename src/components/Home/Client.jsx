import React, { useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { styled } from "@mui/system";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiArrowLeftSLine } from "react-icons/ri";


import { Autoplay } from "swiper/modules";



const SliderContainer = styled("div")({
  width: "100vw",
});

const SliderButton = styled("div")({
  fontSize: "1.2rem",
  cursor: "pointer",
  margin: "0 10px",
});

export const Clients = () => {
  const swiperRef = useRef(null);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const images = [
    "https://images.pexels.com/photos/3824771/pexels-photo-3824771.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4100672/pexels-photo-4100672.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const Cards = ["John", "Mark", "Peter", "Ron"];

  const Tagline = [
    '"The training program was exceptional! The hands-on experience and insights from industry experts gave me the confidence and skills to advance in my career. Highly recommend to anyone looking to gain practical knowledge."',

    '"Their team made the company registration process incredibly smooth. They handled all the paperwork and legalities efficiently, allowing us to focus on our business. We couldn’t have asked for a better experience."',

    "SmartOne Solutions transformed our business operations. The customized software and innovative strategies boosted our productivity significantly. Their team's expertise and dedication to our success were evident throughout the process.",

    '"I gained so much from their internship program. The practical training and real-world projects were invaluable. It was a fantastic opportunity to learn from seasoned professionals and apply my skills in a meaningful way."',
  ];

  return (
    <Box sx={{backgroundColor:"whitesmoke", marginTop:"40px"}}>
      <SliderContainer>
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          autoplay={{
            delay: 5000, // 3 seconds delay between slides
            disableOnInteraction: false, // Autoplay won't be disabled after manual interaction
          }}
          breakpoints={{
            640: { slidesPerView: 1 }, // Extra-small screens (xs)
            768: { slidesPerView: 1 }, // Small screens (sm)
            1024: { slidesPerView: 1 }, // Medium screens (md)
            1280: { slidesPerView: 1 }, // Large screens (lg)
          }}
          modules={[Autoplay]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <center>
                <Box>
                  <Card sx={{ maxWidth: "880px" }}>
                    <Grid container>
                      <Grid item lg={4} sm={12} xs={12} md={4}>
                        <center>
                          <CardMedia
                            component="img"
                            alt={`Card ${index + 1}`}
                            image={image}
                            sx={{
                              objectFit: "cover",
                              height: {
                                xs: 230,
                                lg: 320,
                                md: 320,
                                sm: 300,
                              },
                              width: {
                                xs: 350,
                                lg: 300,
                                md: 300,
                                sm: 300,
                              },
                              marginRight: {
                                lg: "10px",
                                xs: "0px",
                                md: "0px",
                                sm: "0px",
                              },
                            }}
                            onError={() =>
                              console.error(`Failed to load image: ${image}`)
                            }
                          />
                        </center>
                      </Grid>
                      <Grid
                        item
                        lg={8}
                        sm={12}
                        xs={12}
                        md={8}
                        textAlign="center"
                      >
                        <CardContent >
                          <Typography
                            gutterBottom
                            variant="h6"
                            color="text.secondary"
                            component="div"
                            sx={{ fontSize: "1.4rem" }}
                          >
                            {Cards[index]}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "1.0rem",marginTop:{
                              lg:"50px",
                              md:"50px"
                            } }}
                          >
                            {Tagline[index]}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Box>
              </center>
            </SwiperSlide>
          ))}
        </Swiper>
      </SliderContainer>
      <Box display="flex" justifyContent="center" mt={4} gap={5}>
        <SliderButton onClick={handlePrev}>
          <RiArrowLeftSLine />
        </SliderButton>
        <SliderButton onClick={handleNext}>
          <MdOutlineKeyboardArrowRight />
        </SliderButton>
      </Box>
    </Box>
  );
};


