import React from "react";
import { Hero } from "../components/Home/Hero.jsx";
import { Header } from "../components/Home/Header.js";
import Products from "../components/Home/Products.jsx";
import { Clients } from "../components/Home/Client.jsx";
import Footer from "../components/Home/Footer";
import { Testimonials } from "../components/Home/Testonomials.jsx";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";

export const Home = () => {
  return (
    <div
      className="App overflow-x-hidden"
      style={{ backgroundColor: "whitesmoke" }}
    >
      <Header />
      <main className="animate-fade">
        <Hero />
        <Box sx={{ width: "100vw", textAlign: "center", marginTop: "3rem" }}>
          <Typography
            variant="h1"
            style={{
              fontSize: "2.3rem",
              fontWeight: "600",
              color: "rgb(107, 169, 169)",
              marginBottom: "20px",
            }}
            // id="text00"
          >
            Key Aspects
          </Typography>
          <center>
          <Divider
            sx={{
              backgroundColor: "blue",
              width: { lg: "10%", xs: "40%", md: "10%", sm: "15%" },
              fontWeight: "800",
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "40px",
            }}
          />
        </center>
          <Grid container>
            <Grid item lg={5} xs={12} sm={12} md={12}>
              <Typography
                variant="h2"
                id="domainText"
                color="text.secondary"
                sx={{
                  fontSize: {
                    lg: "1.4rem",
                    xs: "1.0rem",
                    sm: "1.0rem",
                    md: "1.2rem",
                  },
                  fontWeight: "400",

                  margin: {
                    lg: "130px 0px 20px 30px",
                    xs: "30px 0px 20px 0px",
                    md: "30px 0px 0px 0px",
                    sm: "30px 0px 0px 0px",
                  },
                  padding: "10px",
                }}
              >
                Our Smart Campus platform offers a comprehensive suite of
                features designed to meet the diverse needs of students,
                faculty, and administrators in a modern educational environment.
                Here’s an overview of what we provide:
              </Typography>
            </Grid>
            <Grid
              item
              lg={7}
              sm={12}
              xs={12}
              md={12}
              sx={{
                marginTop: { xs: "20px", md: "20px", sm: "20px", lg: "0px" },
              }}
            >
              <Box id="text00">
                <Products />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <p
          style={{
            textAlign: "center",
            backgroundColor: "whitesmoke",
            fontSize: "2.0rem",
            fontWeight: "600",
            margin: "20px 0px 20px 0px",
            color: "rgb(107, 169, 169)",
            marginTop: "57px",
          }}
        >
          Client Testimonials
        </p>
        <center>
          <Divider
            sx={{
              backgroundColor: "blue",
              width: { lg: "10%", xs: "50%", md: "10%", sm: "15%" },
              fontWeight: "800",
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "40px",
            }}
          />
        </center>
        <Clients />
        <p
          style={{
            textAlign: "center",
            backgroundColor: "whitesmoke",
            fontSize: "2.0rem",
            fontWeight: "600",
            margin: "20px 0px 20px 0px",
            color: "rgb(107, 169, 169)",
            marginTop: "50px",
          }}
        >
          Our Clients
        </p>
        <center>
          <Divider
            sx={{
              backgroundColor: "blue",
              width: { lg: "8%", xs: "30%", md: "10%", sm: "15%" },
              fontWeight: "800",
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "40px",
            }}
          />
        </center>
        <Testimonials />
        <Box
          sx={{
            padding: { xs: "3%", lg: "7%", md: "5%", sm: "10%" },
            fontSize: { xs: "20.4pt", lg: "20pt", sm: "23pt", md: "26pt" },
            fontWeight: "500",
            display: { xs: "none", lg: "block", md: "block", sm: "block" },
            marginTop: "50px",
          }}
        >
          <p
            style={{
              color: "rgb(107, 169, 169)",
              textAlign: "center",
              fontSize: "1.2rem",
              marginBottom: "10px",
            }}
            id="text001"
          >
            Ready to Explore Our Smart One?
          </p>
          <p style={{ fontSize: "2.3rem", textAlign: "center" }}>
            Stay Connected with Our Campus
            <br /> Community.
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              lineClamp: 2,
              padding: "10px",
            }}
          >
            Our platform brings together students, faculty, and staff to keep
            everyone up-to-date with the latest campus news, events, and
            announcements.
          </p>

          <center>
            <Button
              variant="contained"
              id="button"
              sx={{
                width: { lg: "30%", md: "40%", xs: "55%", sm: "40%" },
                padding: "10px",
                borderRadius: "25px",
                backgroundColor: "rgb(107, 169, 169)",
                "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                transition: "background-color 0.3s ease-in-out",
                marginTop: "60px",
                marginBottom: "40px",
              }}
              onClick={(e) => (window.location.href = "/contact")}
            >
              Let's Connect
            </Button>
          </center>
        </Box>
        <Box
          sx={{
            display: { xs: "block", lg: "none", md: "none", sm: "none" },
            marginTop: "50px",
          }}
        >
          <p
            style={{
              color: "rgb(107, 169, 169)",
              textAlign: "center",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            Ready to Explore Our Smart One?
          </p>

          <p style={{ textAlign: "center", padding: "15px" }}>
            "Our platform brings together students, faculty, and staff to keep
            everyone up-to-date with the latest campus news, events, and
            announcements. "
          </p>

          <center>
            <Button
              variant="contained"
              id="button"
              sx={{
                width: { lg: "30%", md: "40%", xs: "55%", sm: "40%" },
                padding: "10px",
                borderRadius: "25px",
                backgroundColor: "rgb(107, 169, 169)",
                "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                transition: "background-color 0.3s ease-in-out",
                marginTop: "20px",
                marginBottom: "40px",
              }}
              onClick={(e) => (window.location.href = "/contact")}
            >
              Let's Connect
            </Button>
          </center>
        </Box>
      </main>
      <Footer />
    </div>
  );
};
