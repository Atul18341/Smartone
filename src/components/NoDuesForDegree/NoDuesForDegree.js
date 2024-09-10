import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  CardContent,
  Card,
  Box,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableFooter,
  TablePagination,
  useTheme,
  CircularProgress,
} from "@mui/material";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { enqueueSnackbar } from "notistack";
import NavbarNew from "../NavbarNew";
import Footer from "../Home/Footer";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { BaseUrl } from "../BaseUrl";
import { BannerSection } from "../BannerSection";

// Validation schema
const schema = yup.object().shape({
  checkbox: yup
    .boolean()
    .oneOf([true], "Please agree to the terms and conditions"),
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

export function NoDuesForDegree() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});
  const [result, setResult] = useState([]);
  const [responsive, setResponsive] = useState(window.innerWidth < 669);
  const [loading, setLoading] = useState(true);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
            url: `${BaseUrl}/token/refresh/`,
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
    window.addEventListener("resize", () => {
      setResponsive(window.innerWidth < 669);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setResponsive(window.innerWidth < 669);
      });
    };
  }, []);

  useEffect(() => {
    if (
      sessionStorage.getItem("accesstoken") !== null &&
      sessionStorage.getItem("refreshtoken") !== null
    ) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${BaseUrl}/${
              jwtDecode(sessionStorage.getItem("accesstoken")).college
            }/profile/`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accesstoken"
                )}`,
              },
            }
          );
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
          setUserProfile(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      const fetchRequests = async () => {
        try {
          const response = await axios.get(
            `${BaseUrl}/${
              jwtDecode(sessionStorage.getItem("accesstoken")).college
            }/overall-no-dues/`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accesstoken"
                )}`,
              },
            }
          );
          setResult(response.data);
        } catch (error) {
          console.log(error);
        }
      };

      if (sessionStorage.getItem("accesstoken")) {
        const decodedToken = jwtDecode(sessionStorage.getItem("accesstoken"));
        if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
          navigate("/login");
        } else {
          fetchData();
          fetchRequests();
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const onSubmit = async (data) => {

    
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
    if (userProfile?.personal_information?.first_name === null)
      return enqueueSnackbar("Please update your profile", { variant: "error" });

    if (!userProfile?.academic_information?.branch)
      return enqueueSnackbar("Please update your profile", { variant: "error" });

    if (!userProfile?.personal_information?.father_name)
      return enqueueSnackbar("Please update your profile", { variant: "error" });

    if (!userProfile?.academic_information?.category)
      return enqueueSnackbar("Please update your profile", { variant: "error" });

    if (!userProfile?.academic_information?.session)
      return enqueueSnackbar("Please update your profile", { variant: "error" });

    const requestData = {
      name: `${userProfile?.personal_information?.first_name} ${userProfile?.personal_information?.last_name}`,
      branch: userProfile?.academic_information?.branch,
      father_name: userProfile?.personal_information?.father_name,
      category: userProfile?.academic_information?.category,
      self_declaration: true,
      status: "applied",
      session: userProfile?.academic_information?.session,
    };

    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      try {
        axios
          .post(
            `${BaseUrl}/${
              jwtDecode(sessionStorage.getItem("accesstoken")).college
            }/overall-no-dues/`,
            requestData,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accesstoken"
                )}`,
              },
            }
          )
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
            } else {
              navigate("/login");
            }

            setResult([...result,{name:`${userProfile?.personal_information?.first_name} ${userProfile?.personal_information?.middle_name} ${userProfile?.personal_information?.last_name}`,registration_number:jwtDecode(sessionStorage.getItem("accesstoken")).registration_number,status:"pending"}])
         

            enqueueSnackbar("Request was applied successfully", {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
          })
          .catch((error) => {
            console.log(error);
            if (error?.response?.data?.errors?.non_field_errors?.[0]) {
              enqueueSnackbar(
                error?.response?.data?.errors?.non_field_errors?.[0],
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
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.errors?.non_field_errors?.[0]) {
          enqueueSnackbar(
            error?.response?.data?.errors?.non_field_errors?.[0],
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
        enqueueSnackbar("The request has already been made.", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      }
    } else {
      navigate("/login");
    }
  }else{
    navigate("/login");
  }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      <BannerSection image={"../images/banner2.jpg"} title={"No Dues For Degree"} 
      subtitle={"Streamline the degree no-dues process by prioritizing student clearances and outstanding obligations. Customize the verification process to ensure efficient completion and timely degree issuance."}/>
      <Box
        className="no-dues-form"
        sx={{ borderRadius: 3, padding: { lg: 3, xs: 2 } }}
      >
        <Grid container>
          <Grid item xs={12} md={6} lg={6} style={{ marginTop: "20px" }}>
            <center>
              <Typography variant="p" sx={{ fontSize: "1.2rem" }}>
                Overall No Dues Request (For TC)
              </Typography>
              <center>
                <Divider
                  sx={{
                    backgroundColor: "blue",
                    width: { lg: "22%", xs: "50%", md: "10%" },
                    fontWeight: "800",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                />
              </center>
            </center>

            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                display: { xs: "block", md: "none", lg: "none", sm: "block" },
              }}
            >
              <Box
                sx={{
                  marginTop: { lg: "5%", md: "5%", sm: "5%", xs: "5%" },
                  textAlign: "center",
                }}
              >
                <img
                  src="../images/noDues1.png"
                  alt=""
                  style={{ width: "280px", marginLeft: "0%", marginTop: "5%",borderRadius:"20px" }}
                />
              </Box>
            </Grid>

            <Box
              sx={{
                backgroundColor: {
                  xs: "rgb(243 244 246)",
                  lg: "transparent",
                  md: "transparent",
                },
                padding: { lg: "45px", md: "0px", xs: "20px", sm: "20px" },
                marginTop: { lg: "0px", md: "42px", xs: "29px", sm: "19px" },
                marginLeft: { lg: "100px", md: "42px", xs: "0px", sm: "0px" },
                borderRadius: "15px",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Name
                </Typography>

                <TextField
                  type="text"
                  value={`${userProfile?.personal_information?.first_name} ${userProfile?.personal_information?.middle_name} ${userProfile?.personal_information?.last_name}`}
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  variant="standard"
                  disabled
                />

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Registration Number
                </Typography>
                <TextField
                  type="text"
                  value={userProfile?.personal_information?.registration_number}
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  variant="standard"
                  disabled
                />

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Branch
                </Typography>
                <FormControl fullWidth>
                  <TextField
                    value={userProfile?.academic_information?.branch || ""}
                    disabled
                    variant="standard"
                    placeholder="Branch"
                    sx={{
                      width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                    }}
                  />
                  <FormHelperText>{errors.branch?.message}</FormHelperText>
                </FormControl>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Father's Name
                </Typography>

                <TextField
                  type="text"
                  variant="standard"
                  value={userProfile?.personal_information?.father_name}
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  disabled
                  placeholder="Father name"
                />

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Session
                </Typography>

                <TextField
                  type="text"
                  variant="standard"
                  value={userProfile?.academic_information?.session}
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  placeholder="Session"
                  disabled
                />
                <FormHelperText style={{ color: "red" }}>
                  {errors?.Session?.message}
                </FormHelperText>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginTop: "10px", fontSize: "1rem" }}
                >
                  Category
                </Typography>
                <FormControl
                  sx={{
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  variant="outlined"
                  // margin="normal"
                  error={!!errors.Category?.message}
                >
                  <TextField
                    value={userProfile?.academic_information?.category}
                    disabled
                    variant="standard"
                    placeholder="Category"
                  />
                </FormControl>
                <br />

                <FormControlLabel
                  control={
                    <Checkbox name="checkbox" {...register("checkbox")} />
                  }
                  sx={{ marginTop: "15px" }}
                  label="I declare that all these information are correct and I have no dues in any department/section as per my knowledge."
                />
                {errors.checkbox && (
                  <FormHelperText error>
                    {errors.checkbox.message}
                  </FormHelperText>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    marginTop: "15px",
                    backgroundColor: "rgb(107, 169, 169)",
                    color: "#fff",
                    borderRadius: "20px",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                    width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                >
                  Send Request
                </Button>
              </form>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sm={12}
            sx={{
              display: { xs: "none", md: "block", lg: "block", sm: "none" },
            }}
          >
            <Box sx={{ marginTop: { lg: "0%", md: "15%" } }}>
              <img
                src="../images/noDues1.png"
                alt=""
                style={{ width: "50%", marginLeft: "10%", marginTop: "20%",maxHeight:"44rem",borderRadius:"20px" }}
              />
            </Box>
          </Grid>
        </Grid>

        {responsive && (
          <Box>
            <div style={{ marginTop: "25px" }}>
              <Divider sx={{ width: "90vw" }} />
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "1.2rem",
                }}
              >
                Previous Requests
              </p>
              <center>
                <Divider
                  sx={{
                    backgroundColor: "blue",
                    width: { lg: "22%", xs: "50%", md: "10%" },
                    fontWeight: "800",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                />
              </center>
            </div>
          </Box>
        )}
        {result.length === 0 && (
          <center>
            <Box sx={{ display: { lg: "none", md: "none", sm: "none" } }}>
              <img
                src="./images/No_data.png"
                alt=""
                style={{ width: "250px", borderRadius: "10px" }}
              />
            </Box>
          </center>
        )}
        {responsive ? (
          result.length > 0 &&
          result.map((data, index) => (
            <Box
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "100%",
                marginTop: "20px",
              }}
            >
             <Card
      variant="outlined"
      sx={{
        minWidth: 275,
        width: "80vw",
        marginBottom: 3,
        backgroundColor: "rgb(243, 244, 246)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        borderRadius: 2, // Rounded corners for a modern look
        padding: 2, // Added padding for a more spacious feel
        transition: "transform 0.2s ease-in-out", // Smooth hover effect
        "&:hover": {
          transform: "scale(1.02)", // Slightly enlarges on hover
        },
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 1,
            color: "text.primary",
          }}
          gutterBottom
        >
          Request Details
        </Typography>

        <Box mb={1.0}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16 }}>
            <b>Registration Number:</b> {data?.registration_number}
          </Typography>
        </Box>

        <Box mb={1.0}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16 }}>
            <b>Name:</b> {data?.name}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16 }}>
            <b>Status:</b> {data?.status}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  
            </Box>
          ))
        ) : (
          <Grid container>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              sx={{
                display: { xs: "none", sm: "block", md: "block", lg: "block" },
              }}
            >
              <Box sx={{ marginTop: 5 }}>
                {/* <Divider style={{ fontWeight: "bold" }} /> */}

                <p
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "1.3rem",
                  }}
                >
                  Previous Requests
                </p>
                <center>
                <Divider
                  sx={{
                    backgroundColor: "blue",
                    width: { lg: "7%", xs: "50%", md: "10%" },
                    fontWeight: "800",
                    textAlign: "center",
                    marginTop: "2px",
                    marginBottom:"10px"
                  }}
                />
              </center>

                {result.length > 0 ? (
                  <center>
                    <TableContainer
                      sx={{
                        border: "none",
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderRight: 0,
                        borderBottom: 0,
                        marginBottom:"30px"
                      }}
                    >
                      <Table
                        sx={{
                          minWidth: 500,
                          maxWidth: 900,
                          borderRight: 0,
                          "&:last-child td, &:last-child th": { border: 0 },
                          border: 0,
                          borderBottom: 0,
                        }}
                        aria-label="custom pagination table"
                      >
                        <TableHead style={{ backgroundColor: "#545959" }}>
                          <TableRow>
                            <TableCell
                              align="center"
                              sx={{
                                color: "white",
                              }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                color: "white",
                              }}
                            >
                              {" "}
                              Registration Number
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                color: "white",
                              }}
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                            ? result.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                            : result
                          ).map((row) => (
                            <TableRow key={row.name}>
                              <TableCell
                                component="th"
                                style={{ width: 160 }}
                                scope="row"
                                align="center"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell align="center" style={{ width: 160 }}>
                                {row.registration_number}
                              </TableCell>
                              <TableCell style={{ width: 160 }} align="center">
                                {row.status}
                              </TableCell>
                            </TableRow>
                          ))}

                          {result.length === 0 && (
                            <TableRow style={{ height: 53 * rowsPerPage }}>
                              <TableCell colSpan={6}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  align="center"
                                >
                                  No request history available.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter style={{ backgroundColor: "#545959" }}>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              colSpan={6}
                              count={result.length}
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
                  </center>
                ) : (
                  <Typography
                    style={{
                      marginBottom: "50px",
                      marginTop: "100px",
                      fontSize: "1.2rem",
                      textAlign: "center",
                    }}
                  >
                    {result.length === 0 && (
                      <center>
                        <Box
                          sx={{
                            display: {
                              lg: "block",
                              md: "block",
                              sm: "block",
                              xs: "none",
                            },
                          }}
                        >
                          <img
                            src="./images/semester_no_data.png"
                            alt=""
                            style={{ width: "250px", borderRadius: "10px" }}
                          />
                        </Box>
                      </center>
                    )}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Footer />
    </div>
  );
}

export default NoDuesForDegree;
