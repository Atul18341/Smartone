import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import NavbarNew from "../components/NavbarNew";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Grid,
} from "@mui/material";
import Footer from "../components/Home/Footer";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { BaseUrl, Url } from "../components/BaseUrl";

// Validation schema
const schema = yup.object().shape({
  semester: yup.string().required("Semester is required"),
  declaration: yup.bool().oneOf([true], "Declaration must be accepted"),
});

export const HostelNoDueReq = () => {
  const [result, setResult] = useState([]);
  const [responsive, setResponsive] = useState(window.innerWidth < 669);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);

  const [maintainanceToDate, setMaintainanceToDate] = useState(null);
  const [messToDate, setMessToDate] = useState(null);

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken") && sessionStorage?.getItem("refreshtoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "student" && response.role !== "super-admin")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

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

  useEffect(() => {
    if (
      sessionStorage.getItem("accesstoken") !== null ||
      sessionStorage.getItem("refreshtoken") !== null
    ) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/mess-fees-payment/`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
      };
      const token = sessionStorage.getItem("accesstoken");
      const token1 = sessionStorage.getItem("refreshtoken");

      if (token && token1) {
        axios
          .request(config)
          .then((response) => {
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
            } else {
              navigate("/login");
            }

            const payments = response.data.reverse();
            setLoading(false);
            const maintainancePayment = payments.find(
              (payment) => payment.fee_type === "maintainance_fee"
            );
            const messPayment = payments.find(
              (payment) => payment.fee_type === "mess_fee"
            );

            if (maintainancePayment) {
              setMaintainanceToDate(maintainancePayment.to_date);
            }
            if (messPayment) {
              setMessToDate(messPayment.to_date);
            }
          })
          .catch((error) => {
            console.log(error);
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
          });
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const resize = () => {
      setResponsive(window.innerWidth < 669);
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const onSubmit = (data) => {
    setLoading1(true);

    if (
      sessionStorage.getItem("accesstoken") !== null &&
      sessionStorage.getItem("refreshtoken") !== null
    ) {
      if (maintainanceToDate === null || messToDate === null) {
        return enqueueSnackbar("Have not paid Maintainance or Mess", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      }

      let data1 = JSON.stringify({
        semester: data.semester,
        maintenance_fees_date: maintainanceToDate,
        mess_fees_date: messToDate,
        self_declaration: true,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/hostel-no-dues/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
        },
        data: data1,
      };

      const token = sessionStorage.getItem("accesstoken");
      const token1 = sessionStorage.getItem("refreshtoken");

      if (token && token1) {
        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));

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
            } else {
              navigate("/login");
            }
            enqueueSnackbar("Request Sent Successfully", {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });

            setLoading1(false);

            setResult([
              ...result,
              {
                registration_number: jwtDecode(
                  sessionStorage.getItem("accesstoken")
                ).registration_number,
                status: "pending",
                requested_date: new Date().toLocaleDateString("en-CA"),
              },
            ]);
          })
          .catch((error) => {
            setLoading1(false);
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

            if (error?.response?.data?.errors?.non_field_errors?.[0]) {
              enqueueSnackbar(
                error?.response?.data?.errors?.non_field_errors?.[0],
                {
                  variant: "error",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                  autoHideDuration: 3000,
                }
              );
            }
            console.log(error);
          });
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/hostel-no-dues/`,
        headers: {
          Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setResult(response?.data);
          setLoading1(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
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
    <div className="container-fluid" style={{backgroundColor:"whitesmoke"}} >
      <NavbarNew />

      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(../images/banner5.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top-center",
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
                marginTop: { xs: "20px", md: "80px" },
                fontWeight: "bold",
              }}
            >
             Hostel No Due Request
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
             Efficiently handle hostel no-due requests by prioritizing student submissions and verification. Customize the process to ensure timely clearance and accurate record-keeping.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <Box
        className="bonafide-form"
        sx={{
          padding: 3,
          bgcolor: "whitesmoke",
          borderRadius: 2,
          maxWidth: 800,
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h5"
            style={{ marginBottom: "5px", textAlign: "center" }}
          >
            Hostel No Due Request
          </Typography>
          <center>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "20%", xs: "30%", md: "10%",sm:"15%" },
                fontWeight: "800",
                textAlign: "center",
                marginTop: "5px",
                marginBottom:"40px"
              }}
            />
          </center>
          <Typography variant="h6" gutterBottom>
            Registration/Employee No:
          </Typography>
          <Typography variant="p" gutterBottom>
            {sessionStorage?.getItem("accesstoken") === null
              ? null
              : jwtDecode(sessionStorage?.getItem("accesstoken"))
                  ?.registration_number}
          </Typography>
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!errors.semester?.message}
          >
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              id="semester"
              variant="standard"
              sx={{
                width:"50%"
              }}
              label="Semester"
              {...register("semester")}
              defaultValue=""
            >
              <MenuItem value="semester 1">semester 1</MenuItem>

              <MenuItem value="semester 2">semester 2</MenuItem>
              <MenuItem value="semester 3">semester 3</MenuItem>
              <MenuItem value="semester 4">semester 4</MenuItem>
              <MenuItem value="semester 5">semester 5</MenuItem>
              <MenuItem value="semester 6">semester 6</MenuItem>
              <MenuItem value="semester 7">semester 7</MenuItem>
              <MenuItem value="semester 8">semester 8</MenuItem>
            </Select>
            {errors.semester && (
              <FormHelperText>{errors.semester.message}</FormHelperText>
            )}
          </FormControl>

          <Typography
            variant="h6"
            gutterBottom
            style={{ marginBottom: "10px" }}
          >
            Maintenance Fee paid up to:
          </Typography>
          <Typography variant="p" gutterBottom style={{ marginBottom: "20px" }}>
            {maintainanceToDate ? maintainanceToDate : "Have not paid"}
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            style={{ marginBottom: "10px" }}
          >
            Mess Fee paid up to:
          </Typography>
          <Typography variant="p" gutterBottom style={{ marginBottom: "50px" }}>
            {messToDate ? messToDate : "Have not paid"}
          </Typography>

          <FormControl
            error={!!errors.declaration?.message}
            component="fieldset"
            margin="normal"
          >
            <Box display="flex" alignItems="center">
              <Checkbox {...register("declaration")} />
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                I declare that my payments are cleared up to the asked month and
                the payment record shown here is correct.
              </Typography>
            </Box>
            {errors.declaration && (
              <FormHelperText>{errors.declaration.message}</FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              marginTop: "5px",
              backgroundColor: "rgb(107, 169, 169)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
              borderRadius:"20px",
            }}
          >
            {!loading1 && <p>Send Request</p>}
            {loading1 && (
              <CircularProgress
                style={{
                  color: "white",
                  width: "20px",
                  height: "22px",
                }}
              />
            )}
          </Button>
        </form>
       
      
        <Typography variant="h6" gutterBottom sx={{marginTop:"40px"}}>
          Approved No Dues Request
        </Typography>
        <center style={{width:"100%"}}>
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
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {result.length === 0 && (
            <Typography
              style={{
                marginBottom: "50px",
                marginTop: "30px",
                fontSize: "1.2rem",
              }}
            >
              <center>
                <p style={{fontSize:"1.2rem",marginTop:"50px",marginBottom:"40px"}}>No Data Found.</p>
              </center>
            </Typography>
          )}

          {responsive ? (
            result.length > 0 &&
            result.map((data, index) => (
              <Box key={index}>
                <Card
                  sx={{
                    minWidth: 275,
                    marginBottom: 2,
                    backgroundColor: "#D2E9E9",
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      No Dues Details
                    </Typography>
                    <Typography variant="body2" component="div">
                      Registration Number: {data?.registration_number}
                    </Typography>
                    <Typography variant="body2">
                      Requested Date: {data?.requested_date}
                    </Typography>
                    <Typography variant="body2">
                      Status: {data?.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Box>
              {result.length > 0 ? (
                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="no due table">
                    <TableHead style={{ backgroundColor: "#D2E9E9" }}>
                      <TableRow>
                        <TableCell>Registration Number</TableCell>
                        <TableCell>Requested Date</TableCell>
                        <TableCell> Status </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{data?.registration_number}</TableCell>
                          <TableCell>{data?.requested_date}</TableCell>

                          <TableCell> {data?.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </Box>
          )}
        </Box>
      </Box>
     
      <Box style={{ width: "100vw" }}>
        <Footer />
      </Box>
    </div>
  );
};
