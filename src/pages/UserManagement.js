import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import { Url } from "../components/BaseUrl";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { enqueueSnackbar } from "notistack";

export const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [load1, setload1] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hide, setHide] = useState(false);
  const [delete1, setDelete1] = useState(false);
  const [load, setLoad] = useState(false);
  const [editInfo, setEditInfo] = useState({
    registration_number: "",
    role: "",
    id: "",
    branch: "",
  });
  const [deleteInfo, setDeleteInfo] = useState({
    id: "",
  });

  const branches = [
    { name: "Computer Science and Engineering", abbreviation: "CSE" },
    { name: "Mechanical Engineering", abbreviation: "ME" },
    { name: "Electrical Engineering", abbreviation: "EE" },
    { name: "Civil Engineering", abbreviation: "CE" },
    { name: "Electronics and Communication Engineering", abbreviation: "ECE" },
    { name: "Chemical Engineering", abbreviation: "CHE" },
    { name: "Information Technology", abbreviation: "IT" },
    { name: "Biomedical Engineering", abbreviation: "BME" },
    { name: "Aeronautical Engineering", abbreviation: "AE" },
    { name: "Automobile Engineering", abbreviation: "AU" },
    { name: "Biotechnology Engineering", abbreviation: "BT" },
    { name: "Industrial Engineering", abbreviation: "IE" },
    { name: "Environmental Engineering", abbreviation: "EN" },
    { name: "Petroleum Engineering", abbreviation: "PE" },
    { name: "Instrumentation Engineering", abbreviation: "IE" },
    { name: "Agricultural Engineering", abbreviation: "AG" },
    { name: "Mining Engineering", abbreviation: "MN" },
    { name: "Marine Engineering", abbreviation: "MRE" },
    { name: "Textile Engineering", abbreviation: "TE" },
    { name: "Food Technology", abbreviation: "FT" },
    { name: "Production Engineering", abbreviation: "PR" },
    { name: "Metallurgical Engineering", abbreviation: "MT" },
    { name: "Polymer Engineering", abbreviation: "PM" },
    { name: "Naval Architecture", abbreviation: "NA" },
    { name: "Power Engineering", abbreviation: "PW" },
    { name: "Robotics Engineering", abbreviation: "RE" },
    { name: "Software Engineering", abbreviation: "SE" },
    { name: "Geological Engineering", abbreviation: "GE" },
    { name: "Structural Engineering", abbreviation: "ST" },
    { name: "Mechatronics Engineering", abbreviation: "MTX" },
    { name: "Aerospace Engineering", abbreviation: "ASP" },
    { name: "Marine Technology", abbreviation: "MRT" },
    { name: "Nano Engineering", abbreviation: "NE" },
    { name: "Materials Science and Engineering", abbreviation: "MSE" },
    { name: "Telecommunication Engineering", abbreviation: "TCE" },
    { name: "Nuclear Engineering", abbreviation: "NE" },
    { name: "Optical Engineering", abbreviation: "OE" },
    { name: "Automotive Engineering", abbreviation: "AUE" },
    { name: "Systems Engineering", abbreviation: "SYE" },
    { name: "Renewable Energy Engineering", abbreviation: "REE" },
    { name: "Biochemical Engineering", abbreviation: "BCE" },
    { name: "Mining and Mineral Engineering", abbreviation: "MME" },
    { name: "Safety Engineering", abbreviation: "SE" },
    { name: "Corrosion Engineering", abbreviation: "CE" },
    { name: "Plastics Engineering", abbreviation: "PLE" },
    { name: "Petrochemical Engineering", abbreviation: "PCE" },
    { name: "Energy Engineering", abbreviation: "EE" },
    { name: "Computer Science and Business Systems", abbreviation: "CSBS" },
  ];

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
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
    axios
      .get(
        `${Url}/${
          jwtDecode(sessionStorage.getItem("accesstoken")).college
        }/user-management/`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
          },
        }
      )
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
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
    }else{
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken") && sessionStorage?.getItem("refreshtoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "office"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleEdit = (registration_number, role, id) => {
    setEdit(true);
    setEditInfo({ registration_number, role, id });
  };

  const handleDelete1 = (id) => {
    setDelete1(true);
    setDeleteInfo({ id });
  };
  const handleDelete = () => {
    setLoad(true);
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

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

      axios
        .delete(
          `${Url}/${
            jwtDecode(sessionStorage.getItem("accesstoken")).college
          }/user-management/${deleteInfo.id}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        )
        .then((res) => {
          setLoad(false);
          setDelete1(false);
          setUsers(users.filter((prev) => prev.id !== deleteInfo.id));
        })
        .catch((error) => {
          console.log(error);
          setLoad(false);
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

  const handleUpdate = (id) => {
    setload1(true);
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

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
      if (
        editInfo.role !== "office" &&
        editInfo.role !== "caretaker" &&
        editInfo.role !== "student" &&
        editInfo.role !== "hod" &&
        editInfo.role !== "faculty" &&
        editInfo.role !== "staff" &&
        editInfo.role !== "registrar"
      ) {
        setHide(true);
        return;
      } else {
        setHide(false);
      }
      axios
        .patch(
          `${Url}/${
            jwtDecode(sessionStorage.getItem("accesstoken")).college
          }/user-management/${id}/`,
          {
            role: editInfo.role,
            branch: editInfo.branch,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        )
        .then((res) => {
          setUsers((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, role: editInfo.role } : item
            )
          );
          setload1(false);

          enqueueSnackbar("Successfully updated.", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
          setEdit(false);
        })
        .catch((error) => {
          setload1(false);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  console.log(editInfo);
  return (
    <Box>
      <NavbarNew />

      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544006659-f0b21884ce1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
              User Management
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
              Efficiently manage your users by prioritizing their roles and responsibilities. Customize their roles as needed to ensure optimal organization and performance.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <Box sx={{ minHeight: "80vh", padding: "5px" }}>
        {edit && (
          <center>
            <Box
              sx={{
                padding: "20px",
                width: "300px",
                position: "fixed",
                top: "15vh",
                zIndex: "100",
                left: { xs: "5vw", md: "40vw", lg: "45vw", sm: "25vw" },
                backgroundColor: "white", // Optional: to make it visible on the page
                boxShadow: 7, // Optional: adds shadow
                borderRadius: "8px", // Optional: rounded corners
              }}
            >
              <center
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h3 style={{ position: "relative", left: "90px" }}>
                  Edit Info
                </h3>
                <RxCross1
                  style={{ cursor: "pointer" }}
                  onClick={(e) => setEdit(false)}
                />
              </center>

              <TextField
                type="text"
                defaultValue={editInfo.registration_number}
                label="Registration no."
                disabled
                margin="normal"
                fullWidth
              />

              <TextField
                type="text"
                label="Role"
                defaultValue={editInfo.role}
                margin="normal"
                fullWidth
                onChange={(e) =>
                  setEditInfo({
                    ...editInfo,
                    role: e.target.value,
                  })
                }
              />

              {editInfo.role === "hod" && (
                <Select
                  fullWidth
                  value={editInfo.branch || ""}
                  onChange={(e) =>
                    setEditInfo({
                      ...editInfo,
                      branch: e.target.value,
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Branch
                  </MenuItem>
                  {branches.map((branch) => (
                    <MenuItem
                      key={branch.abbreviation}
                      value={branch.abbreviation}
                    >
                      {branch.abbreviation}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {hide && (
                <p style={{ color: "red", fontSize: "0.67rem" }}>
                  * Role must be between
                  office,caretaker,student,hod,faculty,staff,registrar .{" "}
                </p>
              )}
              <Button
                variant="contained"
                sx={{ width: "70%", marginTop: "15px", borderRadius:"20px", }}
                onClick={(e) => handleUpdate(editInfo.id)}
              >
                {!load1 && <p>Edit</p>}
                {load1 && (
                  <CircularProgress
                    style={{ color: "white", width: "20px", height: "22px" }}
                  />
                )}
              </Button>
            </Box>
          </center>
        )}

        {delete1 && (
          <center>
            <Box
              sx={{
                padding: "20px",
                width: "300px",
                position: "fixed",
                top: "15vh",
                zIndex: "100",
                left: { xs: "5vw", md: "40vw", lg: "45vw", sm: "25vw" },
                backgroundColor: "white", // Optional: to make it visible on the page
                boxShadow: 7, // Optional: adds shadow
                borderRadius: "8px", // Optional: rounded corners
              }}
            >
              <center
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h3 style={{ position: "relative", left: "90px" }}>Alert!!</h3>
                <RxCross1
                  style={{ cursor: "pointer" }}
                  onClick={(e) => setDelete1(false)}
                />
              </center>
              <center>
                <img
                  src="../images/warning.jpg"
                  alt=""
                  style={{ width: "100px" }}
                />
              </center>
              <h3>Do you want to delete this record??</h3>
              <Box sx={{ display: "flex", gap: "5px" }}>
                <Button
                  variant="contained"
                  sx={{ width: "70%", marginTop: "15px", borderRadius:"20px", }}
                  onClick={handleDelete}
                >
                  {!load && <p>Yes</p>}
                  {load && (
                    <CircularProgress
                      style={{ color: "white", width: "20px", height: "22px" }}
                    />
                  )}
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "70%", marginTop: "15px", borderRadius:"20px", }}
                  onClick={(e) => setDelete1(false)}
                >
                  No
                </Button>
              </Box>
            </Box>
          </center>
        )}
        <center>
          <h2 style={{ marginTop: "20px" }}>User Management</h2>

          <center>
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
        </center>
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "90vw",
            margin: "auto",
            marginTop: 5,
            minWidth: 200,
            marginBottom: "40px",
            border: "none",
            "&:last-child td, &:last-child th": { border: 0 },
            borderRight:0,
            borderBottom:0
          }}
        >
          <Table
            sx={{
              borderRight:0,
              "&:last-child td, &:last-child th": { border: 0 },
              border:0,
              borderBottom:0
            }}
          >
            <TableHead sx={{ backgroundColor: "#545959", '&:last-child td, &:last-child th': { border: 0 },borderRight:"none" }}>
              <TableRow >
                <TableCell
                  align="center"
                  sx={{
                    color: "white",
                    borderBottom: "none",
                    borderRight: "none",
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "white",
                    borderBottom: "none",
                    borderRight: "none",
                  }}
                >
                  Registration Number
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "white",
                    borderBottom: "none",
                    borderRight: "none",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "whitesmoke",

                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {user.role}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {user.registration_number}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    <Button 
                      onClick={(e) =>
                        handleEdit(user.registration_number, user.role, user.id)
                      }
                    >
                      <FaEdit style={{ fontSize: "1.2rem" }} />
                    </Button>
                    <Button onClick={(e) => handleDelete1(user.id)}>
                      <MdDelete style={{ fontSize: "1.2rem" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {users.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "100px",
              fontSize: "1.5rem",
            }}
          >
            No records available
          </p>
        ) : null}
      </Box>
      <Footer />
    </Box>
  );
};
