import React, { useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import NavbarNew from './NavbarNew';
import Footer from './Home/Footer';
import { RiLockPasswordFill } from "react-icons/ri";
import { BaseUrl } from './BaseUrl';

const validationSchema = yup.object({
  newPassword: yup
    .string('Enter your new password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('New password is required'),
  confirmPassword: yup
    .string('Confirm your new password')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const ChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

 
  const regenerateToken = () => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(sessionStorage?.getItem("refreshtoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || response1.exp < Math.floor(Date.now() / 1000)) {
        navigate("/login");
      }else{
        if (sessionStorage.getItem("refreshtoken") && sessionStorage.getItem("accesstoken")) {
          let data = {
            refresh: sessionStorage?.getItem("refreshtoken"),
          };
    
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://amarnath013.pythonanywhere.com/api/user/token/refresh/",
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
    if (sessionStorage?.getItem("accesstoken") && sessionStorage?.getItem('refreshtoken')) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        
        response.exp < Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const onSubmit = (data) => {
    let data1 = JSON.stringify({
      "password": data.newPassword,
      "password2": data.confirmPassword
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/change-password/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('accesstoken')}`
      },
      data: data1
    };

    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
    if (token && token1) {
    axios.request(config)
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
        }else{
          navigate('/login');
        }

        setTimeout(() => {
          enqueueSnackbar(response.data.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        }, 1000);

        setTimeout(() => {
          enqueueSnackbar('Logging out', {
            variant: "info",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
          sessionStorage?.removeItem('accesstoken');
          sessionStorage?.removeItem('refreshtoken');
        }, 2000);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((error) => {
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
    }else{
      navigate('/login');
    }
  };

  return (
    <>
      <NavbarNew />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: "2px",
          background: 'linear-gradient(to bottom, #b5eded 30%, white 70%)',
          backgroundSize: '200% 200%',
          animation: 'backgroundTransition 15s ease infinite',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: { lg: 3, md: 3, sm: 3, xs: 0 },
            width: '100%',
            maxWidth: '400px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <center>
            <HiOutlineExclamationCircle style={{ fontSize: "3.4rem", marginBottom: "20px" }} />
          </center>
          <Typography variant="h4" textAlign="center" mb={2}>
            Change Password
          </Typography>
          <Typography variant="body1" textAlign="center" mb={2}>
            Enter new password and confirm password to change your existing password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              {...register('newPassword')}
              fullWidth
              margin="normal"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RiLockPasswordFill />
                  </InputAdornment>
                ),
              }}
              required
              sx={{
                transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:focus': {
                  borderColor: 'skyblue',
                  boxShadow: '0 0 10px skyblue',
                },
              }}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              {...register('confirmPassword')}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RiLockPasswordFill />
                  </InputAdornment>
                ),
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              required
              sx={{
                transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:focus': {
                  borderColor: 'skyblue',
                  boxShadow: '0 0 10px skyblue',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                color: '#fff',
                backgroundColor: "rgb(107, 169, 169)",
                "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                transition: 'background-color 0.3s ease-in-out',
              }}
            >
              Change Password
            </Button>
          </form>
        </Box>
      </Box>
      <Footer />
      <style jsx="true">{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes backgroundTransition {
          0% {
            background-position: 0% 90%;
          }
          50% {
            background-position: 90% 50%;
          }
          100% {
            background-position: 0% 90%;
          }
        }
      `}</style>
    </>
  );
};

export default ChangePassword;
