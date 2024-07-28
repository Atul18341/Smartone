import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../App.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FaUpload } from "react-icons/fa";
import { BaseUrl } from '../components/BaseUrl';

export const RegisterUser = () => {
  const [responsive, setResponsive] = useState(
    window.innerWidth < 900 ? true : false
  ); // Check if the screen is smaller than 1024
  const navigate = useNavigate();
  const [file, setFile] = useState("");

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const resize = () => {
    setResponsive(window.innerWidth < 900 ? true : false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    registration_number: yup
      .string()
      .required("registration number is required"),
    password: yup
      .string()
      .min(8, "password must be at least 8 characters")
      .max(15, "password cannot exceed 15 characters")
      .required("password is required"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),

    role: yup
      .string()
      .oneOf(
        ["student", "faculty", "admin","office","principal","caretaker","department"],
        "Invalid role, must be one of: student, faculty, admin,office,principal,caretaker","department"
      )
      .required("role is required"),
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitFile = async (e) => {
    console.log(file);

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
        `${BaseUrl}/register/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxBodyLength: Infinity,
        }
      );

      if (response) {
        enqueueSnackbar(response.data.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    let data1 = JSON.stringify({
      registration_number: data.registration_number,
      role: data.role,
      password: data.password,
      password2: data.password2,
    });

    axios({
      url: `${BaseUrl}/register/`,
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
        sessionStorage.setItem("accesstoken", res.data.token.access);
        sessionStorage.setItem("bonafied", false);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(err.response.data.errors.registration_number[0], {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      });

    reset();
  };
  return (
    <div className="App">
      {responsive && (
        <div className="parentdiv_small_screen">
          <img
            src="../images/logo.png"
            alt=""
            style={{ height: "auto", width: "70px" }}
          />
          <div className="children1_small_screen">
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={9}
                lg={9}
                className="parentGrid_small_screen"
              >
                <h2 style={{ marginRight: "35%",color:"rgb(107 169 169)" }}>Create Account</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box>
                    <TextField
                      type="text"
                      label="Registration number"
                      placeholder="Registration number"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "50%", xs: "80%" },
                        marginTop: "12px",
                      }}
                      {...register("registration_number")}
                      helperText={errors.registration_number?.message}
                    />
                  </Box>
                  <Box>
                    <TextField
                      type="password"
                      label="password"
                      placeholder="password"
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "50%", xs: "80%" },
                        marginTop: "12px",
                      }}
                      {...register("password")}
                      helperText={errors.password?.message}
                    />
                  </Box>
                  <Box>
                    <TextField
                      type="password"
                      label="confirm password"
                      placeholder="confirm password..."
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "50%", xs: "80%" },
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      {...register("password2")}
                      helperText={errors.password2?.message}
                    />
                  </Box>
                  <Box>
                    <TextField
                      type="text"
                      label="Role"
                      placeholder="Role..."
                      required
                      sx={{
                        width: { lg: "50%", md: "50%", sm: "50%", xs: "80%" },
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      {...register("role")}
                      helperText={errors.role?.message}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      width: { xs: "85%", sm: "50%" },
                      backgroundColor: "rgb(107 169 169)",
                      textAlign: "start",
                    }}
                    type="submit"
                  >
                    Create Account
                  </Button>
                </form>

                <p style={{ fontSize: "0.8rem", marginTop: "10px" }}>
                  Already have an account?{" "}
                  <span
                    style={{ color: "rgb(107 169 169)" }}
                    onClick={(e) => navigate("/login")}
                  >
                    Login
                  </span>
                </p>

                <Divider
                  component="span"
                  role="presentation"
                  className="Divider"
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
                    <p className="text-bold text-xl" style={{color:"rgb(107 169 169)"}}>Upload a csv file</p>
                    <Box className="mt-3 text-xl">
                      <FaUpload style={{color:"rgb(107 169 169)"}}/>
                    </Box>
                    <Button
                      component="label"
                      variant="contained"
                      style={{ backgroundColor: "rgb(107 169 169)", marginTop: "10px" }}
                    >
                      <input
                        type="file"
                        accept="*"
                        alt=""
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      Upload
                    </Button>
                  </div>
                </Box>
                <Box>
                <Button
                  variant="contained"
                  sx={{
                    width: { xs: "85%", sm: "50%" },
                    backgroundColor: "rgb(107 169 169)",
                    textAlign: "start",
                    marginTop: "20px",
                  }}
                  type="submit"
                  onClick={handleSubmitFile}
                >
                  Create Account
                </Button>
              </Box>
              </Grid>
            </Grid>
          </div>
        </div>
      )}

      {!responsive && (
        <Grid container style={{ height: "100vh", backgroundColor: "#6c42ec" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{ backgroundColor: "#6c42ec" }}
          >
            <div style={{ color: "white" }}>
              <h1 className="largeScreen_typography"> Stay on top of</h1>
              <h1 className="largeScreen_typography1">time tracking</h1>

              <img
                src="../images/register_page_icon.png"
                className="img"
                alt=""
              />
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={9}
            lg={9}
            className="parentGrid_largeScreen"
          >
            <h2 style={{ marginRight: "35%", marginTop: "20px",color:"rgb(107 169 169)" }}>
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <TextField
                  type="text"
                  label="Registration Number"
                  placeholder="0123442"
                  
                  sx={{
                    width: "50%",
                    marginTop: "12px",
                  }}
                  {...register("registration_number")}
                  helperText={errors?.registration_number?.message}
                />
              </Box>
              <Box>
                <TextField
                  type="password"
                  label="Password"
                  placeholder="password..."
                  
                  sx={{
                    width: "50%",
                    marginTop: "12px",
                  }}
                  {...register("password")}
                  helperText={errors?.password?.message}
                />
              </Box>
              <Box>
                <TextField
                  type="password"
                  label="Confirm Password"
                  placeholder="confirmPassword..."
                  
                  sx={{
                    width: "50%",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  {...register("password2")}
                  helperText={errors?.password2?.message}
                />
              </Box>
              <Box>
                <TextField
                  type="text"
                  label="Role"
                  placeholder="Role..."
                  sx={{
                    width: { lg: "50%", md: "50%", sm: "50%", xs: "80%" },
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  {...register("role")}
                  helperText={errors?.role?.message}
                />
              </Box>
              <Button
                variant="contained"
                style={{
                  width: "50%",
                  backgroundColor: "rgb(107 169 169)",
                  textAlign: "start",
                }}
                type="submit"
              >
                Create Account
              </Button>
            </form>

            <p style={{ fontSize: "0.8rem", marginTop: "10px" }}>
              Already have an account?{" "}
              <span
                className="cursor-pointer"
                onClick={(e) => navigate("/login")}
                style={{ color: "rgb(107 169 169)" }}
              >
                Login
              </span>
            </p>

            <Divider component="span" role="presentation" className="Divider">
              <Typography>or</Typography>
            </Divider>

            <Box
              container
              sx={{
                marginTop: "20px",
              }}
            >
              <Box style={{ width: "100%", textAlign: "-webkit-center" }}>
                <div
                  style={{
                    width: "50%",
                    border: "1px dotted grey",
                    padding: "5px",
                    backgroundColor: "whitesmoke",
                    borderRadius: "10px",
                  }}
                >
                  <p className="text-bold text-xl" style={{color:"rgb(107 169 169)"}}>Upload a csv file</p>
                  <Box className="mt-3 text-xl">
                    <FaUpload style={{color:"rgb(107 169 169)"}}/>
                  </Box>
                  <Button
                    component="label"
                    variant="contained"
                    style={{ backgroundColor: "rgb(107 169 169)", marginTop: "10px" }}
                  >
                    <input
                      type="file"
                      accept="*"
                      alt=""
                      style={{ display: "none" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    Upload
                  </Button>
                </div>
              </Box>
              
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    width: { xs: "85%", sm: "50%" },
                    backgroundColor: "rgb(107 169 169)",
                    textAlign: "start",
                    marginTop: "20px",
                  }}
                  type="submit"
                  onClick={handleSubmitFile}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
