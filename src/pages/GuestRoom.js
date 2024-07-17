import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import NavbarNew from "../components/NavbarNew";
import {
  Box,
  Button,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  FormHelperText,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
  CardContent,
  Card,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Footer } from "../components/Footer";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../components/BaseUrl";
import { MdDateRange } from "react-icons/md";

// Validation schema
const schema = yup.object().shape({
  purpose: yup.string().required("Purpose is required"),
  toDate: yup.string().required("To date is required"),
  numberOfPersons: yup
    .number()
    .required("Number of persons is required")
    .min(1, "At least 1 person")
    .typeError("Number of persons is required"),
});

export const GuestRoom = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (localStorage.getItem("accesstoken")!==null) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || (response.role!=='student' && response.role!=='admin')) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState("");
  const [fromError, setFromError] = useState("");
  const [result, setResult] = useState([]);
  const [responsive, setResponsive] = useState(window.innerWidth < 669);
  const [loading, setLoading] = useState(true);

  
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
    const resize = () => {
      setResponsive(window.innerWidth < 669);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if(localStorage.getItem("accesstoken")!==null && localStorage.getItem("refreshtoken")!==null){
    const fetchData = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/guest-room-allotments/?search=${jwtDecode(localStorage?.getItem("accesstoken"))?.registration_number}`,
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accesstoken")}`,
        },
      };
      try {
        const response = await axios.request(config);
        const token = localStorage.getItem("accesstoken");
        const token1 = localStorage.getItem("refreshtoken");
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
        }else{
          navigate('/login');
        }
        setResult(response?.data?.reverse());
        setLoading(false);
      } catch (error) {
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
    
    fetchData();
  }else{
    navigate('/login');
  }
  }, []);

  const onSubmit = async (data) => {
    let requestData = JSON.stringify({
      user: localStorage?.getItem('accesstoken')===null ?null: jwtDecode(localStorage?.getItem("accesstoken"))?.user_id,
      purpose_of_request: data.purpose,
      from_date: from,
      to_date: data.toDate,
      no_of_persons: data.numberOfPersons,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/guest-room-allotments/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
      data: requestData,
    };

    const token = localStorage.getItem("accesstoken"); 
    const token1 = localStorage.getItem("refreshtoken"); 

    if(token && token1){
    try {

      axios.request(config).then((response)=>{

        enqueueSnackbar("Guest room allotment request was successfully created", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
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
      }).catch((error)=>{
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
     
    } catch (error) {
      console.error(error);
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
  }else{
    navigate('/login');
  }
  };

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
    <div className="container-fluid">
      <NavbarNew />
      <Box
        className="bonafide-form"
        sx={{ padding: {lg:1,xs:1}, borderRadius: 2 }}
      >
        <Typography
          variant="p"
          align="center"
          gutterBottom
          style={{marginTop:"20px",fontSize:"1.4rem" }}
        >
          Guest Room Allotment Request
        </Typography>
       
        <img src="./images/hostel_caretaker.png" alt="" style={{width:"320px",marginTop:"20px"}}/>
        <Box
              sx={{
                backgroundColor: "rgb(243 244 246)",
                padding: {lg:"20px",md:"35px",xs:"10px",sm:"20px"},
                marginTop: {lg:"22px",md:"42px",xs:"20px",sm:"29px"},
                marginLeft: {lg:"42px",md:"42px",xs:"0px",sm:"0px"},
                borderRadius: "10px"
              }}
        >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Typography variant="p" style={{fontSize:"1.0rem"}}>Registration number</Typography>
            <Typography variant="body2" color="text.secondary" style={{ marginBottom: "5px",fontSize:"1.0rem" }}>
              {localStorage?.getItem("accesstoken")===null?null:jwtDecode(localStorage?.getItem("accesstoken"))?.registration_number}
            </Typography>
          </FormControl>

          <FormControl
            variant="outlined"
            error={!!errors?.purpose?.message}
            fullWidth
          >
            <InputLabel id="purpose-label">Purpose of requesting</InputLabel>
            <Controller
              name="purpose"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="purpose-label"
                  id="purpose"
                  label="Select Purpose"
                  {...field}
                  defaultValue=""
                >
                  <MenuItem value="for staying parents">
                    For staying parents
                  </MenuItem>
                  <MenuItem value="for staying relatives">
                    For staying relatives
                  </MenuItem>
                  <MenuItem value="for staying invited delegate">
                    For staying invited delegate
                  </MenuItem>
                  <MenuItem value="for staying alumni">
                    For staying Alumni
                  </MenuItem>
                </Select>
              )}
            />
            {errors.purpose && (
              <FormHelperText>{errors.purpose?.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="fromDate"
              label="From"
              type="date"
              InputLabelProps={{
                shrink: true,
               
              }}
              inputProps={{
                min: today,
              }}
              onChange={(e) => {
                setFrom(e.target.value);
                setFromError("");
              }}
              variant="outlined"
              fullWidth
             
            />
            <p style={{ color: "red", fontSize: "0.75rem", fontWeight: "400" }}>
              {fromError}
            </p>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="toDate"
              label="To"
              type="date"
              {...register("toDate")}
              inputProps={{
                min: from,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.toDate}
              helperText={errors.toDate?.message}
              variant="outlined"
              fullWidth
              
            
            />
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!errors.numberOfPersons?.message}
            
          >
            <InputLabel id="numberOfPersons-label">

              Number of Persons
             
            </InputLabel>
            <Controller
          
              name="numberOfPersons"
              control={control}
              render={({ field }) => (
                
                <Select
                  labelId="numberOfPersons-label"
                  id="numberOfPersons"
                  label="Number of Persons"
                  {...field}
                  defaultValue=""
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  
                </Select>
                
              )}
            />
            {errors.numberOfPersons && (
              <FormHelperText>{errors.numberOfPersons.message}</FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: "16px", backgroundColor: "rgb(107,169,169)",marginBottom:"15px" }}
          >
            Send Request
          </Button>
        </form>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography
          variant="p"
          gutterBottom
          style={{fontSize:"1.2rem"}}
        >
          Approved Requests
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          
            {result.length > 0 ? (
              result.map((data, index) => (
                <Box key={index}>
                  <Card
                  variant="outlined"
                    sx={{
                      width: { lg: "800px", md: "700px", sm: "500px", xs: "300px" },
                      marginBottom: 2,
                      backgroundColor:"rgb(243 244 246)"
                    }}
                  >
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 16 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Hostel Request Details
                      </Typography>
                      <Typography variant="p" component="div">
                        Purpose Of Request: {data?.purpose_of_request}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        From Date: {data?.from_date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        To Date: {data?.to_date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No Of Persons: {data?.no_of_persons}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {data?.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            ) : (
              <center>
              <img src="./images/No_data.png" alt="" style={{width:"320px",borderRadius:"10px",marginTop:"30px"}}/></center>
            )
          
          // ) : (
          //   <Box>
          //     {result.length > 0 ? (
          //       <TableContainer component={Paper} sx={{ marginTop: 3 ,marginBottom:3 }}>
          //         <Table
          //           sx={{ minWidth: 650 }}
          //           aria-label="hostel requests table"
          //         >
          //           <TableHead style={{ backgroundColor: "#D2E9E9" }}>
          //             <TableRow>
          //               <TableCell>Purpose Of Request</TableCell>
          //               <TableCell>From Date</TableCell>
          //               <TableCell>To Date</TableCell>
          //               <TableCell>No of Persons</TableCell>
          //               <TableCell>Status</TableCell>
          //             </TableRow>
          //           </TableHead>
          //           <TableBody>
          //             {result.map((data, index) => (
          //               <TableRow key={index}>
          //                 <TableCell style={{backgroundColor:"rgb(243 244 246)"}}>{data?.purpose_of_request}</TableCell>
          //                 <TableCell style={{backgroundColor:"rgb(243 244 246)"}}>{data?.from_date}</TableCell>
          //                 <TableCell style={{backgroundColor:"rgb(243 244 246)"}}>{data?.to_date}</TableCell>
          //                 <TableCell style={{textAlign:"center",backgroundColor:"rgb(243 244 246)"}}>{data?.no_of_persons}</TableCell>
          //                 <TableCell style={{backgroundColor:"rgb(243 244 246)"}}>{data?.status}</TableCell>
          //               </TableRow>
          //             ))}
          //           </TableBody>
          //         </Table>
          //       </TableContainer>
          //     ) : <center>
          //     <img src="./images/No_data.png" alt="" style={{width:"320px",borderRadius:"10px",marginTop:"30px"}}/></center>}
            // </Box>
          }
        </Box>
      </Box>
      <Footer />
    </div>
  );
};
