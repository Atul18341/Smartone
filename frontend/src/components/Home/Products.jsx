import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

const Products = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const products = [
    {
      image: 'product_intro1.jpg',
      description: 'Semester Registration where you can register your semester.',
    },
    {
      image: 'product_intro2.jpg',
      description: 'Certificates: Now you can get your precious certificates online.',
    },
    {
      image: 'product_intro3.jpg',
      description: 'Hostel/Mess: You can apply online for Hostel/Mess rooms.',
    },
    {
      image: 'product_intro4.jpg',
      description: 'Results: Also now you can download your results online.',
    },
  ];

  return (
    <Box py={8} bgcolor="grey.100">
    <Container>
      <center><p style={{fontSize:"1.8rem"}}>
       Our Products
      </p></center>
      <Slider {...settings}>
        {products.map((testimonial, index) => (
          <Grid key={index} container justifyContent="center">
            <Card sx={{ maxWidth: 345, m: 2 }}>
              <CardMedia
                component="img"
                height="240"
                style={{objectFit:"contain"}}
                image={`./images/${testimonial.image}`}
              
                alt={testimonial.name}
              />
              <CardContent>
               
                <Typography variant="body2" color="textSecondary">
                  {testimonial.description.length>80 ? `${testimonial.description.slice(0,80)}...`:(testimonial.description)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Slider>
    </Container>
  </Box>
  );
};

export default Products;