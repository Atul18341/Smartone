import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  TableHead,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NavbarNew from "../components/NavbarNew";
import {Footer} from "../components/Footer";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../components/BaseUrl";

// Validation schema
const schema = yup.object().shape({
  purpose: yup.string().required("Purpose is required"),
  file: yup
    .mixed()
    .required("File is required")
    .test("fileType", "Only image files are allowed", (value) => {
      return (
        value &&
        value.length > 0 &&
        ["image/jpeg", "image/png"].includes(value[0].type)
      );
    }),
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

export const BonafideForm = () => {
  const [result, setResult] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [responsive, setResponsive] = useState(
    window.innerWidth < 669 ? true : false
  );

  
  const regenerateToken = () => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(localStorage?.getItem("refreshtoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response1.exp < Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      } else {
        if (
          localStorage.getItem("refreshtoken") &&
          localStorage.getItem("accesstoken")
        ) {
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
      setResponsive(window.innerWidth < 684 ? true : false);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  useEffect(() => {

    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "student"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {

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

    if (token && token1) {
    axios
      .get(
        `${BaseUrl}/bonafide/?search=${
          jwtDecode(localStorage?.getItem("accesstoken"))?.registration_number
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setResult(response.data.reverse());
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      navigate('/login');
    }
  }, []);

  const onSubmit = (data) => {

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
    const formData = new FormData();
    formData.append("college", "1");
    formData.append(
      "student",
      localStorage?.getItem("accesstoken") === null
        ? null
        : jwtDecode(localStorage?.getItem("accesstoken")).user_id
    );
    formData.append(
      "roll_no",
      localStorage?.getItem("accesstoken") === null
        ? null
        : jwtDecode(localStorage?.getItem("accesstoken")).user_id
    );
    formData.append("status", "pending");
    formData.append("supporting_document", data.file[0]);
    formData.append("fee_structure", "true");
    formData.append("required_for", data.purpose);

    axios
      .post(`${BaseUrl}/bonafide/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
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
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
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
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setName(file.name);
    setValue("file", [file]);
    setPreviewUrl(URL.createObjectURL(file));
    await trigger("file");
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - result.length) : 0;

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
        sx={{ borderRadius: 3, padding: 1 ,marginTop:3 }}
      >
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <center><p style={{fontSize:'1.2rem'}}>Bonafide Certificate Request</p></center>

            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
              }}
            >
              <Box
                sx={{
                  marginTop: { lg: "5%", md: "15%" },
                }}
              >
                <center>
                <img
                  src="./images/Bonafide.png"
                  alt=""
                  style={{ width: "55%",marginTop:"20px"}}
                />
                </center>
              </Box>
            </Grid>
            <Box
              sx={{
                backgroundColor: {xs:"rgb(243 244 246)",lg:"transparent"},
                padding: {lg:"45px",md:"35px",xs:"20px",sm:"20px"},
                marginTop: {lg:"42px",md:"42px",xs:"29px",sm:"29px"},
                marginLeft: {lg:"42px",md:"42px",xs:"0px",sm:"0px"},
                borderRadius: "15px"
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <p style={{fontSize:"1.2rem",marginBottom:"10px"}}>
                  Purpose
                </p>
                <FormControl
                 
                  sx={{
                    width: { lg: "86%", md: "70%", xs: "100%", sm: "90%" },
                  }}
                  variant="outlined"
                  error={!!errors.purpose?.message}
                >
                  <InputLabel id="purpose-label">Select Purpose</InputLabel>
                  <Controller
                    name="purpose"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="Select Purpose">
                        <MenuItem value="credit card">
                          Apply for student credit card
                        </MenuItem>
                        <MenuItem value="scholarship">
                          Apply for Scholarship
                        </MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.purpose && (
                    <FormHelperText>{errors.purpose.message}</FormHelperText>
                  )}
                </FormControl>
                <br />

                <FormControl
                  error={!!errors.file?.message}
                  sx={{ marginTop: 2 }}
                >
                  <p style={{fontSize:"1.2rem",marginBottom:"10px"}}>
                    Supporting Document
                  </p>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: "rgb(107, 169, 169)",
                      color: "#fff",
                      "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      {...register("file")}
                      onChange={handleFileChange}
                    />
                    Upload File
                  </Button>
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
                      <p>{name}</p>
                    </Box>
                  )}
                  {errors.file && (
                    <FormHelperText>{errors.file.message}</FormHelperText>
                  )}
                </FormControl>
                <p style={{fontSize:"1.2rem",marginBottom:"10px",marginTop:"10px"}}>
                  Do you want fee structure also?
                </p>
                <Box
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input type="radio" name="option" value="yes" />
                    <span>Yes</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input type="radio" name="option" value="no" />
                    <span>No</span>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    marginTop: "5px",
                    backgroundColor: "rgb(107, 169, 169)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                    width: { lg: "80%", md: "70%", xs: "100%", sm: "90%" },
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
            <Box
              sx={{
                marginTop: { lg: "2%", md: "15%" },
              }}
            >
              <img
                src="./images/Bonafide.png"
                alt=""
                style={{ width: "50%", marginLeft: "15%",marginTop:"5%" }}
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
                Previous Records
              </p>
            </div>
          </Box>
        )}
        {responsive ? (
          result.length > 0 ? (
            result.map((data, index) => (
              <Box key={index}>
                <Card
                  // variant="outline"
                  sx={{
                    minWidth: 295,
                    marginBottom: 2,
                    backgroundColor:"rgb(243 244 246)",
                    marginTop: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Bonafide Details
                    </Typography>
                    <Typography variant="p" component="div">
                      Bonafide Number: {data?.bonafide_number}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Student Information
                    </Typography>
                    <Typography variant="body2">
                      Applied For: {data?.required_for}
                    </Typography>
                    <Typography variant="body2">
                      Status: {data?.status}
                    </Typography>
                    <Typography variant="body2">
                      Applied Date: {data?.applied_date}
                    </Typography>
                    {data?.status === "approved" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={(e) => navigate("/bonafideCertificate")}
                        style={{ marginTop: "10px" }}
                      >
                        View
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <center>
              <img
                src="./images/No_data.png"
                alt=""
                style={{
                  width: "320px",
                  borderRadius: "10px",
                  marginTop: "30px",
                }}
              />
            </center>
          )
        ) : (
          <Grid container>
            <Grid
              item
              lg={6}
             
              sx={{
                display: { xs: "none", sm: "none", md: "none", lg: "block" },
              }}
            ></Grid>
            <Grid
              item
              lg={6}
              md={12}
              sm={12}
              sx={{
                display: { xs: "none", sm: "block", md: "block", lg: "block" },
              }}
            >
              <Box sx={{ marginTop: 5 }}>
                <Divider style={{ fontWeight: "bold" }} />

                <p
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {" "}
                  Previous Records
                </p>
                {result.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    sx={{ marginTop: 3, borderRadius: "10px" }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="bonafide table">
                      <TableHead style={{ backgroundColor: "#D2E9E9" }}>
                        <TableRow>
                          <TableCell>Bonafide Number</TableCell>
                          <TableCell>Applied For</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Applied Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? result.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : result
                        ).map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.bonafide_number}</TableCell>
                            <TableCell>{data.required_for}</TableCell>
                            <TableCell>{data.status}</TableCell>
                            <TableCell>{data.applied_date}</TableCell>
                            <TableCell>
                              {data.status === "approved" ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    navigate("/bonafideCertificate")
                                  }
                                >
                                  View
                                </Button>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  N/A
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
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
                            colSpan={5}
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
                ) : (
                  <center>
                    <img
                      src="./images/No_data.png"
                      alt=""
                      style={{
                        width: "320px",
                        borderRadius: "10px",
                        marginTop: "30px",
                      }}
                    />
                  </center>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      <Footer />
    </div>
  );
};

export default BonafideForm;
