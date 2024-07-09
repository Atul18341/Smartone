import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    name: 'John Doe',
    title: 'CEO, ABC',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Jane Smith',
    title: 'CTO, XYZ',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Alice Johnson',
    title: 'CFO, DEF',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Bob Brown',
    title: 'COO, GHI',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Charlie White',
    title: 'CMO, JKL',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Diana Green',
    title: 'CIO, MNO',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor sem sed mi fermentum.',
    image: 'https://via.placeholder.com/150',
  },
  // Add more testimonials as needed
];

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <ArrowForwardIos />,
    prevArrow: <ArrowBackIos />,
  };

  return (
    <Box py={8} >
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Testimonials
        </Typography>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <Grid key={index} container justifyContent="center">
              <Card sx={{ maxWidth: 345, m: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={testimonial.image}
                  alt={testimonial.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {testimonial.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.description}
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

export default Testimonials;
