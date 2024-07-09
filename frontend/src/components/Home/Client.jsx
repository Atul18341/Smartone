
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

export const Clients = () => {
  const clients = [
    {
      logo: "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "John",
      description: "A leading technology company specializing in software development and digital solutions.",
    },
    {
      logo: "https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Rehen",
      description: "A global consulting firm offering strategic advisory and business optimization services.",
    },
    {
      logo: "https://images.pexels.com/photos/3824771/pexels-photo-3824771.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Henry",
      description: "A renowned educational institution committed to excellence in teaching and research.",
    },
    {
      logo: "https://images.pexels.com/photos/4100672/pexels-photo-4100672.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Mark",
      description: "A leading healthcare provider dedicated to delivering compassionate care and innovative treatments.",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Box py={8} bgcolor="grey.100">
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Clients
      </Typography>
      <Slider {...settings}>
        {clients.map((testimonial, index) => (
          <Grid key={index} container justifyContent="center">
            <Card sx={{ maxWidth: 345, m: 2 }}>
              <CardMedia
                component="img"
                height="240"
                style={{objectFit:"scale-down"}}
                image={testimonial.logo}
                alt={testimonial.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {testimonial.name}
                </Typography>
               
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