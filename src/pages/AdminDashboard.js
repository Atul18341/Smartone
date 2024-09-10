import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import NavbarNew from "../components/NavbarNew";
import { ClimbingBoxLoader } from "react-spinners";
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
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { enqueueSnackbar } from "notistack";
import { IoMdPerson } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { MdDialerSip } from "react-icons/md";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState([]);
  const [load, setLoad] = useState(true);
  const [load1, setLoad1] = useState(false);

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "super-admin"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${Url}/college-requests/`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setLoad(false);
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleVerification = (e) => {
    setLoad1(true);

    const data = {
      is_verified: true,
    };
    axios
      .put(`${Url}/college-requests/${e}/verify/`, data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setLoad1(false);
        setResult((prev) =>
          prev.map((item) =>
            item.id === e ? { ...item, is_verified: true } : item
          )
        );

        console.log(response);
        enqueueSnackbar("Email Sent.", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => {
        setLoad1(false);
        console.log(err);
        if (err.message === "Request failed with status code 500") {
          enqueueSnackbar("Already action is taken.", {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }
        if (
          err?.response?.data?.errors?.non_field_errors?.[0] ===
          "The 'is_verified' field cannot be changed once it is set to True."
        ) {
          enqueueSnackbar("Already action is taken.", {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }
        if (
          err?.response?.data?.errors?.detail ===
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
        }
      });
  };
  const handleReject = (e) => {
    const data = {
      is_verified: false,
    };
    axios
      .put(`${Url}/college-requests/${e}/verify/`, data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        enqueueSnackbar("Email Sent.", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "Request failed with status code 500") {
          enqueueSnackbar("Already action is taken.", {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }
        if (
          err?.response?.data?.errors?.detail ===
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
        }
      });
  };

  if (load) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <ClimbingBoxLoader />
      </Box>
    );
  }

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
              Dashboard
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
              Welcome to the Admin Dashboard! Manage your operations
              efficiently, monitor key metrics, and make informed decisions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>

      <p
        style={{
          fontSize: "2.0rem",
          fontWeight: "500",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Requests
      </p>
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
      <Box sx={{ padding: "7px", marginBottom: "20px" }}>
        {result?.length === 0 && (
          <center>
            <p
              style={{
                padding: "9vw 0 9vw 0",
                fontSize: "1.4rem",
                marginTop: "50px",
              }}
            >
              No data available currently.
            </p>
          </center>
        )}
        <Grid container spacing={2} sx={{ width: "100vw", marginTop: "50px" }}>
          {result?.length > 0 &&
            result?.map((data, index) => (
              <Grid
                item
                lg={6}
                sm={12}
                xs={12}
                md={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card sx={{ minWidth: { lg: 545, md: 545, xs: 300, sm: 445 } }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="240"
                      image={data?.college_logo}
                      alt="green iguana"
                    />
                    <CardContent style={{ padding: "15px" }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                        marginBottom="2%"
                      >
                        {data?.college_name}
                      </Typography>
                      <Typography
                        textAlign="center"
                        variant="body2"
                        color="text.secondary"
                      >
                        College Address: {data?.college_address}
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="text.secondary"
                        marginBottom="0%"
                      >
                        Principal Name: {data?.principal_name}
                      </Typography>
                      <Grid container sx={{ padding: "20px" }}>
                        <Grid item xs={12} lg={6} md={6} sm={6}>
                          <Box sx={{ display: "flex", gap: "5px" }}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                            >
                              <IoMdPerson style={{ fontSize: "1.2rem" }} />
                            </Typography>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                            >
                              {data?.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: "5px" }}>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                            >
                              <MdEmail style={{ fontSize: "1.2rem" }} />
                            </Typography>
                            <Typography
                              textAlign="center"
                              variant="body2"
                              color="text.secondary"
                            >
                              {data?.email}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} lg={6} md={6} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            <SlCalender />
                            {"  "}
                            {data?.established_date}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            marginTop="5px"
                          >
                            <MdDialerSip />: <span>{data?.phone_number}</span>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            marginTop="5px"
                          >
                            Status:{" "}
                            <span>
                              {data?.is_verified ? (
                                <span>Accepted</span>
                              ) : (
                                <span>Pending</span>
                              )}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  {!data?.is_verified ? (
                    <CardActions
                      style={{ padding: "0px 15px 15px 15px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        onClick={(e) => handleVerification(data.id)}
                        style={{
                          backgroundColor: "rgb(107, 169, 169)",
                          borderRadius: "20px",
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => handleReject(data.id)}
                        style={{
                          backgroundColor: "rgb(107, 169, 169)",
                          borderRadius: "20px",
                        }}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  ) : null}
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};
