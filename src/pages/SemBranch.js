import React, { useEffect, useState } from "react";
import {
  Box,
  
  Typography,
  Button,
  
  FormControl,
  FormHelperText,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
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
import {  Url } from "../components/BaseUrl";

const schema = yup.object().shape({
  branch: yup.string().required("Branch is required"),
});

export const SemBranch = () => {
  const navigate = useNavigate();
  
  const [load, setLoad] = useState(false);

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
            url:
              "https://amarnath013.pythonanywhere.com/api/user/token/refresh/",
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const branches = [
    { name: "Computer Science and Engineering", abbreviation: "CSE" },
    { name: "Mechanical Engineering", abbreviation: "ME" },
    { name: "Electrical Engineering", abbreviation: "EE" },
    { name: "Civil Engineering", abbreviation: "CE" },
    { name: "Electronics and Communication Engineering", abbreviation: "ECE" },
    { name: "Chemical Engineering", abbreviation: "CHE" },
    { name: "Information Technology", abbreviation: "IT" },
    { name: "Biomedical Engineering", abbreviation: "BME" },
    { name: "Aeronautical Engineering", abbreviation: "AE" },
    { name: "Automobile Engineering", abbreviation: "AU" },
    { name: "Biotechnology Engineering", abbreviation: "BT" },
    { name: "Industrial Engineering", abbreviation: "IE" },
    { name: "Environmental Engineering", abbreviation: "EN" },
    { name: "Petroleum Engineering", abbreviation: "PE" },
    { name: "Instrumentation Engineering", abbreviation: "IE" },
    { name: "Agricultural Engineering", abbreviation: "AG" },
    { name: "Mining Engineering", abbreviation: "MN" },
    { name: "Marine Engineering", abbreviation: "MRE" },
    { name: "Textile Engineering", abbreviation: "TE" },
    { name: "Food Technology", abbreviation: "FT" },
    { name: "Production Engineering", abbreviation: "PR" },
    { name: "Metallurgical Engineering", abbreviation: "MT" },
    { name: "Polymer Engineering", abbreviation: "PM" },
    { name: "Naval Architecture", abbreviation: "NA" },
    { name: "Power Engineering", abbreviation: "PW" },
    { name: "Robotics Engineering", abbreviation: "RE" },
    { name: "Software Engineering", abbreviation: "SE" },
    { name: "Geological Engineering", abbreviation: "GE" },
    { name: "Structural Engineering", abbreviation: "ST" },
    { name: "Mechatronics Engineering", abbreviation: "MTX" },
    { name: "Aerospace Engineering", abbreviation: "ASP" },
    { name: "Marine Technology", abbreviation: "MRT" },
    { name: "Nano Engineering", abbreviation: "NE" },
    { name: "Materials Science and Engineering", abbreviation: "MSE" },
    { name: "Telecommunication Engineering", abbreviation: "TCE" },
    { name: "Nuclear Engineering", abbreviation: "NE" },
    { name: "Optical Engineering", abbreviation: "OE" },
    { name: "Automotive Engineering", abbreviation: "AUE" },
    { name: "Systems Engineering", abbreviation: "SYE" },
    { name: "Renewable Energy Engineering", abbreviation: "REE" },
    { name: "Biochemical Engineering", abbreviation: "BCE" },
    { name: "Mining and Mineral Engineering", abbreviation: "MME" },
    { name: "Safety Engineering", abbreviation: "SE" },
    { name: "Corrosion Engineering", abbreviation: "CE" },
    { name: "Plastics Engineering", abbreviation: "PLE" },
    { name: "Petrochemical Engineering", abbreviation: "PCE" },
    { name: "Energy Engineering", abbreviation: "EE" },
    { name: "Computer Science and Business Systems", abbreviation: "CSBS" },
  ];

  const onSubmit = (data) => {
    setLoad(true);
    console.log(data);

    let data1 = JSON.stringify({
      branch_name: data.branch,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Url}/${
        jwtDecode(sessionStorage.getItem("accesstoken")).college
      }/branch/`,
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
          console.log(response.data);
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
          if (response?.data?.message) {
            enqueueSnackbar(response.data.message, {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 1000,
            });
          }
          setLoad(false);
          reset();
        }).catch((error) => {
          console.log(error);
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
          }
          if (error?.response?.data?.errors?.non_field_errors[0]) {
            enqueueSnackbar(
              error?.response?.data?.errors?.non_field_errors[0],
              {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                autoHideDuration: 1000,
              }
            );
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
                marginTop: { xs: "20px", md: "80px" },
                fontWeight: "bold",
              }}
            >
              Branch Enrollment
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
             Streamline your system by adding and organizing branches. Customize each branch to align with your specific needs, ensuring efficient management and optimal performance.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 400,
          margin: "auto",
          marginTop: 5,
          marginBottom: 18,
          height: "50vh",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: 2 }}
        >
          Branch Enrollment
        </Typography>

        <center>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "27%", xs: "30%", md: "10%" },
                fontWeight: "800",
                textAlign: "center",
                marginTop: "5px",
              }}
            />
          </center>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginTop:10
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth error={!!errors.branch}>
              <InputLabel>Branch</InputLabel>
              <Select
                label="Branch*"
                variant="outlined"
                fullWidth
                {...register("branch")}
                defaultValue=""
              >
                {branches.map((branch) => (
                  <MenuItem
                    key={branch.abbreviation}
                    value={branch.abbreviation}
                  >
                    {branch.name} ({branch.abbreviation})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors?.branch?.message}</FormHelperText>
            </FormControl>
            <center>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  alignSelf: "center",
                  paddingX: 4,
                  paddingY: 1,
                  marginTop: 3,
                  borderRadius:"20px",
                }}
                type="submit"
              >
                {!load && <p>Add Branch</p>}
                {load && (
                  <CircularProgress
                    style={{ color: "white", width: "20px", height: "22px" }}
                  />
                )}
              </Button>
            </center>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SemBranch;
