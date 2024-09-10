import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  
  Box,
  Divider,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { Url } from "../components/BaseUrl";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { FaUpload } from "react-icons/fa";


const status = ["available", "not-available"];

const validationSchema = Yup.object().shape({
  room_no: Yup.number()
    .typeError("Room number must be a number")
    .required("Room number is required"),
  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1")
    .max(3, "Capacity can't be more than 3"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(status, "valid room type:[available,not-available]"),
});

const RoomRegistration = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleFileChange = (e) => {
    console.log("clicked");
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
      console.log(file.name);
    }
  };
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accesstoken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    if (
      decodedToken.exp < Math.floor(Date.now() / 1000) ||
      (decodedToken.role !== "caretaker" && decodedToken.role !== "super-admin")
    ) {
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

  const handleSubmitFile = async (e) => {
    setLoading1(true);

    if (!file) {
      setLoading1(false);
      return enqueueSnackbar("Please Select a File.", {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
    }

    if (!file.name.endsWith("csv")) {
      return enqueueSnackbar("Only csv file will be accepted", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${Url}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/hostel-room-registrations/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
          },
          maxBodyLength: Infinity,
        }
      );

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
      if (response) {
        if (response?.data?.message) {
          enqueueSnackbar(response.data.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }
        setFileName("");
        setFile(null);
        setLoading1(false);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      }
    } catch (error) {
      console.error(error);
      setFileName("");
      setFile(null);
      setLoading1(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      if (error?.response?.data?.errors?.non_field_errors?.[0]) {
        enqueueSnackbar(error?.response?.data?.errors?.non_field_errors?.[0], {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
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
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    setLoading2(true);

    let room_type=["single","double","triple"];


    
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      let data1 = JSON.stringify({
        room_no: data.room_no,
        capacity: data.capacity,
        room_type: room_type[data.capacity-1],
        status: data.status,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${Url}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/hostel-room-registrations/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
        data: data1,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          setLoading2(false);
          
         
          enqueueSnackbar("Registration successful", { variant: "success" });
          reset({
            room_no: "",
            capacity: "",
            room_type: "",
            status: "",
          });
          setValue("room_no","");
          setValue("room_type","");
          setValue("capacity","");
          setValue("status","");


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
        })
        .catch((error) => {
          console.log(error);
          setLoading2(false);
          
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
  };

  return (
    <Box>
      <NavbarNew />

      <Box
      sx={{
        width: "100vw",
        textAlign: "center",
        backgroundImage:
          "url(../images/banner9.jpg)",
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
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.6rem", lg: "2.6rem" },
              marginTop: { xs: "20px", md: "50px" },
              fontWeight: "bold",
            }}
          >
            Room Registration
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.2rem" },
              marginTop: "10px",
              fontWeight: "500",
              padding: { xs: "10px", sm: "10px", md: "0px" },
            }}
          >
            Efficiently manage hostel room registrations by prioritizing student assignments and verifying room availability. Customize the process to ensure accurate room allocation and optimized hostel management.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
      </Grid>
    </Box>
      <Box sx={{ minHeight: "80vh", padding: "25px" }}>
        <Grid
          container
          spacing={2}
          sx={{
            marginTop: 2,
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardMedia
              component="img"
              image="../images/hostelRoom.jpg"
              alt="Room"
              sx={{
                width: {lg:"65%",md:"65%",xs:"90%",sm:"60%"},
                height: "auto",
                borderRadius: 8,
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            container
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom textAlign="center">
              Room Registration
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <center>
                
                <Controller
                  name="room_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Room Number"
                      
                      variant="standard"
                      margin="normal"
                      fullWidth
                      sx={{
                        width: { lg: "80%", md: "80%", xs: "100%", sm: "90%" },
                      }}
                      error={!!errors.room_no}
                      helperText={errors.room_no?.message}
                    />
                  )}
                />
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Capacity"
                      
                      margin="normal"
                      variant="standard"
                      fullWidth
                      sx={{
                        width: { lg: "80%", md: "80%", xs: "100%", sm: "90%" },
                      }}
                      error={!!errors.capacity}
                      helperText={errors.capacity?.message}
                    />
                  )}
                />
                {/* <Controller
                  name="room_type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                   
                      label="Room Type"
                      
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      sx={{
                        width: { lg: "80%", md: "80%", xs: "100%", sm: "90%" },
                      }}
                      error={!!errors.room_type}
                      helperText={errors.room_type?.message}
                    >
                      {roomTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                /> */}
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Status"

                      margin="normal"
                      variant="standard"
                      fullWidth
                      
                      sx={{
                        width: { lg: "80%", md: "80%", xs: "100%", sm: "90%" },
                      }}
                      error={!!errors.status}
                      helperText={errors.status?.message}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginTop: 2,
                    width: { xs: "85%", sm: "50%" },
                    backgroundColor: "rgb(107 169 169)",
                    borderRadius:"20px",
                  }}
                >
                 {!loading2 && <p>Register Room</p>}
                  {loading2 && (
                    <CircularProgress
                      style={{ color: "white", width: "20px", height: "22px" }}
                    />
                  )}
                </Button>
              </center>
            </form>
            <Divider
              component="span"
              role="presentation"
              className="Divider"
              sx={{ marginTop: "10px" }}
            >
              <Typography>or</Typography>
            </Divider>

            <Box
              style={{
                width: "100%",
                textAlign: "-webkit-center",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "80%",
                  border: "1px dotted grey",
                  padding: "11px",
                  backgroundColor: "whitesmoke",
                  borderRadius: "10px",
                }}
              >
                <p
                  className="text-bold text-xl"
                  style={{ color: "rgb(107 169 169)" }}
                >
                  Upload a csv file
                </p>
                <Box className="mt-3 text-xl">
                  <FaUpload style={{ color: "rgb(107 169 169)" }} />
                </Box>
                <Button
                  component="label"
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(107 169 169)",
                    marginTop: "10px",
                    borderRadius:"20px",
                  }}
                >
                  <TextField
                    type="file"
                    accept="*"
                    alt=""
                    style={{ display: "none" }}
                    inputRef={fileInputRef}
                    onChange={handleFileChange}
                  />
                  Upload
                </Button>
                {fileName && (
                  <p style={{ marginTop: "5px", marginBottom: "3px" }}>
                    {fileName}
                  </p>
                )}
              </div>
            </Box>
            <Box>
              <center>
                {" "}
                <Button
                  variant="contained"
                  sx={{
                    width: { xs: "85%", sm: "50%" },
                    backgroundColor: "rgb(107 169 169)",
                    textAlign: "start",
                    marginTop: "20px",
                    borderRadius:"20px",
                  }}
                  type="submit"
                  onClick={handleSubmitFile}
                >
                  {!loading1 && <p> Register Room</p>}
                  {loading1 && (
                    <CircularProgress
                      style={{ color: "white", width: "20px", height: "22px" }}
                    />
                  )}
                </Button>
              </center>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default RoomRegistration;
