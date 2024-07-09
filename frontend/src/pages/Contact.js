import * as React from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Box,
  CardMedia,
} from "@mui/material";
import { Header } from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import { Phone, Email, LocationOn } from "@mui/icons-material";

export const Contact = () => {
  const [imageIndex, setImageIndex] = React.useState(0);
  const images = React.useMemo(() => ["contactUs.jpg", "contactUs1.jpg"], []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <>
      <Header />

      <div>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="100%"
                image={`./images/${images[imageIndex]}`}
                style={{ borderRadius: "15px",marginTop:"10px",marginBottom:"20px" }}
                alt="Contact Us Image"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <p
                style={{
                  fontSize: "1.6rem",
                  textAlign: "center",
                  marginBottom: "10px",
                  marginTop:"10px"
                }}
              >
                Contact Us
              </p>
              <Typography variant="body1" color="text.secondary">
                Have a question or want to get in touch? Fill out the form below
                and we'll get back to you soon!
              </Typography>
              <Box sx={{ py: 1, mt: 2 }}>
                <TextField fullWidth label="Name" variant="outlined" />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField fullWidth label="Email" variant="outlined" />
              </Box>
              <Box sx={{ py: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "rgb(107, 169, 169)",
                }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>

      <Container maxWidth="lg">
       
            <Grid container spacing={2} sx={{ p: 1, alignItems: "center" }}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
              <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <Phone style={{color:"rgb(107, 169, 169)"}}/>
                  <a href="tel:+1 (123) 456-7890">+1 (123) 456-7890</a>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                 <p > <Email style={{color:"rgb(107, 169, 169)"}}/></p>
                 
                  <a href="mailto:info@example.com">info@example.com</a>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
              <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <LocationOn style={{color:"rgb(107, 169, 169)"}} />
                  <a href="https://www.google.com/maps/search/?api=1&query=123+Main+St,+Anytown,+USA+12345" rel="noreferrer" target="_blank">123 Main St, Anytown, USA 12345</a> 
                </div>
              </Grid>
            </Grid>
          
      </Container>

      <Footer />
    </>
  );
};

export default Contact;
