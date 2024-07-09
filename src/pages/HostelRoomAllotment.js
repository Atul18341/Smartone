import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { TbHomeFilled } from "react-icons/tb";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  CardMedia,
  Box,
  InputAdornment,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { BaseUrl } from "../components/BaseUrl";

const HostelRoomAllotment = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [allotmentData, setAllotmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data1, setData1] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [hostel_room, setHostel_room] = useState("");

  const navigate = useNavigate();

  const regenerateToken = () => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(localStorage?.getItem("refreshtoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || response1.exp < Math.floor(Date.now() / 1000)) {
        navigate("/login");
      }else{
        if (localStorage.getItem("refreshtoken") && localStorage.getItem("accesstoken")) {
          let data = {
            refresh: localStorage?.getItem("refreshtoken"),
          };
    
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://amarnath013.pythonanywhere.com/api/user/token/refresh/",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage?.getItem("accesstoken")}`,
            },
            data: data,
          };
    
          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              localStorage.setItem("accesstoken", response.data.access);
            })
            .catch((error) => {
              if(error?.message==='Request failed with status code 500'){
                navigate('/login');
              }
              if(error?.response?.data?.errors?.detail==="Given token not valid for any token type"){
                enqueueSnackbar("Logging out", {
                  variant: "error",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                  autoHideDuration: 3000,
                });  
                navigate("/login");
              }
              console.log(error);
            });
        } else {
          navigate("/login");
        }
      }
    } else {
      navigate("/login");
    }
   
  };


  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/hostel-allotments/?search=applied`,
      headers: {
        Authorization: `Bearer ${localStorage?.getItem("accesstoken")}`,
      },
    };

    const token = localStorage.getItem("accesstoken");
        const token1 = localStorage.getItem("refreshtoken");
     if(token && token1){   
    axios
      .request(config)
      .then((response) => {
        setData1(response.data);
        const token = localStorage.getItem("accesstoken");
        const token1 = localStorage.getItem("refreshtoken");
       
        if (token && token1) {
          let currentDate = new Date();
          const decodedToken = jwtDecode(token);

          if (
            decodedToken.exp * 1000 - currentDate.getTime() <
            59 * 60 * 1000
          ) {
            try {
              regenerateToken(); // Wait for the token regeneration to complete
            } catch (error) {
              console.error(
                "Error in request interceptor while regenerating token:",
                error
              );
            }
          }
        }else{
          navigate('/login');
        }      
        setLoading1(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setLoading1(false);
      });
    }else{
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      const response = jwtDecode(token);
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "caretaker" && response.role !== "admin")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = async (data) => {

    if(hostel_room.length===0){
      return  enqueueSnackbar("Hostel Room field is required", { variant: "error" });
    }
    const jsonData = {
      registration_number: data,
      hostel_room: hostel_room,
    };
    
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/hostel-room-allotments/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
      data: jsonData,
    };

    const token = localStorage.getItem("accesstoken");
        const token1 = localStorage.getItem("refreshtoken");
    if(token && token1){    
    try {
      const response = await axios.request(config);
      console.log(response.data);

      const token = localStorage.getItem("accesstoken");
      const token1 = localStorage.getItem("refreshtoken");
     
      if (token && token1) {
        let currentDate = new Date();
        const decodedToken = jwtDecode(token);

        if (
          decodedToken.exp * 1000 - currentDate.getTime() <
          59 * 60 * 1000
        ) {
          try {
            regenerateToken(); // Wait for the token regeneration to complete
          } catch (error) {
            console.error(
              "Error in request interceptor while regenerating token:",
              error
            );
          }
        }
      }else{
        navigate('/login');
      }      

      const data2 = JSON.stringify({ status: "approved" });
      const configUpdate = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/hostel-allotments/${response?.data?.registration_details?.id}/update-status/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
        data: data2,
      };
      setHostel_room('');
      await axios.request(configUpdate);
      setData1(data1.filter((item) => item.id !== response?.data?.registration_details?.id));
      enqueueSnackbar("Room allotted successfully", { variant: "success" });
      fetchAllotmentData();
    } catch (error) {
      console.error(error);
      if(error?.response?.data?.errors?.detail==="Given token not valid for any token type"){
        enqueueSnackbar("Logging out", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });  
        navigate("/login");
      }
      if (error?.response?.data?.errors?.hostel_room?.[0]) {
        enqueueSnackbar(error?.response?.data?.errors?.hostel_room?.[0], {
          variant: "error",
        });
      }
      if (error?.response?.data?.errors?.[0])
        enqueueSnackbar(error?.response?.data?.errors?.[0], {
          variant: "error",
        });
    }
  }else{
    navigate('/login');
  }
  };

  const fetchAllotmentData = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/hostel-room-allotments/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    try {
      const response = await axios.request(config);
      setAllotmentData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllotmentData();
  }, []);

  if (loading || loading1) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="logout-container">
      <div className="circle circle1"></div>
      <div className="rectangle circle2"></div>
      <div className="circle circle3"></div>
      <div className="rectangle circle4"></div>
      <div className="rectangle circle5"></div>
      <div className="circle circle6"></div>
      <Box
        className="z-10"
        style={{ height: "calc(100vh - 2px)", overflowY: "scroll" }}
      >
        <Box>
          <NavbarNew />
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
              lg={12}
              sx={{
                // display: { xs: "block", sm: "block", md: "block", lg: "none" },

                width: "100vw",
                padding: "12",
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.6rem",
                  marginTop: "10px",
                  marginBottom: "50px",
                }}
              >
                Hostel Room Allotments
              </p>
              <center>
                <img
                  src="./images/hostel_caretaker.png"
                  alt=""
                  style={{ width: "300px" }}
                />
              </center>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.6rem",
                  marginTop: "10px",
                  marginBottom: "50px",
                }}
              >
                  Hostel Room Requests
              </p>
              {data1.length === 0 ? (
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ marginTop: {xs:"20%",sm:"4%",lg:"4%",md:"4%"} }}
                >
                  <center>
                    <img
                      src="./images/No_data.png"
                      alt=""
                      style={{
                        width: "310px",
                        borderRadius: "10px",
                        marginTop: "30px",
                      }}
                    />
                  </center>
                </Typography>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  minHeight="80vh"
                  sx={{
                    display: "",
                  }}
                >
                  <Grid container spacing={3}>
                    {data1.map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        md={6}
                        key={index}
                        justifyContent="center"
                        display="flex"
                      >
                        <Card
                         
                          sx={{
                            width: {
                              lg: "70%",
                              md: "70%",
                              xs: "88%",
                              sm: "80%",
                            },
                           backgroundColor:"rgb(244, 243, 243)",
                           border:"2px solid whitesmoke"
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{ height: 260,objectFit:"cover",}}
                            image={`data:image/jpeg;base64,${item.latest_marksheet}`}
                            alt="Marksheet"

                          />

                          <CardContent>
                           
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <p>
                                    Registration Number:{" "}
                                    {item?.registration_number}
                                  </p>
                                  
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    onChange={(e) =>
                                      setHostel_room(e.target.value)
                                    }
                                    label="Hostel Room"
                                    placeholder="Hostel Room"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <TbHomeFilled />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <center>
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      color="primary"
                                      fullWidth
                                      onClick={(e) => {
                                        onSubmit(item?.registration_number);
                                      }}
                                      sx={{
                                        width: {
                                          lg: "30%",
                                          md: "40%",
                                          xs: "100%",
                                          sm: "90%",
                                        },
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </center>
                                </Grid>
                              </Grid>
                          
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              sm={12}
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Divider style={{ marginTop: "20px" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                Approved Allotment Details
              </Typography>
              <Box
                sx={{ width: { lg: "50%", md: "50%", xs: "90%", sm: "90%" } }}
              >
                {allotmentData.length === 0 ? (
                  <center>
                    <img
                      src="./images/No_data.png"
                      alt=""
                      style={{
                        width: "310px",
                        borderRadius: "10px",
                        marginTop: "30px",
                      }}
                    />
                  </center>
                ) : (
                  allotmentData.map((data, index) => (
                    <Card
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      key={index}
                    >
                      <CardContent style={{padding:"20px"}}> 
                        <Typography variant="subtitle1">
                          ID: {data?.id}
                        </Typography>
                        <Typography variant="subtitle1">
                          Registration Number:{" "}
                          {data?.registration_details?.registration_number}
                        </Typography>
                        <Typography variant="subtitle1">
                          Hostel Room: {data?.hostel_room}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default HostelRoomAllotment;
