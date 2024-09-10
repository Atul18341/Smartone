import React, { useRef } from 'react';
import { Box,  Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { styled } from '@mui/system';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Autoplay } from 'swiper/modules';



const SliderContainer = styled('div')({
  width: '100%',
});



const Products = () => {
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

  const products = [
    {
      image: 'product_intro1.jpg',
      description: 'Semester Registration: you can register your semester online.',
    },
    {
      image: 'product_intro2.jpg',
      description: 'Certificates: Now you can get your precious college related certificate online.',
    },
    {
      image: 'product_intro3.jpg',
      description: 'Hostel/Mess: You can apply online for Hostel/Mess rooms.',
    },
    {
      image: 'guest.jpg',
      description: 'Guest Room: Now you can book Exclusive Guest Room online.',
    },
  ];

  return (
    <Box>
      <SliderContainer>
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          autoplay={{
            delay: 3000, // 3 seconds delay between slides
            disableOnInteraction: false, // Autoplay won't be disabled after manual interaction
          }}
          breakpoints={{
            640: { slidesPerView: 1 },  // Extra-small screens (xs)
            768: { slidesPerView: 1 },  // Small screens (sm)
            1024: { slidesPerView: 1 }, // Medium screens (md)
            1280: { slidesPerView: 1 }, // Large screens (lg)
          }}
          modules={[Autoplay]}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index} >
              <Grid container justifyContent="center">
                <Grid item xs={11} sm={11} md={11} lg={8} >
                  <Card className='hoverCard' >
                    <center>
                        <CardMedia
                      component="img"
                      alt={`Card ${index + 1}`}
                      
                      image={`../images/${product.image}`}
                      sx={{ objectFit: "contain",
                        height:{
                            xs:230,
                            lg:290,
                            md:400,
                            sm:300
                        },
                        width:{
                            xs:350,
                            lg:400,
                            md:400,
                            sm:300
                        }
                       }}
                      onError={() => console.error(`Failed to load image: ${product}`)}
                    /></center>
                    <CardContent>
                      
                      <Typography gutterBottom variant="p" color="text.secondary" sx={{fontSize:'1.0rem'}}>
                        {`${product.description}`}
                      </Typography>
                    
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </SliderContainer>
      <Box display="flex" justifyContent="center" mt={4} gap={5} >
       
          <RiArrowLeftSLine onClick={handlePrev} style={{fontSize:"1.2rem"}}/>
       
      
          <MdOutlineKeyboardArrowRight onClick={handleNext} style={{fontSize:"1.2rem"}}/>
      
      </Box>
    </Box>
  );
};

export default Products;
