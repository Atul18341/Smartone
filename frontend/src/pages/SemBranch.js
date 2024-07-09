import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  FormControl,
  FormHelperText,
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
import { BaseUrl } from "../components/BaseUrl";

const schema = yup.object().shape({
  semester_name: yup.string().required("Semester name is required"),
  subject_codes: yup.string().required("Subject codes is required"),
  branch: yup.string().required("Branch is required"),
});

export const SemBranch = () => {
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
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || (response.role !== "admin" && response.role !== "teacher" && response.role !== "faculty"))  {
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
    var subject_codes1 = data.subject_codes.split(",");
    var a = subject_codes1.map((data) => {
      return data.toLowerCase();
    });


    let data1 = JSON.stringify({
      semester_name: data.semester_name,
      subject_codes: a,
      branch: data.branch,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/semester/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
      data: data1,
    };

    const token = localStorage.getItem("accesstoken");
    const token1 = localStorage.getItem("refreshtoken");
   
    if (token && token1) {
    axios
      .request(config)
      .then((response) => {
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
        if (response.data.subjects.length === 0) {
          enqueueSnackbar("No such subject code is available", {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }else{
        enqueueSnackbar("Added successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 1000,
        });

        reset();
    }
      })
      
      .catch((error) => {
        console.log(error);

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
        enqueueSnackbar(error?.response?.data?.errors?.subject_codes[0], {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 1000,
        });
      });
    }else{
      navigate('/login')
    }
  };

  return (
    <Box>
      <NavbarNew />
      <Box
        
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 400,
          margin: "auto",
          marginTop: 5,
          marginBottom: 18,
        
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
            <img src="./images/enrollment.png" alt="" style={{width:"250px",borderRadius:"10px"}}/>
          </center>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              fullWidth
              style={{marginBottom:"5px"}}
              error={!!errors.subject_name}
            >
              <TextField
                type="text"
                label="Semester Name*"
                variant="outlined"
                fullWidth
                {...register("semester_name")}
              />
              <FormHelperText>{errors?.semester_name?.message}</FormHelperText>
            </FormControl>
            <FormControl
              fullWidth
            
              error={!!errors.subject_codes}
            >
              <TextField
                type="text"
                label="Subject Codes*"
                variant="outlined"
                style={{marginBottom:"5px"}}
                fullWidth
                {...register("subject_codes")}
              />
              <FormHelperText>{errors?.subject_codes?.message}</FormHelperText>
            </FormControl>
            <FormControl fullWidth  error={!!errors.branch}>
              <TextField
                type="text"
                label="Branch*"
                variant="outlined"
                fullWidth
                {...register("branch")}
              />
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
                marginTop: 1,
                
              }}
              type="submit"
            >
              Add Branch
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
