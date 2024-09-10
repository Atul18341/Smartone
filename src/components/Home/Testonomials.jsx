import React from 'react';
import { Box, Grid } from '@mui/material';

export const Testimonials = () => {
  const images = [
    'https://i.pinimg.com/736x/da/c7/58/dac758d7606690d057a9cbba5f259154.jpg',
    'https://i.pinimg.com/736x/79/1f/84/791f846ada8f10df721c42328e78e970.jpg',
    'https://e7.pngegg.com/pngimages/923/238/png-clipart-white-and-multicolored-logo-creative-color-logo-design-text-logo.png',
    'https://www.clipartmax.com/png/middle/217-2178587_cornerstone-random-business-logos.png',
    'https://image.similarpng.com/very-thumbnail/2021/05/Logo-design-illustration-on-transparent-background-PNG.png'
  ];

  return (
    <Box>
      <Grid container spacing={2} justifyContent="center" style={{marginTop:"20px",marginBottom:"20px"}}>
        {images.map((data, index) => (
          <Grid
            key={index}
            item
            sm={6}
            xs={6}
            md={3}
            lg={2}
            sx={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              borderRadius: '8px',
              
            }}
          >
            <img src={data} alt="" style={{ width: '100%', maxWidth: '100px',objectFit:"cover" }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
