import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import NavbarNew from '../components/NavbarNew';
import Footer from '../components/Home/Footer';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../components/BaseUrl';

// Define validation schema using Yup
const schema = yup.object().shape({
  college_code: yup.string().required('College code is required'),
  college_name: yup.string().required('College name is required'),
  college_address: yup.string().required('College address is required'),
  established_date: yup.string()
    .required('Established date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD'),
  principal_name: yup.string().required('Principal name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  college_logo: yup.mixed().required('College logo is required')
});

const CollegeForm = () => {
  const { register, handleSubmit, control, formState: { errors },reset } = useForm({
    resolver: yupResolver(schema)
  });

  const navigate=useNavigate();

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "admin"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);
  
  const onSubmit = async (data) => {

   
    const formData = new FormData();
    formData.append('college_code', data.college_code);
    formData.append('college_name', data.college_name);
    formData.append('college_address', data.college_address);
    formData.append('established_date', data.established_date);
    formData.append('principal_name', data.principal_name);
    formData.append('email', data.email);
    formData.append('college_logo', data.college_logo[0]);

    const config = {
      method: 'post',
      url: `${BaseUrl}/college/`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      reset();
      enqueueSnackbar("successfully created", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });


    } catch (error) {

      if(error?.response?.data?.errors?.college_name){
        enqueueSnackbar("college with this college code already exists", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });  
      }
      if(error?.response?.data?.errors?.college_logo){
        enqueueSnackbar("give a valid college logo", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });  
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
       
      console.error(error);
    }
  };

  return (
   <> 
   <NavbarNew/>
    <Container component="main" maxWidth="md">
      <Paper elevation={0} sx={{ p: 1, mt: 4 }}>
        <Typography variant="h5" align='center' gutterBottom>
          College Information Form
        </Typography>

        <center>
          <img src='./images/college.jpg' alt='' style={{width:"290px"}}/>
        </center>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="College Code"
                {...register('college_code')}
                error={!!errors.college_code}
                helperText={errors.college_code?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="College Name"
                {...register('college_name')}
                error={!!errors.college_name}
                helperText={errors.college_name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="College Address"
                {...register('college_address')}
                error={!!errors.college_address}
                helperText={errors.college_address?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Established Date"
                InputLabelProps={{ shrink: true }}
                {...register('established_date')}
                error={!!errors.established_date}
                helperText={errors.established_date?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Principal Name"
                {...register('principal_name')}
                error={!!errors.principal_name}
                helperText={errors.principal_name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                style={{backgroundColor: "rgb(107, 169, 169)"}}
              >
                Upload College Logo
                <input
                  type="file"
                  hidden
                  {...register('college_logo')}
                />
              </Button>
              {errors.college_logo && (
                <Typography color="error" variant="body2">
                  {errors.college_logo.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{backgroundColor: "rgb(107, 169, 169)"}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
   <Footer/>
    </>
  );
};

export default CollegeForm;
