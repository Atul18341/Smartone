import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Divider,
} from "@mui/material";
import Footer from "../components/Home/Footer";
import NavbarNew from "../components/NavbarNew";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Url } from "../components/BaseUrl";

const schema = yup.object().shape({
  subject_name: yup.string().required("Subject name is required"),
  subject_code: yup.string().required("Subject code is required"),
  name: yup.string().required("Name is required"),
});

export const SemSubject = () => {
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");

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
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "super-admin" && response.role !== "hod")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      var subject_code = data.subject_code.toLowerCase();
      let data1 = JSON.stringify({
        subject_name: data.subject_name,
        subject_code: subject_code,
        instructor: data.name,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${Url}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/subject/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
        data: data1,
      };

      const token = sessionStorage.getItem("accesstoken");
      const token1 = sessionStorage.getItem("refreshtoken");

      if (token && token1) {
        axios
          .request(config)
          .then((response) => {
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
            enqueueSnackbar("Subject Added successfully", {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 1000,
            });

            reset();
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
            if(error?.response?.data?.errors?.non_field_errors?.[0]){
              enqueueSnackbar(error?.response?.data?.errors?.non_field_errors?.[0], {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                autoHideDuration: 1000,
              });
            }
            if(error?.response?.data?.errors?.subject_code?.[0]){
            enqueueSnackbar(error?.response?.data?.errors?.subject_code?.[0], {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 1000,
            });
          }
          });
      } else {
        navigate("/login");
      }
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
              Hod Dashboard
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
              Efficiently manage departmental tasks by prioritizing faculty
              submissions and approvals. Customize workflows to ensure timely
              decision-making and accurate record-keeping across the department.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <h4
        style={{ textAlign: "center", marginTop: "30px", fontSize: "1.4rem" }}
      >
        Subject Register
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
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <FormControl fullWidth error={!!errors.subject_name}>
                <TextField
                  type="text"
                  label="Subject Name*"
                  variant="standard"
                  fullWidth
                  {...register("subject_name")}
                />
                <FormHelperText>{errors?.subject_name?.message}</FormHelperText>
              </FormControl>
              <FormControl fullWidth error={!!errors.subject_code}>
                <TextField
                  type="text"
                  label="Subject Code*"
                  variant="standard"
                  fullWidth
                  {...register("subject_code")}
                />
                <FormHelperText>{errors?.subject_code?.message}</FormHelperText>
              </FormControl>
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  type="text"
                  label="Name*"
                  variant="standard"
                  fullWidth
                  {...register("name")}
                />
                <FormHelperText>{errors?.name?.message}</FormHelperText>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    paddingX: 1.5,
                    paddingY: 1.0,
                    marginTop: 2,
                    borderRadius: "20px",
                  }}
                  type="submit"
                >
                  Add Subject
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default SemSubject;
