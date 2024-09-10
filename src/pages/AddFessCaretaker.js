import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  TableContainer,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { BaseUrl, Url } from "../components/BaseUrl";

// Validation schema using yup
const schema = yup.object().shape({
  Maintainance_fees: yup
    .number()
    .typeError("Maintenance Fees must be a number")
    .positive("Maintenance Fees must be positive")
    .required("Maintenance Fees is required"),
  Mess_fees: yup
    .number()
    .typeError("Mess Fees must be a number")
    .positive("Mess Fees must be positive")
    .required("Mess Fees is required"),
  Security_Deposit: yup
    .number()
    .typeError("Security Deposit must be a number")
    .positive("Security Deposit must be positive")
    .required("Security Deposit is required"),
});

const AddFeesCaretaker = () => {
  const regenerateToken = () => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(sessionStorage?.getItem("refreshtoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response1.exp < Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      } else {
        if (
          sessionStorage.getItem("refreshtoken") &&
          sessionStorage.getItem("accesstoken")
        ) {
          let data = {
            refresh: sessionStorage?.getItem("refreshtoken"),
          };

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${Url}/token/refresh/`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              sessionStorage.setItem("accesstoken", response.data.access);
            })
            .catch((error) => {
              if (error?.message === "Request failed with status code 500") {
                navigate("/login");
              }
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, // Reset function from react-hook-form
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [editId, setEditId] = useState(null); // State to hold the id of the fee being edited
  const navigate = useNavigate();

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
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("accesstoken");
      const token1 = sessionStorage.getItem("refreshtoken");

      if (token && token1) {
        let currentDate = new Date();
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 - currentDate.getTime() < 59 * 60 * 1000) {
          try {
            regenerateToken(); // Wait for the token regeneration to complete
          } catch (error) {
            console.error(
              "Error in request interceptor while regenerating token:",
              error
            );
          }
        }
      } else {
        navigate("/login");
      }
      try {
        const config = {
          method: "get",
          url: `${BaseUrl}/${
            jwtDecode(sessionStorage.getItem("accesstoken")).college
          }/hostel-mess-fee/`,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
          },
        };

        const response = await axios.request(config);
        setResult(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData here to fetch data when component mounts
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    const jsonData = JSON.stringify(data);
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
    if (token && token1) {
      try {
        let config;
        if (editId) {
          config = {
            method: "put",
            url: `${BaseUrl}/${
              jwtDecode(sessionStorage.getItem("accesstoken")).college
            }/hostel-mess-fee/${editId}/`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
            data: jsonData,
          };
        } else {
          config = {
            method: "post",
            url: `${BaseUrl}/${
              jwtDecode(sessionStorage.getItem("accesstoken")).college
            }/hostel-mess-fee/`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
            data: jsonData,
          };
        }
        const token = sessionStorage.getItem("accesstoken");
        const token1 = sessionStorage.getItem("refreshtoken");

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
        }
        const response = await axios.request(config);
        console.log(response.data);
        setLoading(false);

        enqueueSnackbar("Data added successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });

        // Clear form and reset editId state after submission
        reset({
          Maintainance_fees: "",
          Mess_fees: "",
          Security_Deposit: "",
        });
        setEditId(null);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setLoading(false);

        console.error("Error adding/updating data:", error);
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
        }
      }
    } else {
      navigate("/login");
    }
  };

  const handleEdit = (feeId) => {
    // Find the fee with feeId in result state and populate the form fields

    console.log(feeId);
    reset({
      Maintainance_fees: result?.[0]?.Maintainance_fees,
      Mess_fees: result?.[0]?.Mess_fees,
      Security_Deposit: result?.[0]?.Security_Deposit,
    });
    setEditId(feeId);
  };

  return (
    <>
      <NavbarNew />
      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(../images/banner10.jpg)",
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
              Fees Structure
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
              Efficiently manage the addition of fee structures by prioritizing
              accuracy and completeness. Customize the process to ensure clear,
              organized, and up-to-date financial records for optimal hostel
              management.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <Container style={{ marginBottom: "11%", padding: "10px" }}>
        <p
          style={{
            marginTop: "20px",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "1.4rem",
          }}
        >
          Fees Structure
        </p>
        <center>
        
        <Divider
          sx={{
            backgroundColor: "blue",
            width: { lg: "12%", xs: "30%", md: "10%" },
            fontWeight: "800",
            textAlign: "center",
            marginTop: "5px",
          }}
        />
      </center>
        <Grid container spacing={12}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={7}
            sx={{
              marginTop: { lg: "70px", md: "70px", xs: "0px", sm: "0px" },
            }}
          >
            <Box
              sx={{
                display: { sm: "block", xs: "block", md: "none", lg: "none" },
                textAlign: "center",
              }}
            >
              <img
                src={`./images/addCarefee.png`}
                alt=""
                style={{ width: "250px" }}
              />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="Maintainance_fees"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Maintenance Fees"
                    placeholder="Maintenance Fees..."
                    variant="standard"
                    fullWidth
                    error={!!errors.Maintainance_fees}
                    helperText={errors.Maintainance_fees?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="Mess_fees"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mess Fees"
                    placeholder="Mess Fees..."
                    variant="standard"
                    fullWidth
                    error={!!errors.Mess_fees}
                    helperText={errors.Mess_fees?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="Security_Deposit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Security Deposit"
                    placeholder="Security_Deposit..."
                    variant="standard"
                    fullWidth
                    error={!!errors.Security_Deposit}
                    helperText={errors.Security_Deposit?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <center>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: { xs: "85%", sm: "50%", lg: "50%", md: "50%" },
                    marginTop: "30px",
                    borderRadius:"20px",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" }
                  }}
                >
                  {!loading && <p>{editId ? "Update" : "Submit"}</p>}
                  {loading && (
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
            </form>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "-webkit-center",
            }}
          >
            <Box
              sx={{
                display: { sm: "none", xs: "none", md: "block", lg: "block" },
                textAlign: "center",
              }}
            >
              <img
                src={`./images/addCarefee.png`}
                alt=""
                style={{ width: "300px" }}
              />
            </Box>

            <Box style={{ marginTop: "20px" }}>
              <p
                style={{
                  marginTop: "20px",
                  marginBottom: "36px",
                  textAlign: "center",
                  fontSize: "1.4rem",
                }}
              >
                Previous Fees Records
              </p>
            </Box>

            {result.length === 0 ? (
              <Typography variant="body1" align="center">
              Data Not Found.
              </Typography>
            ) : (
              <Box>
                <TableContainer component={Paper} sx={{ marginTop: 3,border: "none",
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderRight: 0,
                  borderBottom: 0, }}>
                  <Table sx={{ minWidth: 300,borderRight: 0,
                    "&:last-child td, &:last-child th": { border: 0 },
                    border: 0,
                    borderBottom: 0, }} aria-label="Fees table">
                    <TableHead style={{ backgroundColor: "#545959" }}>
                      <TableRow>
                        <TableCell sx={{
                              color: "white",
                            }}>Maintenance</TableCell>
                        <TableCell sx={{
                              color: "white",
                            }}>Mess </TableCell>
                        <TableCell sx={{
                              color: "white",
                            }}>Security</TableCell>
                        <TableCell sx={{
                              color: "white",
                            }}>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={result.id}>
                        <TableCell>{result?.[0]?.Maintainance_fees}</TableCell>
                        <TableCell>{result?.[0]?.Mess_fees}</TableCell>
                        <TableCell>{result?.[0]?.Security_Deposit}</TableCell>
                        <TableCell>
                          <Button
                            variant="standard"
                            color="primary"
                            onClick={() => handleEdit(result?.[0]?.id)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default AddFeesCaretaker;
