import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { FaGithub, FaLinkedin, FaTelegram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';


const FooterContainer = styled('footer')({
  padding: '40px 0px 30px 0px',
  // backgroundColor: '#aeb1b3',
   backgroundColor: 'rgb(48 48 91)',
   color:"white",
  // marginTop:"50px"
});

const FooterGrid = styled(Grid)({
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const FooterLink = styled(Link)({
  marginRight: '20px',
  color: 'white',
  cursor:"pointer",
  textDecoration: 'none',
  '&:hover': {
    color: '#007bff',
    textDecorationStyle:"none"
  },
});

export const Footer = () => {
 
  return (
    <FooterContainer >
      <Container>
        <FooterGrid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white" mb={2}>
              Address
            </Typography>
            <Typography variant="body1" color="white">
              3/365, Aryan Bhawan<br />
              Lakho Binda Campus, Santunagar,<br />
              Madhubani (Bihar)-India<br />
              Pin-847211
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" mb={2} sx={{color:"white"}}>
              Quick Links
            </Typography>
            <FooterLink onClick={(e)=>window.location.href='/'}>Home</FooterLink>
            <FooterLink onClick={(e)=>window.location.href='/about'}>About</FooterLink>
            <FooterLink onClick={(e)=>window.location.href='/contact'}>Contact Us</FooterLink>
           
            
          </Grid>
         
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="textPrimary" mb={2} sx={{color:"white"}}>
            Social Links
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <MdEmail style={{ marginRight: '8px' }} />
            <FooterLink href="mailto:lyssstartup24@gmail.com" color="textSecondary">
              lyssstartup24@gmail.com
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <MdPhone style={{ marginRight: '8px' }} />
            <FooterLink href="tel:+91 6205695667" color="textSecondary">
              +91 6205695667
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaGithub style={{ marginRight: '8px' }} />
            <FooterLink href="#" color="textSecondary">
              GitHub
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaLinkedin style={{ marginRight: '8px' }} />
            <FooterLink href="https://www.linkedin.com/company/lyss-technology/?originalSubdomain=in" color="textSecondary">
              LinkedIn
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaTelegram style={{ marginRight: '8px' }} />
            <FooterLink href="#" color="textSecondary">
              Telegram
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaFacebook style={{ marginRight: '8px' }} />
            <FooterLink href="#" color="textSecondary">
              Facebook
            </FooterLink>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaYoutube style={{ marginRight: '8px' }} />
            <FooterLink href="#" color="textSecondary">
              YouTube
            </FooterLink>
          </Box>
        </Grid>
     

        </FooterGrid>
      </Container>
      <Typography variant="h6" align='center' color="text.secondary" mt={2} sx={{color:"white",fontSize:"1.0rem"}}>
            © Copyright {new Date().getFullYear()}. All Rights Reserved.
            </Typography>
    </FooterContainer>
  );
};


