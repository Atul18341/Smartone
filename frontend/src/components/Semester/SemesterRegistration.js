import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Card,
  CardContent,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import "../../App.css";
import NavbarNew from "../NavbarNew";
import { IoIosInformationCircle } from "react-icons/io";
import { PiListNumbersFill } from "react-icons/pi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "../Home/Footer";
import { Table } from "heroicons-react";
import { enqueueSnackbar } from "notistack";
import { MdDateRange } from "react-icons/md";
import { FaCodeBranch } from "react-icons/fa";
import { GiSpellBook } from "react-icons/gi";
import { BaseUrl } from "../BaseUrl";

const schema = yup.object().shape({
  selectedSemester: yup.string().required("Semester is required"),
  branch: yup.string().required("Branch is required"),
});

export function SemesterRegistration() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [branches, setBranches] = useState([]);
  const [branches1, setBranches1] = useState([]);
  const [branches2, setBranches2] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [userProfile, setUserProfile] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [uniqueCodes, setUniqueCodes] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [result, setResult] = useState([]);
  const [loading,setLoading]=useState(true);
  const [loading1,setLoading1]=useState(true);
  const [loading2,setLoading2]=useState(true);
 

  const [responsive, setResponsive] = useState(
    window.innerWidth < 669 ? true : false
  );

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const resize = () => {
    setResponsive(window.innerWidth < 669 ? true : false);
  };

  const {
    handleSubmit,
    control,
    setValue,
    register,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
        setLoading(false);
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(userProfile?.personal_information?.registration_number);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/semester-registrations/?search=${userProfile?.personal_information?.registration_number}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setLoading1(false);
        setResult(response.data.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userProfile]);

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || response.role !== "student" ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/semester/?search`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setLoading2(false);
        setTotalData(response.data);
        const uniqueBranches = response.data.reduce((acc, current) => {
          const x = acc.find(
            (item) => item.semester_name === current.semester_name
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setBranches(uniqueBranches);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchBranches = (semester) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/semester/?search=${semester}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const uniqueBranches = response.data.reduce((acc, current) => {
          const x = acc.find(
            (item) =>
              item.semester_name === current.semester_name &&
              item.branch === current.branch
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setBranches1(uniqueBranches);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSemesterChange = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setValue("selectedSemester", semester);
    trigger("selectedSemester");
    fetchBranches(semester);
  };

  const handleBranchChange = (event) => {
    const branch = event.target.value;
    setBranches2(branch);
    setValue("branch", branch);
    trigger("branch");
  };

  useEffect(() => {
    if (selectedSemester && branches2) {
      const filteredData = totalData.filter(
        (item) =>
          item.semester_name === selectedSemester && item.branch === branches2
      );
      const uniqueCodes = [
        ...new Set(
          filteredData
            .map((item) => item.subjects.map((subject) => subject.subject_code))
            .flat()
        ),
      ];
      const uniqueSubjects = filteredData
        .map((item) => item.subjects)
        .flat()
        .filter(
          (v, i, a) =>
            a.findIndex((t) => t.subject_name === v.subject_name) === i
        );
      setUniqueCodes(uniqueCodes);
      setUniqueSubjects(uniqueSubjects);
    }
  }, [selectedSemester, branches2]);

  const onSubmit = (data) => {
    console.log(data);

    if(userProfile?.personal_information?.first_name===null)
      return enqueueSnackbar("name field is empty", { variant: "error" });

    if(!userProfile?.academic_information?.session)
      return enqueueSnackbar("Session field is empty", { variant: "error" });

    
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/semester/?search`,
      headers: {
        Authorization: `Bearer ${localStorage?.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        const b = response.data.find((item) => {
          return item?.subjects?.length!==0 &&  item?.semester_name ===  data?.selectedSemester && item?.branch === data?.branch;
      })?.id;

        let data1 = JSON.stringify({
          semester: b,
          student: `${jwtDecode(localStorage?.getItem("accesstoken")).user_id}`,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${BaseUrl}/semester-registrations/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage?.getItem("accesstoken")}`,
          },
          data: data1,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(response.data);

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
            console.log(error);
            
          });
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
  };

  if (loading || loading1 || loading2) {
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
  // console.log(uniqueSubjects);
  return (
    <>
      <NavbarNew />
       
          <p  style={{ width: "100%",fontSize:"1.3rem",marginTop:"30px",textAlign:"center" }}>
            Semester Registration
          </p>
       
       
          
        <center>
        <img src="./images/semester.png" alt="" style={{width:"310px",borderRadius:"10px",marginTop:"25px"}}/></center>
        
      <Grid container spacing={1} style={{ padding: "30px",display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center" }}>
        <Grid item xs={12} sm={12} lg={7} md={7} style={{display:"flex",flexDirection:"column",justifyContent:'center',alignContent:"center",alignItems:"center"}}>
          <TextField
          
            type="text"
            placeholder="Student Name"
            value={`${userProfile?.personal_information?.first_name} ${userProfile?.personal_information?.middle_name} ${userProfile?.personal_information?.last_name}`}
            fullWidth
            disabled
            sx={{
              width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
              marginTop:"15px",marginBottom:"10px",
              backgroundColor:"whitesmoke"
            }}
           
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosInformationCircle />
                </InputAdornment>
              ),
            }}
          />
      
       
          <TextField
            type="text"
            value={userProfile?.personal_information?.registration_number}
            fullWidth
            disabled
            sx={{
              width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
              marginBottom:"10px",
              backgroundColor:"whitesmoke"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PiListNumbersFill />
                </InputAdornment>
              ),
            }}
          />
       
        
          <FormControl fullWidth  sx={{
                      width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                      marginBottom:"10px"
                    }} >
            <InputLabel id="semester-label">Choose Semester</InputLabel>
            <Controller
              name="selectedSemester"
              control={control}
              defaultValue=""
            
              render={({ field }) => (
                <Select
                style={{backgroundColor:"whitesmoke"}}
                  {...field}
                  labelId="semester-label"
                  label="Choose Semester"
                  displayEmpty
                  onChange={(e) => {
                    field.onChange(e);
                    handleSemesterChange(e);
                  }}
                 
                >
                  <MenuItem value="" disabled>
                    Choose Semester
                  </MenuItem>
                  {branches.map((semester, index) => (
                    <MenuItem key={index} value={semester.semester_name}>
                      {semester.semester_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <FormHelperText>{errors.selectedSemester?.message}</FormHelperText>
          </FormControl>
        
        
          <FormControl fullWidth  sx={{
                      width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
                      marginBottom:"10px"
                    }}>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Controller
           
              name="branch"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                style={{backgroundColor:"whitesmoke"}}
                  {...field}
                  labelId="branch-label"
                  label="Branch"
                  
                  onChange={(e) => {
                    field.onChange(e);
                    handleBranchChange(e);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {branches1?.map((data, index) => (
                    <MenuItem key={index} value={data.branch}>
                      {data.branch}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.branch?.message}</FormHelperText>
          </FormControl>
        
          <TextField
            type="text"
            value={userProfile?.academic_information?.session}
            placeholder='session'
            sx={{
              width: { lg: "70%", md: "70%", xs: "100%", sm: "90%" },
              backgroundColor:"whitesmoke"
            }}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdDateRange />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
       
        <Grid item lg={5} md={5} sx={{ padding: "20px" , display:{
        lg:"block",
        md:"block",
        sm:"none",
        xs:"none"
      },marginTop:"20px" }}>
          <p style={{marginBottom:"20px",fontSize:"1.2rem",textAlign:"center"}}>
            Subject List
          </p>
          <center>
          <Box style={{ marginTop: "10px", marginBottom: "20px" }}>
            {uniqueSubjects.length > 0 ? (
              uniqueSubjects.map((data, index) => (
                <p key={index} style={{ margin: "10px" }}>
                 <GiSpellBook style={{fontSize:"1.4rem"}}/> {data.subject_code} : {data.subject_name}
                </p>
              ))):(<center><img src="./images/semester_no_data.png" alt="" style={{
                width:"280px"
              }}/></center>)}
          </Box>
          <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          >
          Send Request
        </Button>
          </center>
        </Grid>
     
      </Grid>
      
     
       {/* for phone */}
      <Grid container spacing={2} sx={{ padding: "20px" , display:{
        lg:"none",
        md:"none",
        sm:"flex",
        xs:"flex"
      }, justifyContent:"center",alignContent:"center",alignItems:"center" }}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom sx={{marginBottom:"50px"}}>
            Subject List
          </Typography>
          <center>
          <Box style={{ marginTop: "20px", marginBottom: "20px" }}>
            {uniqueSubjects.length > 0 ? (
              uniqueSubjects.map((data, index) => (
                <p key={index} style={{ margin: "10px" }}>
                 <GiSpellBook style={{fontSize:"1.4rem"}}/> {data.subject_code} : {data.subject_name}
                </p>
              ))):(<center><img src="./images/semester_no_data.png" alt="" style={{
                width:"280px"
              }}/></center>)}
          </Box>
          <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          >
          Send Request
        </Button>
          </center>
        </Grid>
      </Grid>


    

      <Grid container spacing={3} style={{ padding: "20px" }}>
        <Grid item xs={12} style={{marginTop:"40px"}}>
         <center> 
          <p style={{ width: "100%",fontSize:"1.2rem" }}>
            Previous Records
          </p></center>
        </Grid>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: "30px",
            alignItems: "center",
            alignContent: "center",
            width: "100vw",
          }}
        >
          {result?.length === 0 && (
           
        <center>
        <img src="./images/No_data.png" alt="" style={{width:"300px",borderRadius:"10px",marginTop:"30px"}}/></center>
          )}

          { result.length > 0 &&
            result.map((data, index) => (
              <Box key={index}>
                <Card
                variant="outlined"
                  sx={{
                    minWidth: {lg:775,sm:400,xs:305,md:575},
                    marginBottom: 2,
                    color:"whitesmoke",
                    height: 150,
                    padding:2
                  }}
                >
                  <CardContent>
                    <Typography variant="p" color="text.secondary" component="div" sx={{fontSize:"1.0rem",marginBottom:"2px"}}>
                      Semester Name: {data?.semester?.semester_name}
                    </Typography>

                    <Typography variant="body1" color="text.secondary"  sx={{fontSize:"1.0rem"}}>
                      Applied Date: {data?.applied_date}
                    </Typography>

                    <Typography variant="body1" color="text.secondary"  sx={{fontSize:"1.0rem",marginBottom:"2px"}}>
                      Status: {data?.status}
                    </Typography>
                   
                  </CardContent>
                </Card>
              </Box>
            ))}
        </Box>
      </Grid>
      <Footer />
    </>
  );
}

export default SemesterRegistration;
