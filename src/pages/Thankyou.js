// src/components/ThankYou.jsx
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarNew from '../components/NavbarNew';
import Footer from '../components/Home/Footer';

export const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <Box>
        <NavbarNew/>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        color: 'white',
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box
        sx={{
            color:"black"
        }}
        >
          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="h6" paragraph>
            Thank you for reaching out to us. You will receive an email from us soon.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 3, borderRadius:"20px", }}
            onClick={() => navigate('/')}
          >
            Go Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
    <Footer/>
    </Box>
  );
};

