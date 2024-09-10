import React, { useEffect, useState } from "react";
import {
  Box,
  
  Typography,
  Button,
 
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import Footer from "../components/Home/Footer";
import NavbarNew from "../components/NavbarNew";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Url } from "../components/BaseUrl";


export const GenerateDepartments = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

 

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "super-admin" && response.role !== "office")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const onSubmit = () => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
  
    if (token && token1) {
      setLoad(true);
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${Url}/${jwtDecode(token).college}/generate-department/`,
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };
      axios
        .request(config)
        .then((response) => {
          setLoad(false);
          enqueueSnackbar("Departments created successfully", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 1000,
          });
        })
        .catch((error) => {
          setLoad(false);
  
          if (
            error?.response?.data?.errors?.detail ===
            "Given token not valid for any token type"
          ) {
            enqueueSnackbar("Logging out", {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
            navigate("/login");
          } else {
            // Handle other errors
            enqueueSnackbar("Failed to create department", {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
          }
        });
    } else {
      navigate("/login");
    }
  };
  
  return (
    <Box>
      <NavbarNew />

      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544006659-f0b21884ce1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          paddingTop: "2vw",
          paddingBottom: "15vw",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay with opacity
            zIndex: 1,
          },
        }}
      >
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
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.4rem",
                  md: "2.6rem",
                  lg: "2.6rem",
                },
                marginTop: { xs: "20px", md: "50px" },
                fontWeight: "bold",
              }}
            >
              Generate Departments
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.2rem",
                  lg: "1.2rem",
                },
                marginTop: "10px",
                fontWeight: "500",
                padding: { xs: "10px", sm: "10px", md: "0px" },
              }}
            >
              Automatically generate and manage college departments with the click of a button, streamlining the creation process while ensuring efficient task prioritization, timely decision-making, and accurate record-keeping across all departments.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <h4
        style={{ textAlign: "center", marginTop: "30px", fontSize: "1.4rem" }}
      >
        Generate Departments
      </h4>
      <center>
        <Divider
          sx={{
            backgroundColor: "blue",
            width: { lg: "7%", xs: "30%", md: "10%" },
            fontWeight: "800",
            textAlign: "center",
            marginTop: "5px",
          }}
        />
      </center>
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          borderRadius: 2,
          maxWidth: "90vw",
          margin: "auto",
          marginTop: 4,
          marginBottom: 9,
          minHeight: "70vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="./images/enrollment.png"
                alt="Enrollment"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "10px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
             
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center",flexDirection:"column",marginTop:"10%" }}>
                <center>
                <p>Click the below button to generate deparments automatically.</p>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    paddingX: 1.5,
                    paddingY: 1.0,
                    marginTop: 3,
                    borderRadius: "20px",
                    width:"60%",
                    backgroundColor: "rgb(107, 169, 169)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                  }}
                  onClick={onSubmit}
                  
                >
                  {!load && <Typography variant="body2" sx={{fontSize:{xs:"12px"}}}>Generate Departments</Typography>}
                      {load && (
                        <CircularProgress
                          style={{
                            color: "white",
                            width: "20px",
                            height: "22px",
                          }}
                        />
                      )}
                </Button>
                </center>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

