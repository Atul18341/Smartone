import { yupResolver } from "@hookform/resolvers/yup";
import {  useForm } from "react-hook-form";
import * as yup from "yup";
import NavbarNew from "../components/NavbarNew";
import {
  Box,
  Button,
  
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
  MenuItem,
  Select,
  InputLabel,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { BaseUrl, Url } from "../components/BaseUrl";

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
  
 
});

// Component
export const HostelRoomRequest = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState(null);
  const [file, setFile] = useState("");
  const [result, setResult] = useState([]);
  const [allotedRoom, setAllotedRoom] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [responsive, setResponsive] = useState(window.innerWidth < 669);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [RoomType,setRoomType]=useState("");
  const [hide,setHide]=useState(false);
  
  
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

  const message="Room-type is required";

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accesstoken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    if (
      decodedToken.exp < Math.floor(Date.now() / 1000) ||
      (decodedToken.role !== "student" && decodedToken.role !== "super-admin")
    ) {
      navigate("/login");
    }

    const fetchData = async () => {
      const token = sessionStorage.getItem("accesstoken");
      const token1 = sessionStorage.getItem("refreshtoken");

      if (token && token1) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BaseUrl}/${
            jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
          }/hostel-allotments/?search=${
            jwtDecode(sessionStorage?.getItem("accesstoken"))
              ?.registration_number
          }`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        axios
          .request(config)
          .then((response) => {
            setLoading(false);
            setResult(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        axios.get(
          `${Url}/${
            jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
          }/hostel-room-allotments/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ).then(response=>{
          console.log(response.data);
          setAllotedRoom(response?.data?.[0]?.hostel_room?.room_no);
        }).catch(error=>{
          console.log(error);

        })

       
       
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

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
    setFile(file);
    setValue("file", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    
    const acceptedFormats = ["image/jpeg", "image/png", "image/jpg"];

    if (data?.file?.length === 0) {
      return enqueueSnackbar("Marksheet field is empty", { variant: "error" });
    }

    console.log(RoomType);

    if(RoomType==="")
    {
      setHide(true);
      return;
    }

    if (!acceptedFormats.includes(data.file?.type)) {
      return enqueueSnackbar("Only jpeg, png, jpg files are supported", {
        variant: "error",
      });
    }
 
   

    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    console.log(
      jwtDecode(sessionStorage?.getItem("accesstoken"))?.registration_number
    );

    if (token && token1) {

      setLoading1(true);
      const formData = new FormData();
      formData.append(
        "registration_number",
        jwtDecode(sessionStorage?.getItem("accesstoken"))?.registration_number
      );
      console.log(file);
      formData.append("status", "pending");
      formData.append("cgpa", data.cgpa);
      // formData.append("latest_marksheet", file);
      formData.append("prefered_room_type", RoomType);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${Url}/${
            jwtDecode(sessionStorage?.getItem("accesstoken"))?.college
          }/hostel-allotments/`,
          headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
              },
        data: formData,
      };
      axios
      .request(config)
        .then((response) => {
          setHide(false);
          setRoomType("");
          console.log(response);
          setResult([
            ...result,
            {
              status: "pending",
              allotedRoom: [
                {
                  hostel_room: "not alloted by now",
                },
              ],
            },
          ]);
          enqueueSnackbar("Hostel allotment request is successfull", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });

          setLoading1(false);
          reset({
            RoomType:""
          });
          setValue("RoomType","");
          setValue("cgpa","");
          setPreviewUrl("");
          setName("");
        })
        .catch((error) => {
          setHide(false);
          setRoomType("");
          setLoading1(false);
          console.log(error);
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
          if (error?.response?.data?.errors?.non_field_errors?.[0]) {
            enqueueSnackbar(
              error?.response?.data?.errors?.non_field_errors?.[0],
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
          reset({
            RoomType:""
          });
  
          setValue("RoomType","");
          setValue("cgpa","");
          setPreviewUrl("");
          setName("");
        });

    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid">
      <NavbarNew />

      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(../images/banner8.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          paddingTop: "2vw",
          paddingBottom: "15vw",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay with opacity
            zIndex: 1,
          },
        }}
      >
        <Grid
          container
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            padding: { xs: "20px", sm: "20px", md: "50px" },
          }}
        >
          <Grid item xs={12} sm={12} lg={6} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.4rem",
                  md: "2.6rem",
                  lg: "2.6rem",
                },
                marginTop: { xs: "20px", md: "80px" },
                fontWeight: "bold",
              }}
            >
              Hostel Room Request
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.2rem",
                  lg: "1.2rem",
                },
                marginTop: "10px",
                fontWeight: "500",
                padding: { xs: "10px", sm: "10px", md: "0px" },
              }}
            >
             Efficiently manage hostel room requests by prioritizing student preferences and needs. Customize room assignments to ensure optimal accommodation and a smooth living experience.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <Box className="bonafide-form" sx={{ borderRadius: 3, padding: 0 }}>
        <Typography
          variant="p"
          align="center"
          gutterBottom
          sx={{ fontSize: 25, marginTop: "20px" }}
        >
          Hostel Room Allotment Request
        </Typography>
        <center style={{width:"100%"}}>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "7%", xs: "30%", md: "10%" },
                fontWeight: "800",
                textAlign: "center",
                marginTop: "5px",
              }}
            />
          </center>
        <Grid container sx={{ padding: { lg: 5, md: 5, xs: 1, sm: 1 } }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            sx={{
              padding: { lg: 3 },
              position: "relative",
              top: { lg: "-20px" },
            }}
          >
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
                  backgroundColor: {
                    xs: "rgb(243 244 246)",
                    lg: "transparent",
                  },
                  padding: { lg: "45px", md: "35px", xs: "20px", sm: "20px" },
                  marginTop: { lg: "5px", md: "42px", xs: "29px", sm: "29px" },
                  marginLeft: { lg: "42px", md: "42px", xs: "0px", sm: "0px" },
                  borderRadius: "15px",
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Typography variant="p" style={{ fontSize: "1.1rem" }}>
                      Registration / Employee Number
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ marginBottom: "10px", marginTop: "5px" }}
                    >
                      {
                        jwtDecode(sessionStorage?.getItem("accesstoken"))
                          ?.registration_number
                      }
                    </Typography>
                  </FormControl>

                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors?.cgpa?.message}
                  >
                    <TextField
                      label="Current CGPA"
                      variant="standard"
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
                    
                    variant="standard"
                    margin="normal"
                    error={!!errors.RoomType?.message}
                  >
                    <InputLabel id="numberOfPersons-label">
                     Room Type
                    </InputLabel>
                
                        <Select
                          labelId="numberOfPersons-label"
                          id="RoomType"
                          label="Room Type"
                          onChange={(e)=>setRoomType(e.target.value)}
                          value={RoomType}
                          sx={{
                            width: {
                              lg: "70%",
                              md: "70%",
                              xs: "100%",
                              sm: "90%",
                            },
                          }}
                        >
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="double">Double</MenuItem>
                          <MenuItem value="triple">Triple</MenuItem>
                        </Select>
                      
                    {hide && (
                      <FormHelperText sx={{color:"red"}}>{message}</FormHelperText>
                    )}
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
                      <Typography
                        variant="p"a
                        gutterBottom
                        style={{ fontSize: "1.1rem" }}
                      >
                        Latest Semester Marksheet
                      </Typography>
                      <br />
                      <Button
                        component="label"
                        variant="contained"
                        sx={{
                          backgroundColor: "rgb(107, 169, 169)",
                          color: "#fff",
                          "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                          borderRadius:"20px",
                          width: {
                            lg: "70%",
                            md: "70%",
                            xs: "100%",
                            sm: "90%",
                          },
                          marginTop: "10px",
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
                      marginBottom: 2,
                      backgroundColor: "rgb(107, 169, 169)",
                      color: "#fff",
                      borderRadius:"20px",
                      "&:hover": { backgroundColor: "rgb(85, 136, 136)" },

                      width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                    }}
                  >
                    {!loading1 && <p>Send Request</p>}
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
                </form>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Box>
             
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  marginTop: "60px",
                  fontSize: "1.3rem",
                }}
              >
                Previous Hostel Requests
              </p>

              <center>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "17%", xs: "30%", md: "10%",sm:"15%" },
                fontWeight: "800",
                textAlign: "center",
                marginTop: "5px",
                marginBottom:"30px"
              }}
            />
          </center>
              
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems:"center"
                }}
              >
                {result.length === 0 && (
                  <Typography
                    variant="body1"
                    sx={{
                      marginTop: 3,
                      textAlign: "center",
                      display: {
                        lg: "none",
                        md: "none",
                        xs: "block",
                        sm: "none",
                      },
                    }}
                  >
                    <center>
                    <img
                    src="./images/semester_no_data.png"
                    alt=""
                    style={{
                      width: "280px",
                    }}
                  />
                    </center>
                  </Typography>
                )}

                {responsive ? (
                  result.length > 0 &&
                  result.map((data, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        width: 296,
                        marginBottom: 5,
                        backgroundColor: "rgb(243 244 246)",
                        marginLeft: "20px",
                        padding: 1,
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{ fontSize: 16 }}
                          color="text.secondary"
                          gutterBottom
                          variant="p"
                        >
                          Previous Request Details
                        </Typography>
                        <br />
                        <Typography
                          variant="p"
                          color="text.secondary"
                          sx={{ fontSize: 15 }}
                        >
                          <b>Status:</b> {data?.status}
                        </Typography>
                        <br />
                        <Typography
                          variant="p"
                          color="text.secondary"
                          sx={{ fontSize: 15 }}
                        >
                          <b>Alloted Room No: </b>
                          {allotedRoom? (
                            <Typography variant="body2" color="text.secondary">
                              {" "}
                              {allotedRoom?.[0]?.hostel_room}
                            </Typography>
                          ) : (
                            <span>Not alloted by now.</span>
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : result.length === 0 ? (
                  <>
                    <center>
                    <img
                    src="./images/semester_no_data.png"
                    alt=""
                    style={{
                      width: "280px",
                      marginTop:"30px"
                    }}
                  />
                    </center>
                  </>
                ) : (
                  <TableContainer component={Paper} sx={{ marginTop: 3,border: "none",marginBottom:"50px",
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderRight: 0,
                    borderBottom: 0, }}>
                    <Table
                      sx={{ minWidth: 650, "&:last-child td, &:last-child th": { border: 0 },
                      border: 0,
                      borderBottom: 0, }}
                      aria-label="previous hostel requests"
                      style={{ textAlign: "center" }}
                    >
                      <TableHead style={{ backgroundColor: "#545959" }}>
                        <TableRow>
                          <TableCell style={{ textAlign: "center",color: "white", }}>
                            Status
                          </TableCell>

                          <TableCell style={{ textAlign: "center",color: "white", }}>
                            Alloted Room
                          </TableCell>
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
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "rgb(243 244 246)",
                                }}
                              >
                                {data?.status}
                              </TableCell>

                              <TableCell
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "rgb(243 244 246)",
                                }}
                              >
                                {allotedRoom ? (
                                  <Typography
                                    variant="p"
                                    color="text.secondary"
                                  >
                                    {" "}
                                    {allotedRoom}
                                  </Typography>
                                ) : (
                                  <p>Not alloted by now.</p>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
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
