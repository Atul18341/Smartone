import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  TableContainer,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { BaseUrl } from "../components/BaseUrl";

// Validation schema using yup
const schema = yup.object().shape({
  Maintainance_fees: yup
    .number()
    .typeError("Maintenance Fees must be a number")
    .positive("Maintenance Fees must be positive")
    .required("Maintenance Fees is required"),
  Mess_fees: yup
    .number()
    .typeError("Mess Fees must be a number")
    .positive("Mess Fees must be positive")
    .required("Mess Fees is required"),
  Security_Deposit: yup
    .number()
    .typeError("Security Deposit must be a number")
    .positive("Security Deposit must be positive")
    .required("Security Deposit is required"),
});

const AddFeesCaretaker = () => {

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, // Reset function from react-hook-form
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [result, setResult] = useState([]);
  const [editId, setEditId] = useState(null); // State to hold the id of the fee being edited
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "caretaker"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          url: `${BaseUrl}/fees/`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        };
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
        const response = await axios.request(config);
        setResult(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData here to fetch data when component mounts
  }, []);

  const onSubmit = async (data) => {
    const jsonData = JSON.stringify(data);

    try {
      let config;
      if (editId) {
        config = {
          method: "put",
          url: `${BaseUrl}/fees/update/${editId}/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
          data: jsonData,
        };
      } else {
        config = {
          method: "post",
          url: `${BaseUrl}/fees/create/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
          data: jsonData,
        };
      }
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
      const response = await axios.request(config);
      console.log(response.data);

      enqueueSnackbar("Data added successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });

      // Clear form and reset editId state after submission
      reset();
      setEditId(null);

      // Fetch updated data after submission
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding/updating data:", error);
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
    }
  };

  const handleEdit = (feeId) => {
    // Find the fee with feeId in result state and populate the form fields

    reset({
      Maintainance_fees: result.Maintainance_fees,
      Mess_fees: result.Mess_fees,
      Security_Deposit: result.Security_Deposit,
    });
    setEditId(feeId);
  };

  return (
    <>
      <NavbarNew />
      <Container style={{ marginBottom: "11%", padding: "10px" }}>
        <p
          style={{
            marginTop: "20px",
            marginBottom: "36px",
            textAlign: "center",
            fontSize: "1.4rem",
          }}
        >
          Fees Structure
        </p>
        <Grid container spacing={12}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={7}
            sx={{
              marginTop: { lg: "70px", md: "70px", xs: "0px", sm: "0px" },
            }}
          >
            <Box
              sx={{
                display: { sm: "block", xs: "block", md: "none", lg: "none" },
                textAlign: "center",
              }}
            >
              <img
                src={`./images/addCarefee.png`}
                alt=""
                style={{ width: "250px" }}
              />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="Maintainance_fees"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Maintenance Fees"
                    placeholder="Maintenance Fees..."
                    variant="outlined"
                    fullWidth
                    error={!!errors.Maintainance_fees}
                    helperText={errors.Maintainance_fees?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="Mess_fees"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mess Fees"
                    placeholder="Mess Fees..."
                    variant="outlined"
                    fullWidth
                    error={!!errors.Mess_fees}
                    helperText={errors.Mess_fees?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="Security_Deposit"
             
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Security Deposit"
                       placeholder="Security_Deposit..."
                    variant="outlined"
                    fullWidth
                    error={!!errors.Security_Deposit}
                    helperText={errors.Security_Deposit?.message}
                    style={{ marginTop: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiMoneyRupeeCircleFill />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "20px" }}
              >
                {editId ? "Update" : "Submit"}
              </Button>
            </form>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "-webkit-center",
            }}
          >
            <Box
              sx={{
                display: { sm: "none", xs: "none", md: "block", lg: "block" },
                textAlign: "center",
              }}
            >
              <img
                src={`./images/addCarefee.png`}
                alt=""
                style={{ width: "300px" }}
              />
            </Box>

            <Box style={{ marginTop: "20px" }}>
              <p
                style={{
                  marginTop: "20px",
                  marginBottom: "36px",
                  textAlign: "center",
                  fontSize: "1.4rem",
                }}
              >
                Previous Fees Records
              </p>
            </Box>

            {result.length === 0 ? (
              <Typography variant="body1" align="center">
                You have not added any fees structure.
              </Typography>
            ) : (
              <Box>
                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                  <Table sx={{ minWidth: 300 }} aria-label="Fees table">
                    <TableHead style={{ backgroundColor: "#D2E9E9" }}>
                      <TableRow>
                        <TableCell>Maintenance</TableCell>
                        <TableCell>Mess </TableCell>
                        <TableCell>Security</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={result.id}>
                        <TableCell>{result.Maintainance_fees}</TableCell>
                        <TableCell>{result.Mess_fees}</TableCell>
                        <TableCell>{result.Security_Deposit}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEdit(result.id)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default AddFeesCaretaker;
