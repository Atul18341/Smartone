import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import NavbarNew from "../components/NavbarNew";

import Footer from "../components/Home/Footer";
import { useNavigate } from "react-router-dom";
import { Url } from "../components/BaseUrl";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export const CaretakerDashboard = () => {
  const navigate = useNavigate();

  const [request, setRequest] = useState(true);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "caretaker"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleChange = (number, newValue) => {
    setValue(number);

    if (newValue === "Request") {
      setRequest(true);
      setApproved(false);
      setReject(false);
    }

    if (newValue === "Approved") {
      setApproved(true);
      setRequest(false);
      setReject(false);
    }

    if (newValue === "Rejected") {
      setReject(true);
      setRequest(false);
      setApproved(false);
    }
  };

  const handleVerification = (e) => {};
  const handleReject = (e) => {};

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarNew />
      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544006659-f0b21884ce1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom-center",
          backgroundSize: "cover",
          overflowX: "none",
          paddingTop: "5vw",
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
        <Grid container sx={{
          position: "relative",
          zIndex: 2,
          color: "white",
          padding: { xs: "20px", sm: "20px", md: "50px" },
        }}>
          <Grid item xs={12} sm={12} lg={6} md={6}>
            <p
              style={{ fontSize: "2.6rem", color: "white", marginTop: "40px" }}
              id="hero"
             
            >
              Dashboard
            </p>
            <Typography
              variant="h1"
              sx={{
                fontSize: "1.2rem",
                marginLeft: {
                  lg: "20px",
                  xs: "0px",
                  sm: "0px",
                  md: "20px",
                },
                padding: {
                  lg: "0px",
                  xs: "20px",
                  sm: "10px",
                  md: "0px",
                },
                marginTop: "10px",
                fontWeight: "500",
                color: "white",
              }}
              id="hero1"
            >
              Making Caregiving Easier and More Effective, Where Care Meets
              Efficiency.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "50px",
          marginTop: "20px",
        }}
      >
        <Tabs value={value} aria-label="disabled tabs example">
          <Tab label="Request" onClick={(e) => handleChange(0, "Request")} />
          <Tab label="Approved" onClick={(e) => handleChange(1, "Approved")} />
          <Tab label="Rejected" onClick={(e) => handleChange(2, "Rejected")} />
        </Tabs>
      </Box>

      <Box sx={{marginBottom:"10%"}}>
        {request && (
          <Box>
            <p
              style={{
                fontSize: "2.0rem",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Hostel/Mess Fee Payment Requests
            </p>
            <center>
              <Divider
                sx={{
                  backgroundColor: "blue",
                  width: { lg: "17%", xs: "10%", md: "5%" },
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: "5px",
                }}
              />
            </center>
            <Box sx={{ padding: "7px" }}>
              <Grid
                container
                spacing={2}
                sx={{ width: "100vw", marginTop: "50px" }}
              >
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          color="text.secondary"
                          fontSize="1.2rem"
                        >
                          Someswar Gorai
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120125
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype:
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Maintaince Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>5000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 12th july,2024 - 12th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          fontSize="1.2rem"
                          color="text.secondary"
                        >
                          Debjeet Gorai
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120126
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Maintaince Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>5000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 12th july,2024 - 12th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        {approved && (
          <Box>
            <p
              style={{
                fontSize: "2.0rem",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Approved Requests
            </p>
            <center>
              <Divider
                sx={{
                  backgroundColor: "blue",
                  width: { lg: "17%", xs: "10%", md: "5%" },
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: "5px",
                }}
              />
            </center>
            <Box sx={{ padding: "7px" }}>
              <Grid
                container
                spacing={2}
                sx={{ width: "100vw", marginTop: "50px" }}
              >
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          color="text.secondary"
                          fontSize="1.2rem"
                        >
                          Amarnath apuri
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120127
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype:
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Security Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>6000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 10th july,2024 - 10th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          fontSize="1.2rem"
                          color="text.secondary"
                        >
                          Soumyadeep Kumar
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120122
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Security Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>7000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 12th july,2024 - 12th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        {reject && (
          <Box>
            <p
              style={{
                fontSize: "2.0rem",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Rejected Requests
            </p>
            <center>
              <Divider
                sx={{
                  backgroundColor: "blue",
                  width: { lg: "17%", xs: "10%", md: "5%" },
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: "5px",
                }}
              />
            </center>
            <Box sx={{ padding: "7px" }}>
              <Grid
                container
                spacing={2}
                sx={{ width: "100vw", marginTop: "50px" }}
              >
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          color="text.secondary"
                          fontSize="1.2rem"
                        >
                          Himanshu Singh
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120066
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype:
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Maintaince Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>5000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 12th july,2024 - 12th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}
                  >
                    <CardActionArea>
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          textAlign="center"
                          variant="body2"
                          fontSize="1.2rem"
                          color="text.secondary"
                        >
                          Debjeet Gorai
                        </Typography>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                          marginBottom="0%"
                        >
                          Registration No.: 16900120126
                        </Typography>
                        <Grid container sx={{ padding: "20px" }}>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Feetype
                              </Typography>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                color="text.secondary"
                              >
                                Maintaince Fees
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                marginTop="5px"
                              >
                                Monthly Charges: <span>5000</span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} lg={6} md={6} sm={6}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                              marginTop="10px"
                            >
                              Date: 12th july,2024 - 12th Aug,2024
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleVerification(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        //   onClick={(e) => handleReject(data.id)}
                        style={{ backgroundColor: "rgb(107, 169, 169)", borderRadius:"20px", }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
      <Footer />
    </div>
  );
};
