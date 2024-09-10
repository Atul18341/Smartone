import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton,
  Card,
  CardContent,
  TableHead,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { enqueueSnackbar } from "notistack";
import { BaseUrl, Url } from "./BaseUrl";
import { formatDate } from "./FormDate";

const complaintSchema = yup.object().shape({
  type: yup.string().required("Complaint type is required"),
  subject: yup.string().max(40).min(20).required("Subject is required"),
  description: yup.string().max(400).min(25).required("Description is required"),
});

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

const ComplaintForm = () => {
  const [profileData, setProfileData] = useState({
    registrationNo: "",
    name: "",
    branch: "",
  });

  const [previousRecord, setPreviousRecord] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [responsive, setResponsive] = useState(window.innerWidth < 684);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [key, setKey] = useState(0);

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
            url: `${Url}/token/refresh/`,
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
    const handleResize = () => {
      setResponsive(window.innerWidth < 684);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      sessionStorage?.getItem("accesstoken") &&
      sessionStorage?.getItem("refreshtoken")
    ) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "student" && response.role !== "super-admin")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
    if (!token && !token1) {
      navigate("/login");
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/${
            jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
          }/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        if (data) {
          setLoading(false);
        }
        setProfileData({
          registrationNo: data?.academic_information?.registration_number,
          name: data?.personal_information?.first_name,
          branch: data?.academic_information?.branch,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
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
      }
    };

    fetchProfileData();
  }, [navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(complaintSchema),
  });

  useEffect(() => {
    if (
      sessionStorage.getItem("accesstoken") !== null &&
      sessionStorage.getItem("refreshtoken") !== null
    ) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/${
          jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
        }/complaints/`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          setPreviousRecord(response.data);
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
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // console.log(sessionStorage.getItem("accesstoken"))
    if (sessionStorage?.getItem("accesstoken") === null) {
      navigate("/login");
    } else if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000)) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const currentDate = new Date();

  const onSubmit = (data) => {
    setLoading1(true);

    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      if (profileData?.name === null && profileData?.branch === null) {
        return enqueueSnackbar("Update the profile first.", {
          variant: "warning",
        });
      }
      let data1 = JSON.stringify({
        name: profileData?.name,
        branch: profileData?.branch,
        status: "registered",
        subject: data.subject,
        complaint_type: data.type.toLowerCase(),
        complaint_description: data.description,
        registered_date: `${currentDate.getFullYear()}-${currentDate.getMonth() +
          1}-${currentDate.getDate()}`,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/${
          jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
        }/complaints/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
        },
        data: data1,
      };

      axios
        .request(config)
        .then((response) => {
          setLoading1(false);
          setPreviousRecord([
            ...previousRecord,
            {
              complaint_type: data.type.toLowerCase(),
              subject: data.subject,
              complaint_description: data.description,
              registered_date: `${currentDate.getFullYear()}-${currentDate.getMonth() +
                1}-${currentDate.getDate()}`,
              status: "registered",
            },
          ]);

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
          toast.success("Complaint registered successfully!", {
            position: "top-center",
            autoClose: 5000,
          });
          reset({
            type: "",
            subject: "",
            description: "",
          });
          setTimeout(() => {
            setValue("type", "");
          }, 10);
          setValue("subject", "");
          setValue("description", "");

          setKey((prevKey) => prevKey + 1);
        })
        .catch((error) => {
          console.log(error);
          setLoading1(false);
          toast.error("Failed to register complaint.", {
            position: "top-center",
            autoClose: 5000,
          });
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
        });
    } else {
      navigate("/login");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - previousRecord.length)
      : 0;

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
    <div className="container-fluid" style={{ borderRadius: "20px" }}>
      <Box
        className="complaint-form"
        sx={{ bgcolor: "", borderRadius: 3, padding: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6} style={{ marginTop: "15px" }}>
            <p
              style={{
                marginBottom: "1%",
                textAlign: "center",
                fontSize: "1.3rem",
              }}
            >
              Register Complaint
            </p>
            <center>
              <Divider
                sx={{
                  backgroundColor: "blue",
                  width: { lg: "10%", xs: "30%", md: "10%" },
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: "0px",
                }}
              />
            </center>

            <center>
              <Box
                sx={{
                  display: { xs: "block", sm: "block", md: "none", lg: "none" },
                  textAlign: "center",
                  marginBottom: "30px",
                }}
              >
                <img
                  src={`./images/addfee.png`}
                  alt=""
                  style={{ borderRadius: "10px", width: "260px",marginTop:"20px" }}
                />
              </Box>
            </center>
            <Box
              sx={{
                backgroundColor: {
                  xs: "rgb(243 244 246)",
                  lg: "transparent",
                  md: "transparent",
                },
                padding: { lg: "5px", md: "0px", xs: "15px", sm: "20px" },
                marginTop: { lg: "40px", md: "42px", xs: "29px", sm: "19px" },
                marginLeft: { lg: "10px", md: "42px", xs: "0px", sm: "0px" },
                borderRadius: "5px",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} key={key}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    padding: { lg: "15px", xs: "0px", md: "15px", sm: "10px" },
                  }}
                >
                  <Grid item xs={12}>
                    <TextField
                      label="Registration/ Employee No"
                      fullWidth
                      value={profileData?.registrationNo}
                      disabled
                      variant="standard"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={profileData?.name}
                      disabled
                      variant="standard"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Branch"
                      fullWidth
                      value={profileData?.branch}
                      disabled
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Complaint Type</InputLabel>
                          <Select
                            {...field}
                            label="Complaint Type"
                            variant="standard"
                          >
                            <MenuItem value="Ragging related">
                              Ragging related
                            </MenuItem>
                            <MenuItem value="Academic fees">
                              Academic fees
                            </MenuItem>
                            <MenuItem value="Classes related">
                              Classes related
                            </MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                          </Select>
                          {errors.type && (
                            <Typography
                              color="error"
                              fontSize="0.8rem"
                              marginTop="2px"
                            >
                              {errors.type.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Subject"
                          variant="standard"
                          fullWidth
                          error={!!errors.subject}
                          helperText={
                            errors.subject ? errors.subject.message : ""
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          variant="standard"
                          fullWidth
                          multiline
                          rows={4}
                          error={!!errors.description}
                          helperText={
                            errors.description ? errors.description.message : ""
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        width: { lg: "50%", md: "50%", xs: "100%", sm: "90%" },
                        backgroundColor: "rgb(107, 169, 169)",
                        "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                        borderRadius:"20px",
                        marginTop:"20px"
                      }}
                    >
                      {!loading1 && <p>Submit</p>}
                      {loading1 && (
                        <CircularProgress
                          style={{
                            color: "white",
                            width: "20px",
                            height: "22px",
                          }}
                        />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ textAlign: "-webkit-center" }}>
            <Box
              sx={{
                display: { xs: "none", sm: "none", md: "block", lg: "block" },

                marginTop: "90px",
                borderRadius: "15px",
              }}
            >
              <img
                src={`./images/addfee.png`}
                alt=""
                style={{ borderRadius: "10px", width: "280px" }}
              />
            </Box>
           
          </Grid>
        </Grid>
        <center>
        <Box>

        <Box sx={{ marginTop: "50px" }}>
              <Typography
                variant="p"
                sx={{
                  marginBottom: "5%",
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "1.4rem",
                }}
              >
                Previous Complaints
              </Typography>
              <center>
       
        <Divider
          sx={{
            backgroundColor: "blue",
            width: { lg: "12%", xs: "30%", md: "10%" },
            fontWeight: "800",
            textAlign: "center",
            marginTop: "5px",
          }}
        />
      </center>
            </Box>
          
        {previousRecord.length === 0 ? (
              <center>
                <p
                  style={{
                    padding: "5vw 0 9vw 0",
                    fontSize: "1.0rem",
                    marginTop: "20px",
                  }}
                >
                  No Data Found.
                </p>
              </center>
            ) : responsive ? (
              previousRecord
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <Card
                  variant="outlined"
                  key={index}
                  sx={{
                    marginBottom: 3,
                    marginTop: 3,
                    bgcolor: "#ffffff", // Light background for a cleaner look
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    borderRadius: 2, // Rounded corners for a modern look
                    maxWidth: 350, // Slightly wider for more content space
                    transition: "transform 0.2s ease-in-out", // Smooth hover effect
                    "&:hover": {
                      transform: "scale(1.02)", // Slightly enlarges on hover
                    },
                  }}
                >
                  <CardContent>
                    <Box mb={2}>
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {row.complaint_type}
                      </Typography>
                      <Box>
                      <Typography variant="body1" color="textSecondary">
                         {formatDate(row.registered_date)}
                      </Typography>
                    </Box>
            
                    </Box>

                   
                    <Box mb={2}>
                      <Typography variant="body1" textAlign="start" color="textSecondary">
                        <b>Description:</b> {row.complaint_description}
                      </Typography>
                    </Box>
            
                    <Box mb={2}>
                      <Typography variant="body1" textAlign="start" color="textSecondary">
                        <b>Subject:</b> {row.subject}
                      </Typography>
                      <Typography variant="body1" textAlign="start" color="textSecondary">
                        <b>Status:</b> {row.status}
                      </Typography>
                  
                    </Box>
            
                    
                    
            
                   
                  </CardContent>
                </Card>
                ))
            ) : (
              <TableContainer
                component={Paper}
                sx={{ marginTop: "20px", marginBottom: "50px",border: "none",
                  "&:last-child td, &:last-child th": { border: 0 },
                  maxWidth:"80%",
                  borderRight: 0,
                  borderBottom: 0, }}
              >
                <Table
                  sx={{ minWidth: 500,borderRight: 0,
                    "&:last-child td, &:last-child th": { border: 0 },
                    border: 0,
                    borderBottom: 0, }}
                  aria-label="custom pagination table"
                >
                  <TableHead style={{ backgroundColor: "#545959", }}>
                    <TableRow>
                      <TableCell sx={{
                              color: "white",
                            }}>Complaint Type</TableCell>
                      <TableCell sx={{
                              color: "white",
                            }}>Subject</TableCell>
                      <TableCell sx={{
                              color: "white",
                              
                            }}>Description</TableCell>
                      <TableCell sx={{
                              color: "white",
                              width:"10%"
                            }}>Date</TableCell>
                      <TableCell sx={{
                              color: "white",
                            }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previousRecord.length === 0 ? (
                      <TableRow>
                        <center>
                          <img
                            src="./images/No_data.png"
                            alt=""
                            style={{
                              width: "340px",
                              borderRadius: "10px",
                              marginTop: "30px",
                            }}
                          />
                        </center>
                      </TableRow>
                    ) : (
                      previousRecord
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.complaint_type}</TableCell>
                            <TableCell>{row.subject}</TableCell>
                            <TableCell>{row.complaint_description}</TableCell>
                            <TableCell>{formatDate(row.registered_date)}</TableCell>
                            <TableCell>{row.status}</TableCell>
                          </TableRow>
                        ))
                    )}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={5} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter style={{ backgroundColor: "#545959" }}>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={5}
                        count={previousRecord.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            "aria-label": "rows per page",
                          },
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
            )}
        </Box>
        </center>
        <ToastContainer />
      </Box>
    </div>
  );
};

export default ComplaintForm;
