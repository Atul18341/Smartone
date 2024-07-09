import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import NavbarNew from "../components/NavbarNew";
import {
  Box,
  Button,
  Divider,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  TableHead,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {Footer} from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../components/BaseUrl";

// Validation schema
const exactTwoDecimalRegex = /^\d+\.\d{2}$/;

const schema = yup.object().shape({
  cgpa: yup
    .string()
    .required("CGPA is required")
    .test(
      "is-decimal",
      "CGPA must be a decimal with exactly 2 decimal places",
      (value) => value && exactTwoDecimalRegex.test(value)
    )
    .test("is-valid-range", "CGPA must be between 0 and 10", (value) => {
      if (value) {
        const numValue = parseFloat(value);
        return numValue >= 0 && numValue <= 10;
      }
      return true;
    }),
    file: yup
    .mixed()
    // .test("fileType", "Only image files are allowed", (value) => {
    //   if (!value) return true; // No file selected is valid
  
    //   const acceptedFormats = ["image/jpeg", "image/png", "image/jpg"];
    //   const file = value?.[0];
    //   return acceptedFormats?.includes(file?.type);
    // })
    .required("image file is required"),
  
});

// Component
export const HostelRoomRequest = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [result, setResult] = useState([]);
  const [allotedRoom, setAllotedRoom] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [responsive, setResponsive] = useState(window.innerWidth < 669);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const resize = () => {
      setResponsive(window.innerWidth < 600);
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

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
    const accessToken = localStorage.getItem("accesstoken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    if (decodedToken.exp < Math.floor(Date.now() / 1000) || ( decodedToken.role!=="student" && decodedToken.role!=="admin" ) ) {
      navigate("/login");
    }

    const fetchData = async () => {

      const token = localStorage.getItem("accesstoken");
        const token1 = localStorage.getItem("refreshtoken");

      if(token && token1){ 
      try {
        const userProfileResponse = await axios.get(
          `${BaseUrl}/profile/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserProfile(userProfileResponse.data);

        const hostelAllotmentsResponse = await axios.get(
          `${BaseUrl}/hostel-allotments/?search=${jwtDecode(localStorage?.getItem("accesstoken"))?.registration_number}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLoading(false);
        setResult(hostelAllotmentsResponse.data.reverse());

        const hostelRoomAllotmentsResponse = await axios.get(
          `${BaseUrl}/hostel-room-allotments/?search=${jwtDecode(localStorage?.getItem("accesstoken"))?.registration_number}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
        console.log(hostelRoomAllotmentsResponse.data)
        setAllotedRoom(hostelRoomAllotmentsResponse.data);
        setLoading1(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }else{
      navigate('/login');
    }
    };

    fetchData();
  }, [navigate]);

  if (loading || loading1) {
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setName(file.name);
    setValue("file", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {

    const acceptedFormats = ["image/jpeg", "image/png", "image/jpg"];
    
    if(data?.file?.length===0){
      return enqueueSnackbar("Marksheet field is empty", { variant: "error" });
    }
    if(!acceptedFormats.includes(data.file?.type)){
     
      return enqueueSnackbar("Only jpeg,png,jpg files are supported", { variant: "error" });
    }
    const formData = new FormData();
    formData.append(
      "registration_number",
      userProfile?.academic_information?.registration_number
    );
    formData.append("status", "applied");
    formData.append("cgpa", data.cgpa);
    formData.append("latest_marksheet", data.file);

    const token = localStorage.getItem("accesstoken");
    const token1 = localStorage.getItem("refreshtoken");

    if(token && token1){
    try {
      const response = await axios.post(
        `${BaseUrl}/hostel-allotments/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Request sent successfully:", response.data);

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
      enqueueSnackbar("Request sent successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 1000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error sending request:", error);
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
      enqueueSnackbar(
        error?.response?.data?.errors?.non_field_errors?.[0] ||
          "Failed to send request",
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
    }else{
      navigate('/login');
    }
  };

  return (
    <div className="container-fluid">
      <NavbarNew />
      <Box
        className="bonafide-form"
        sx={{  borderRadius: 3 , padding: 0 }}
      >
      <Typography
        variant="p"
        align="center"
        gutterBottom
        sx={{ fontSize:20, marginTop:"20px" }}
      >
        Hostel Room Allotment Request
      </Typography>
      <Grid
        container
        sx={{ padding: { lg: 5, md: 5, xs: 1, sm: 1 },
       
      }}
      >
        <Grid item xs={12} sm={12} md={12} lg={6} sx={{padding:{lg:3},
        position:"relative",
        top:{lg:"-20px"}
        }}>
          <Box>
            <Box
              sx={{
                display: {
                  md: "block",
                  lg: "none",
                  xs: "block",
                  sm: "block",
                },
              }}
            >
              <center>
                <img
                  src="./images/hostelRoom.jpg"
                  alt=""
                  style={{
                    width: "310px",
                    textAlign: "center",
                    borderRadius: "9px",
                  }}
                />
              </center>
            </Box>
            <Box
              sx={{
                backgroundColor: {xs:"rgb(243 244 246)",lg:"transparent"},
                padding: {lg:"45px",md:"35px",xs:"20px",sm:"20px"},
                marginTop: {lg:"5px",md:"42px",xs:"29px",sm:"29px"},
                marginLeft: {lg:"42px",md:"42px",xs:"0px",sm:"0px"},
                borderRadius: "15px"
              }}
            >
            <form onSubmit={handleSubmit(onSubmit)} >
              <FormControl fullWidth variant="outlined" margin="normal" >
                <Typography variant="p" style={{fontSize:"1.1rem"}}>
                  Registration / Employee Number
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px",marginTop:"5px" }}>
                  {userProfile?.academic_information?.registration_number}
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors?.cgpa?.message}
               
              >
                <TextField
                  label="Current CGPA"
                  type="text"
                  {...register("cgpa")}
                  error={!!errors.cgpa}
                  helperText={errors?.cgpa?.message}
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                />
              </FormControl>

              <FormControl
                fullWidth
                error={!!errors.file?.message}
                margin="normal"
              >
                <Box
                  sx={{
                    gap: "15px",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="p" gutterBottom style={{fontSize:"1.1rem"}}>
                    Latest Semester Marksheet
                  </Typography><br/>
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      backgroundColor: "rgb(107, 169, 169)",
                      color: "#fff",
                      "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                      
                        width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                      marginTop:"10px"
                    }}
                  >
                    Upload File
                    <input
                      type="file"
                      {...register("file")}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </Button>
                </Box>
                {previewUrl && (
                  <Box sx={{ marginTop: 2 }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: "150px" }}
                    />
                  </Box>
                )}
                {name && (
                  <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                    <Typography>{name}</Typography>
                  </Box>
                )}
                {errors?.file && (
                  <FormHelperText>{errors?.file?.message}</FormHelperText>
                )}
              </FormControl>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  marginTop: 2,
                  marginBottom:2,
                  backgroundColor: "rgb(107, 169, 169)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                  
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  
                }}
              >
                Send Request
              </Button>
            </form>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Box>
            

            <Box
              sx={{
                display: {
                  md: "none",
                  lg: "block",
                  xs: "none",
                  sm: "none",
                },
              }}
            >
              <center>
                <img
                  src="./images/hostelRoom.jpg"
                  alt=""
                  style={{
                    width: "310px",
                    textAlign: "center",
                    borderRadius: "9px",
                  }}
                />
              </center>
            </Box>

            <p style={{textAlign:"center",marginBottom:"10px",marginTop:"20px",fontSize:"1.2rem" }}>
              Previous Hostel Requests
            </p>

            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {result.length === 0 && (
                <Typography
                  variant="body1"
                  sx={{ marginTop: 3, textAlign: "center",
                    display:{lg:"none",md:"none",xs:"block",sm:"none"}

                   }}
                >
                 <center>
                 <img src="./images/No_data.png" alt="" style={{width:"310px",borderRadius:"10px",marginTop:"10px"}}/></center>
                </Typography>
              )}

              {responsive ? (
                result.length > 0 &&
                result.map((data, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      maxWidth: 305,
                      marginBottom: 2,
                      backgroundColor:"rgb(243 244 246)",
                      marginLeft:"20px",
                      padding:1
                    }}
                  >
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 16}}
                        color="text.secondary"
                        gutterBottom
                        variant="p"
                        
                      >
                        Previous Request Details
                      </Typography>
                      <br/>
                      <Typography variant="p" color="text.secondary" sx={{ fontSize: 15 }}>
                        Status: {data?.status}
                      </Typography>
                      <br/>
                      <Typography variant="p" color="text.secondary" sx={{ fontSize: 15}}>
                      Alloted Room No: 
                        {allotedRoom.length>0 ? (
                              <Typography
                               
                                variant="p"
                                color="text.secondary"
                              >
                                {" "}{allotedRoom?.[0]?.hostel_room}
                              </Typography>
                            ) : <p>Not alloted by now.</p>
                          }
                      </Typography>
                     
                    </CardContent>
                  </Card>
                ))
              ) : (
                result.length===0?(<>
                <center>
                <img src="./images/No_data.png" alt="" style={{width:"310px",borderRadius:"10px",marginTop:"30px",}}/></center>
                </>):(
                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="previous hostel requests"
                    style={{ textAlign: "center" }}
                  >
                    <TableHead style={{ backgroundColor: "#D2E9E9" }}>
                      <TableRow>
                        <TableCell style={{textAlign:"center"}}>Status</TableCell>
                        <TableCell style={{textAlign:"center"}}>Marksheet Image</TableCell>
                        <TableCell style={{textAlign:"center"}}>Alloted Room</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, index) => (
                          <TableRow key={index}>
                            <TableCell style={{textAlign:"center" ,backgroundColor:"rgb(243 244 246)"}}>{data?.status}</TableCell>
                            <TableCell style={{textAlign:"center",backgroundColor:"rgb(243 244 246)"}}>
                              {data?.latest_marksheet !== null ? (
                                <img
                                  src={`data:image/*;base64,${decodeURIComponent(
                                    data?.latest_marksheet
                                  )}`}
                                  alt="Marksheet"
                                  style={{ width: "150px", height: "150px" }}
                                />
                              ) : (
                                <p>Null</p>
                              )}
                            </TableCell>
                            <TableCell style={{textAlign:"center",backgroundColor:"rgb(243 244 246)"}}>
                            {allotedRoom.length>0 ? (
                              <Typography
                               
                                variant="p"
                                color="text.secondary"
                              >
                                {" "}{allotedRoom?.[0]?.hostel_room}
                              </Typography>
                            ) : <p>Not alloted by now.</p>
                          }
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter style={{ backgroundColor: "#D2E9E9" }}>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: "All", value: -1 },
                          ]}
                          colSpan={3}
                          count={result.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: { "aria-label": "rows per page" },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              )
              )}
            </Box>

            
          </Box>
        </Grid>
      </Grid>
    
      </Box>
      <Footer />
    </div>
  );
};

export default HostelRoomRequest;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
