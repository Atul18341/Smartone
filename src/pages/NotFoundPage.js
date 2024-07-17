import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import NavbarNew from '../components/NavbarNew';
import Footer from '../components/Home/Footer';

export const NotFoundPage = () => {
  return (
    <Box className="fullArea">
      <NavbarNew />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight="83vh"
        textAlign="center"
        position="relative"
        zIndex={9}
      >
        <img src='./images/404.png' alt='' style={{width:"300px"}}/>
        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Link to="/">
          <Typography variant="h6" component="p" color="primary">
            Go back to Home
          </Typography>
        </Link>
      </Box>
      <Footer />
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </Box>
  );
};

export default NotFoundPage;
