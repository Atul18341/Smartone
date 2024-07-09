import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "../App.css";
import { FaUserEdit } from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/logout.css";
import { jwtDecode } from "jwt-decode";
import { BaseUrl } from "./BaseUrl";
import { enqueueSnackbar } from "notistack";


export const ProfileMainBody = () => {
  const [userProfile, setUserProfile] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000)|| response.role!=="student" ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/profile/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setUserProfile(response.data);
        setLoading(false);
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
      });
  }, []);

  // const handleChange=(e)=>{

  //   const formData=new FormData();
  //   console.log(e.target.files[0]);
  //   formData.append("profile_picture",e.target.files[0]);

  //   let data = JSON.stringify({
  //     "personal_information": {
  //       "profile_picture":formData
  //     },
  //     "contact_information": {},
  //     "academic_information": {}
  //   });

  //   let config = {
  //     method: 'put',
  //     maxBodyLength: Infinity,
  //     url: 'https://amarnath013.pythonanywhere.com/api/user/profile/',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`
  //     },
  //     data : data
  //   };

  //   axios.request(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // }
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
    <Box className="logout-container">
      <div className="circle circle1"></div>
      <div className="rectangle circle2"></div>
      <div className="circle circle3"></div>
      <div className="rectangle circle4"></div>
      <div className="rectangle circle5"></div>
      <div className="circle circle6"></div>

      <Box
        className="mt-3 w-full lg:p-10 sm:p-5 p-5"
        style={{
          height: "calc(100vh - 5px)",
          overflowY: "scroll",
          zIndex: "6",
          overflowX:"hidden"
        }}
      >
        <center>
        
        </center>
        <Box className="text-center">
          {userProfile?.personal_information?.profile_picture !== null ? (
            <img
              src={userProfile?.personal_information?.profile_picture}
              alt="Loading..."
              style={{
                width: "150px",
                height: "150px",
                margin: "10px 0px 10px 40px",
                borderRadius: "50%",
                filter: "opacity(1)",
                border: "2px solid whitesmoke",
                objectFit:"cover"
              }}
            />
          ) : (
            <img
              src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720137600&semt=ais_user"
              alt="Loading..."
              className="lg:w-[10%] w-[40%] sm:w-[25%] md:w-[15%] h-auto text-center"
              style={{ borderRadius: "50%" }}
            />
          )}

          <Typography varient="span" component="label">
            <input type="file" style={{ display: "none" }} />
          </Typography>
        </Box>

        <Box className="lg:p-10 sm:p-5 xs:p-0 md:p-5 mb-4">
          <div className="flex justify-between">
            <p style={{ fontSize: "1.5rem", marginTop: "20px" }}>
              Basic details
            </p>

            <FaUserEdit
              style={{ fontSize: "1.6rem" }}
              className="text-gray-500"
              onClick={(e) => navigate("/profileEdit")}
            />
          </div>
          <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
            <Grid container className="mt-3">
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{ marginTop: "0px", marginBottom: "5px" }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Registration No.
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.registration_number}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  First Name
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.first_name || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Middle Name
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.middle_name || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Last Name
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.last_name || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  DOB
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.date_of_birth || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Gender
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.personal_information?.gender || <p>NA</p>}
                </Typography>
              </Grid>
              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "5px", sm: "5px", md: "5px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Permanent Address
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.permanent_address || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Correspndance Address
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.personal_information?.correspndance_address || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className="lg:p-10 sm:p-5 xs:p-0 md:p-5 mb-6">
          <Typography variant="p" className="text-2xl mx-auto mb-5">
            Contact Information
          </Typography>
          <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
            <Grid container className="mt-3">
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "0px", sm: "0px", md: "0px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Email
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.contact_information?.student_email}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Student's Phone no.
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.contact_information?.student_phone_number}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Father's phone no
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.contact_information?.fathers_mobile_number || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box className="lg:p-10 sm:p-5 md:p-5 xs:p-0">
          <Typography variant="p " className="  text-2xl mx-auto mb-10">
            Academic Information
          </Typography>
          <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
            <Grid container className="mt-3">
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginTop: "0px", marginBottom: "5px" }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Registration_number
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.registration_number || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Enrollment_date
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.registration_year || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Year
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.year || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "10px", sm: "10px", md: "10px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Branch
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "5px" }}
              >
                <Typography variant="p">
                  {userProfile?.academic_information?.branch || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Last Qualification
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.last_qualification || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  School
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.school || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Board
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.board || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Merit Serial Number
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.merir_serial_number || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Category
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.category || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  College Name
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.academic_information?.college_name || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "10px", sm: "10px", md: "10px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Date Of Admission
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.academic_information?.date_of_admission || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />

              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "10px", sm: "10px", md: "10px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Session
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.academic_information?.session || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  University Registration Number
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "20px" }}
              >
                <Typography variant="p">
                  {userProfile?.academic_information?.university_reg_no || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box className="lg:p-10 sm:p-5 xs:p-0 md:p-5 mb-5 mt-5">
          <Typography variant="p" className="text-2xl mx-auto">
            TC Information
          </Typography>
          <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
            <Grid container className="mt-3">
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "0px", sm: "0px", md: "0px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  TC/CL no.
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.tc_information?.TC_or_CL_no || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Issuing Date TC
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.tc_information?.issuing_date_tc || <p>NA</p>}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "15px", sm: "15px", md: "15px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Purpose
                </Typography>
              </Grid>
              <Grid item lg={4} sm={12} xs={12} md={12}>
                <Typography variant="p">
                  {userProfile?.tc_information?.purpose || <p>NA</p>}
                </Typography>
              </Grid>
              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "10px", sm: "10px", md: "10px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Character Certificate Issued
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.tc_information
                    ?.character_certificate_issued || <p>NA</p>}
                </Typography>
              </Grid>
              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "5px", sm: "5px", md: "5px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Character Certificate No.
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.tc_information?.character_certificate_no || (
                    <p>NA</p>
                  )}
                </Typography>
              </Grid>

              <Divider
                sx={{
                  width: "100%",
                  margin: "10px 0",
                  display: {
                    xs: "none",
                    sm: "none",
                    lg: "block",
                    md: "block",
                  },
                }}
              />
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                sx={{
                  marginTop: { xs: "5px", sm: "5px", md: "5px", lg: "0px" },
                  marginBottom: "5px",
                }}
              >
                <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                  Issuing Date Creation
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={12}
                xs={12}
                md={12}
                style={{ marginBottom: "10px" }}
              >
                <Typography variant="p">
                  {userProfile?.tc_information?.issuing_date_cr || <p>NA</p>}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
