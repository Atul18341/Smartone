import * as React from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Header } from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { Url } from "../components/BaseUrl";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import {
  AddLocationAltOutlined,
  BusinessCenterOutlined,
  CloudUpload,
  DateRangeOutlined,
  EmailOutlined,
  PersonPinCircleOutlined,
  PersonPinCircleSharp,
  PhoneAndroidOutlined,
  QrCode2Outlined,
} from "@mui/icons-material";


export const Contact = () => {
  const [imageIndex, setImageIndex] = React.useState(0);
  const images = React.useMemo(() => ["contactUs.jpg", "contactUs1.jpg"], []);
  const [url, setUrl] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    college_name: "",
    college_address: "",
    phone_number: "",
    principal_name: "",
    established_date: "",
    college_logo: "",
    college_code: "",
  });

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "established_date") {
      formattedValue = new Date(value).toISOString().split("T")[0];
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      college_logo: e?.target?.files[0],
    });
    if (e.target.files[0]) {
      const imageUrl = URL?.createObjectURL(e?.target?.files[0]);
      setUrl(imageUrl);
    } else {
      setUrl("");
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (
      formData.name !== "" &&
      formData.email !== "" &&
      formData.college_name !== "" &&
      formData.college_address !== "" &&
      formData.phone_number !== "" &&
      formData.established_date !== "" &&
      formData.college_logo !== "" &&
      formData.principal_name !== "" &&
      formData.college_code !== ""
    ) {
      let data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("college_name", formData.college_name);
      data.append("college_address", formData.college_address);
      data.append("established_date", formData.established_date);
      data.append("phone_number", formData.phone_number);
      data.append("principal_name", formData.principal_name);
      data.append("college_code", formData.college_code);
      data.append("college_logo", formData.college_logo);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${Url}/college-requests/`,
        headers: {},
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          setLoading(false);
          enqueueSnackbar("An email will be sent after the verification is completed by the admin.", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 5000,
          });

          navigate("/");
        })
        .catch((error) => {
          setLoading(false);
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
        });
    } else {
      setLoading(false);
      enqueueSnackbar("Please fill all the fields", {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544006659-f0b21884ce1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          paddingTop: { lg: "2vw", xs: "25vh", md: "2vw", sm: "5vw" },
          paddingBottom: { lg: "15vw", xs: "20vh", md: "15vw" },
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
              Service Request form
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
              Want to use our platform? Fill the below service request form and
              our team will connect with you as soon as possible.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <div>
        <Container maxWidth="lg" sx={{ py: 3, marginBottom: "100px" }}>
          <p
            style={{
              fontSize: "1.6rem",
              textAlign: "center",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            Service Request form
          </p>
          <center>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "20%", xs: "30%", md: "10%", sm: "15%" },
                fontWeight: "800",
                textAlign: "center",
                marginTop: "5px",
                marginBottom: "40px",
              }}
            />
          </center>
          <Grid
            container
            spacing={7}
            sx={{ padding: { md: "55px", lg: "55px", sm: "55px" } }}
          >
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                backgroundImage: "url(../images/contactUs.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                marginTop: "50px",
                display: { xs: "none", sm: "none", lg: "block", md: "block" },
              }}
            ></Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ py: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="standard"
                  placeholder="Name..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonPinCircleOutlined />
                      </InputAdornment>
                    ),
                  }}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  variant="standard"
                  placeholder="Email..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="College Name"
                  margin="normal"
                  variant="standard"
                  placeholder="College Name..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessCenterOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="College Address"
                  margin="normal"
                  variant="standard"
                  placeholder="College Address..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="college_address"
                  value={formData.college_address}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AddLocationAltOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="College Code"
                  margin="normal"
                  variant="standard"
                  placeholder="College Code..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="college_code"
                  value={formData.college_code}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QrCode2Outlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  type="number"
                  fullWidth
                  label="Phone Number"
                  placeholder="Phone Number"
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroidOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="Principal Name"
                  margin="normal"
                  variant="standard"
                  placeholder="Principal Name..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="principal_name"
                  value={formData.principal_name}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonPinCircleSharp />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1 }}>
                <TextField
                  type="date"
                  fullWidth
                  label="Established Date"
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="established_date"
                  value={formData.established_date}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ py: 1,display:"flex",gap:"9px" }}>
                <span style={{marginTop:"20px"}}>College logo: </span>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(107,169,169,1) 0%, rgba(85,136,136,1) 100%)",
                    width: { lg: "35%", md: "50%", xs: "50%", sm: "50%" },
                    marginTop: { xs: "10px", lg: "10px" },
                    marginBottom: "20px",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, rgba(85,136,136,1) 0%, rgba(107,169,169,1) 100%)",
                      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CloudUpload sx={{ fontSize: "20px" }} />
                    <span>Upload</span>
                  </Box>
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                <br />
               
              </Box>
              {url && (
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: "150px",
                      marginTop: "10px",
                      borderRadius: "10px",
                    }}
                  />
                )}
              <center>
                <Button
                  variant="contained"
                  sx={{
                    width: {lg:"70%",xs:"100%"},
                    backgroundColor: "rgb(107, 169, 169)",
                    "&:hover": { backgroundColor: "rgb(85, 136, 136)" },
                    borderRadius: "20px",
                    marginTop: "20px",
                  }}
                  onClick={handleSubmit}
                >
                  {!loading && <Typography variant="body2" sx={{
                    fontSize:{lg:"14px",sm:"",xs:"12px"},
                    padding:"4px"
                  }}>Request For Service/Platform Use</Typography>}
                  {loading && (
                    <CircularProgress
                      style={{ color: "white", width: "20px", height: "22px" }}
                    />
                  )}
                </Button>
              </center>
            </Grid>
          </Grid>
        </Container>

        <Box
          sx={{ display: { lg: "block", md: "block", sm: "none", xs: "none" } }}
        >
          <center>
            <Typography variant="h4" mb={2} className="header">
              Get in touch
            </Typography>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "10vw", xs: "70vw", md: "40vw" },
                fontWeight: "700",
              }}
            />
          </center>
          <Box my={2} sx={{ padding: "20px" }}>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              {/* Email Section */}
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <MdEmail />
                    <Box>Email</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  lyssstartup24@gmail.com
                </Typography>
              </Grid>

              {/* Phone Section */}
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <MdPhone />
                    <Box>Phone</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  +91 6205695667
                </Typography>
              </Grid>

              {/* Address Section */}
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <MdLocationOn />
                    <Box>Address</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  3/365, Aryan Bhawan
                  <br />
                  Lakho Binda Campus, Santunagar,
                  <br />
                  Madhubani (Bihar)-India
                  <br />
                  Pin-847211
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{ display: { lg: "none", md: "none", sm: "block", xs: "block" } }}
        >
          {/* <center> */}
          <Box sx={{ padding: "10px" }}>
            <Typography
              variant="p"
              mb={2}
              style={{
                marginLeft: "20px",
                fontSize: "2.0rem",
                marginBottom: "10px",
              }}
            >
              Get in touch
            </Typography>
            <Divider
              sx={{
                backgroundColor: "blue",
                width: { lg: "10vw", xs: "60vw", md: "40vw" },
                fontWeight: "700",
                marginLeft: "15px",
                marginTop: "10px",
              }}
            />
          </Box>

          <Box my={2} sx={{ padding: "24px" }}>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <MdEmail />
                    <Box style={{ fontSize: "1.2rem" }}>Email</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  lyssstartup24@gmail.com
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <MdPhone />
                    <Box style={{ fontSize: "1.2rem" }}>Phone</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  +91 6205695667
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="textPrimary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <MdLocationOn />
                    <Box style={{ fontSize: "1.2rem" }}>Address</Box>
                  </Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  3/365, Aryan Bhawan
                  <br />
                  Lakho Binda Campus, Santunagar,
                  <br />
                  Madhubani (Bihar)-India
                  <br />
                  Pin-847211
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
