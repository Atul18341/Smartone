import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import axios from "axios";
import { CgProfile } from "react-icons/cg";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";
import { Url } from "../components/BaseUrl";
import { jwtDecode } from "jwt-decode";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; Secure; SameSite=Strict`;
  }

  // Function to get a cookie by name
  function getCookie(name) {
    return document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
  }

  // Function to delete a cookie by name
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict`;
  }

  const onSubmit = (data) => {
    setLoading(true);

    let data1 = JSON.stringify({
      registration_number: data.rollNumber,
      password: data.password,
    });

    axios({
      url: `${Url}/login/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data1,
    })
      .then((res) => {
        enqueueSnackbar(res.data.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        const response = jwtDecode(res.data.token.access);
        console.log(response);

        if (response.role === "super-admin") {
          navigate("/admin-dashboard");
        } else if (response.role === "caretaker") {
          navigate("/caretaker-dashboard");
        } else if (response.role === "registrar") {
          navigate("/registrar-dashboard");
        } else if (response.role === "office") {
          navigate(`/register/${jwtDecode(res.data.token.access).college}`);
        } else if (response.role === "hod") {
          navigate(`/sem-sub-register`);
        } else if (response.role === "department") {
          navigate(`/No-dues-for-degree-approval`);
        } else {
          navigate("/dashboard");
        }

        setLoading(false);
        if (sessionStorage?.getItem("remember") === "true") {
          setCookie("rollnumber", data.rollNumber, 1);
          sessionStorage.setItem("RollNumber", data.rollNumber);
        } else {
          deleteCookie("rollnumber");
          sessionStorage?.removeItem("RollNumber");
        }
        // axios.defaults.headers.common['Authorization']=res.data.token.access;
        sessionStorage.setItem("accesstoken", res.data.token.access);
        sessionStorage.setItem("refreshtoken", res.data.token.refresh);
        reset();
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.error?.non_fields_errors?.[0]) {
          enqueueSnackbar(err?.response?.data?.error?.non_fields_errors?.[0], {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }
        if (err?.response?.data?.errors?.registration_number?.[0]) {
          enqueueSnackbar(
            err?.response?.data?.errors?.registration_number?.[0],
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
        setLoading(false);
      });
  };

  const checking = (e) => {
    setRemember(e.nativeEvent.srcElement.checked);
    sessionStorage?.setItem("remember", e.nativeEvent.srcElement.checked);
  };
  var rememberMe = false;
  if (sessionStorage?.getItem("remember") === "true") {
    rememberMe = true;
  } else {
    rememberMe = false;
  }
  return (
    <Box
      sx={{
        backgroundColor: {lg:"whitesmoke",md:"whitesmoke",xs:"white",sm:"white"},
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        className="loginBody"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          px:2,
          marginTop:{lg:2,md:2,xs:6,sm:4},
          py: {lg:4,md:4,xs:0,sm:0}
        }}
      >
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            md={12}
            lg={4}
            sx={{ display: { xs: "none", md: "none",lg:"flex" }, 
            justifyContent: "flex-end",  }}
          >
            <video
              autoPlay
              muted
              loop
              style={{
                width: "70%",
                height: "88vh",
             
                objectFit: "cover",
              }}
            >
              <source src="./images/login.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sx={{
            
              display: "flex",
              justifyContent: {lg:"flex-start",md:"center",xs:"center",sm:"center"}
            }}
          >
            <Box
              sx={{
                boxShadow: {lg:2,md:3,xs:0,sm:0},
                borderRadius: "16px",
                p: {xs:1,lg:4,md:4,sm:9},
                width: "100%",
                maxWidth: { xs: "100%", sm: "80%", md: "80%", lg: "65%" },
                bgcolor: {lg:"background.paper",md:"background.paper",xs:"transparent",sm:"transparent"},
                marginBottom:{xs:"50px",sm:"40px",lg:"0px",md:"0px"}
              }}
            >
              <center>
                <img
                  src="../images/login.png"
                  alt="Login"
                  style={{ width: "150px", height: "auto" }}
                />
              </center>

              <p
                className="text-center text-3xl text-gray-900"
                style={{ margin: "6px 0 6px 0" }}
              >
                Welcome Back !!
              </p>
              <p
                className="text-center text-md text-gray-900"
                style={{ margin: "0 0 20px 0" }}
              >
                Sign in to your account
              </p>

              <form className="space-y-3"
             onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <TextField
                    id="roll-number"
                    type="text"
                    label="Registration no./Employee ID."
                    fullWidth
                    defaultValue={getCookie("rollnumber")}
                    {...register("rollNumber", { required: true })}
                    autoComplete="off"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.rollNumber ? "border-red-500" : "border-gray-300"
                    } placeholder-blue-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Registration no./Employee ID."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CgProfile />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.rollNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      Registration No./Employee ID is required
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    id="password"
                    type={hide ? "text" : "password"}
                    label="Password"
                    {...register("password", { required: true })}
                    fullWidth
                    autoComplete="current-password"
                    sx={{ marginTop: "14px" }}
                    placeholder="Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiLockPasswordFill />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {hide ? (
                            <FaEyeSlash
                              className="cursor-pointer"
                              onClick={() => setHide(!hide)}
                            />
                          ) : (
                            <FaEye
                              className="cursor-pointer"
                              onClick={() => setHide(!hide)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      Password is required
                    </p>
                  )}
                </div>
                <div >
                <Checkbox
                  {...label}
                  defaultChecked={rememberMe}
                  onClick={checking}
                />
                Remember me?
                </div>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    color: "#fff",
                    backgroundColor: "rgb(107, 169, 169)",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                    borderRadius: "20px",
                    
                  }}
                  type="submit"
                >
                  {!loading && <p>Login</p>}
                  {loading && (
                    <CircularProgress
                      style={{ color: "white", width: "20px", height: "22px" }}
                    />
                  )}
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};
