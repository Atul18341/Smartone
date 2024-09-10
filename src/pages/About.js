import {
  Box,
  Button,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { IoMdArrowRoundUp } from "react-icons/io";

import { useEffect, useState } from "react";
import { Header } from "../components/Home/Header";
import Footer from "../components/Home/Footer";

export const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      style={{
        overflowX: "hidden",
        backgroundColor: "whitesmoke",
        color: "#113",
       
      }}
    >
      <Header />
      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          // marginTop: "50px",
          backgroundImage: "url(../images/About.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: {
            xs: "bottom-center",
            lg: "center",
            md: "center",
            sm: "center",
          },
          backgroundSize: "cover",
          overflowX: "none",
          padding: "5.3rem 0rem 13rem 0rem",
          height: "100%",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Overlay with opacity
            zIndex: 1,
          },
        }}
      >
        {scrollPosition > 150 && (
          <Button
            id="button"
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "10px",
              zIndex: "10",
              fontSize: "1.5rem",
              backgroundColor: "#7a7ad4",
            }}
            onClick={(e) => {
              window.scrollTo({
                top: "0px",
                behavior: "smooth",
              });
            }}
          >
            <IoMdArrowRoundUp style={{ color: "white" }} />
          </Button>
        )}
        <Grid
          container
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            padding: { xs: "20px", sm: "20px", md: "50px" },
          }}
        >
          <Grid item xs={12} sm={12} lg={6} md={6}>
            <Typography variant="h1" style={{ fontSize: "3.2rem", marginBottom: "19px" }}>
              Smart one
            </Typography>
            <Typography
              variant="h1"
              sx={{
                paddingBottom: "20px",
                fontSize: "1.1rem",
                marginLeft: {
                  lg: "20px",
                  xs: "0px",
                  sm: "0px",
                  md: "20px",
                },
                padding: {
                  lg: "0px",
                  xs: "10px",
                  sm: "10px",
                  md: "0px",
                },
                fontWeight: "400",
                color: "white",
                marginTop: "-20px",
              }}
              id="hero1"
            >
              Smart one is an online platform designed to revolutionize the
              campus experience with advanced technology and seamless
              connectivity.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100vw", marginTop: "50px" }}>
        <Typography
          variant="h1"
          style={{
            fontSize: "2.3rem",
            fontWeight: "600",
            color: "rgb(107, 169, 169)",
            marginBottom: "20px",
            textAlign: "center",
          }}
          // id="text00"
        >
          Introduction
        </Typography>
        <center>
          <Divider
            sx={{
              // padding: "0.7px",
              backgroundColor: "rgb(79 79 138)",
              width: { lg: "8%", xs: "36%", md: "10%", sm: "15%" },
              marginTop: "10px",
            }}
          />
        </center>
        <Typography
          component="div"
          sx={{
            padding: "20px",
            fontSize: "1.1rem",
            textAlign: {
              lg: "justify",
              md: "justify",
              xs: "initial",
              sm: "initial",
            },
          }}
        >
          SmartOne is an innovative online platform designed to transform the
          campus experience through advanced technology and seamless
          connectivity. Our platform provides an integrated solution for
          students, faculty, and administration, ensuring efficient
          communication, streamlined processes, and enhanced engagement. With
          SmartOne, users can easily access campus resources, stay updated with
          real-time notifications. Our mission is to create a smarter, more
          connected campus environment that fosters collaboration and success
          for everyone involved.
        </Typography>
        <center>
          <p style={{ fontSize: "1.5rem", fontWeight: "600",color: "rgb(107, 169, 169)", }}>Key Features </p>
        </center>
        <center>
          <Divider
            sx={{
             
              backgroundColor: "rgb(79 79 138)",
              width: { lg: "5%", xs: "30%", md: "10%", sm: "15%" },
              marginTop: "10px",
            }}
          />
        </center>
        <Grid container sx={{ padding: { lg: "50px" } }} spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={5} sx={{alignContent: "center",}}>
            <center>
              {" "}
              <CardMedia
                component="img"
                src="../images/smartOne.png"
                sx={{
                  width: { lg: "30vw", xs: "90vw", md: "40vw", sm: "90vw" },
                  alignContent: "center",
                  height: "35vh",
                  objectFit: "cover",
                  textAlign:"center"
                }}
                alt=""
              />
            </center>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={7}>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                padding: "20px",
              }}
            >
              <h2 style={{ color: "rgb(107, 169, 169)", marginBottom: "20px" }}>
                Apply for Bonafide Certificate with SmartOne
              </h2>
              <p>
                SmartOne simplifies the process of applying for a bonafide
                certificate, ensuring students can easily obtain the necessary
                documentation for various purposes. Here's how it works:
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                User-Friendly Interface
              </h3>
              <p>
                Our intuitive interface guides students through the application
                process, making it accessible for all users.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Easy Application Process
              </h3>
              <p>
                Students can log in to their SmartOne accounts and navigate to
                the 'Bonafide Certificate' section. Fill out a simple online
                form with essential details such as name, enrollment number,
                course, and purpose of the certificate. Review the entered
                information to ensure accuracy before submission.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Real-Time Status Updates
              </h3>
              <p>
                Once submitted, students receive real-time updates on the status
                of their application. Notifications are sent at each stage of
                the process, from application received to certificate ready for
                collection.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Efficient Processing
              </h3>
              <p>
                Our platform ensures that applications are processed promptly by
                the administrative staff. SmartOne streamlines the workflow,
                reducing manual intervention and speeding up the issuance of
                certificates.
              </p>
            </div>
          </Grid>
        </Grid>
        <Grid container sx={{ padding: { lg: "50px" } }} spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={7}>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                padding: "20px",
              }}
            >
              <h2
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "15px",
                  marginTop: "5px",
                }}
              >
                Apply for Overall No Dues with SmartOne
              </h2>
              <p>
                SmartOne simplifies the process of applying for a Overall No
                Dues, ensuring students can easily obtain the necessary
                documentation for various purposes. Here's how it works:
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                User-Friendly Interface
              </h3>
              <p>
                Our intuitive interface guides students through the application
                process, making it accessible for all users.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Easy Application Process
              </h3>
              <p>
                Students can log in to their SmartOne accounts and navigate to
                the Overall No Dues section. Review the entered information to
                ensure accuracy before submission.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Real-Time Status Updates
              </h3>
              <p>
                Once submitted, students receive real-time updates on the status
                of their application. Notifications are sent at each stage of
                the process, from application received to approved by all
                departments.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Efficient Processing
              </h3>
              <p>
                Our platform ensures that applications are processed promptly by
                the administrative staff. SmartOne streamlines the workflow,
                reducing manual intervention and speeding up the overall of
                work.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={5} sx={{alignContent: "center",}}>
            <center>
              {" "}
              <CardMedia
                component="img"
                src="../images/smartOne1.png"
                sx={{
                  width: { lg: "30vw", xs: "90vw", md: "40vw", sm: "90vw" },
                 
                  height: "35vh",
                  objectFit: "contain",
                }}
                alt=""
              />
            </center>
          </Grid>
        </Grid>
        <Grid container sx={{ padding: { lg: "50px" } }} spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={5} sx={{alignContent: "center",}}>
            <center>
              {" "}
              <CardMedia
                component="img"
                src="../images/smartOne2.png"
                sx={{
                  width: { lg: "30vw", xs: "90vw", md: "40vw", sm: "90vw" },
                  
                  height: "35vh",
                  objectFit: "contain",
                  display: { lg: "block", md: "block", sm: "none", xs: "none" },
                  
                }}
                alt=""
              />
            </center>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={7}>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                padding: "20px",
              }}
            >
              <h2
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "15px",
                  marginTop: "5px",
                }}
              >
                Apply for Hostel Request with SmartOne
              </h2>
              <p>
                SmartOne simplifies the process of applying for a Hostel
                Request, ensuring students can easily obtain the necessary
                documentation for various purposes. Here's how it works:
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                User-Friendly Interface
              </h3>
              <p>
                Our intuitive interface guides students through the application
                process, making it accessible for all users.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Easy Application Process
              </h3>
              <p>
                Students can log in to their SmartOne accounts and navigate to
                the 'Hostel Request' section. Fill out a simple online form with
                essential details such as name, enrollment number, course, and
                How many members. Review the entered information to ensure
                accuracy before submission.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Real-Time Status Updates
              </h3>
              <p>
                Once submitted, students receive real-time updates on the status
                of their application. Notifications are sent at each stage of
                the process, from application received to certificate ready for
                collection.
              </p>
              <h3
                style={{
                  color: "rgb(107, 169, 169)",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Efficient Processing
              </h3>
              <p>
                Our platform ensures that applications are processed promptly by
                the administrative staff. SmartOne streamlines the workflow,
                reducing manual intervention and speeding up overall work.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <center>
              {" "}
              <CardMedia
                component="img"
                src="../images/smartOne2.png"
                sx={{
                  width: { lg: "30vw", xs: "90vw", md: "40vw", sm: "90vw" },
                  marginTop: { lg: "200px", xs: "0px", md: "200px" },
                  height: "35vh",
                  objectFit: "contain",
                  display: { lg: "none", md: "none", sm: "block", xs: "block" },
                }}
                alt=""
              />
            </center>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};
