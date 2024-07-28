import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import emailValidator from "email-validator";
import NavbarNew from "../components/NavbarNew";
import { FaCameraRetro } from "react-icons/fa";
import { BaseUrl } from "../components/BaseUrl";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const phoneNumberRegex = /^\d{10}$/;

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  father_name: yup.string().required("Father name is required"),
  middle_name: yup.string(),
  gender: yup.string(),
  student_email: yup
    .string()
    .email("Invalid email format")
    .test("valid-email", "Invalid email format", (value) =>
      emailValidator.validate(value)
    ),
  student_phone_number: yup
    .string()
    .test(
      "valid-phoneNumber",
      "Invalid phone number, must be exactly 10 digits",
      (value) => !value || phoneNumberRegex.test(value)
    ),

  date_of_birth: yup
    .string()
    .matches(
      dateRegex,
      "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
    ),
  permanent_address: yup.string(),
  isCorrespndance_same: yup.string(),
  correspndance_address: yup.string(),
  fathers_mobile_number: yup
    .string()
    .test(
      "valid-phoneNumber",
      "Invalid phone number, must be exactly 10 digits",
      (value) => !value || phoneNumberRegex.test(value)
    ),

  last_qualification: yup
    .string()
    .test(
      "is-valid-last_qualification",
      "Values must be between Matric, Intermediate, Polytechnic",
      (value) =>
        !value || ["Matric", "Intermediate", "Polytechnic"].includes(value)
    ),

  registration_year: yup
    .number()
    .integer("Registration year must be an integer")
    .min(1000, "Registration year must be a of 4 digit")
    .max(9999, "Registration year must be a of 4 digit")
    .required("Registration year is required"),

  year: yup
    .number()
    .integer("Registration year must be an integer")
    .min(1000, "year must be a of 4 digit")
    .max(9999, "year must be a of 4 digit")
    .required("year is required"),

  school: yup.string(),
  board: yup
    .string()
    .test(
      "is-valid-board",
      "Values must be between CBSE, ICSE, BSEB, Others",
      (value) => !value || ["CBSE", "ICSE", "BSEB", "Others"].includes(value)
    ),
  branch: yup.string().required("Branch is required"),
  merit_serial_number: yup.string(),
  category: yup.string().required("category is required"),
  college_name: yup.string().required("College Name is required"),
  date_of_admission: yup
    .string()
    .matches(
      dateRegex,
      "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
    )
    .required("Date Of Admission is required"),
  session: yup.string(),
  university_reg_no: yup.string(),
  TC_or_CL_no: yup
    .string()
    .test(
      "is-numeric",
      "TC or CL number must be a number",
      (value) => !isNaN(value) || /^\d+$/.test(value)
    ),
  issuing_date_tc: yup
    .string()
    .test(
      "is-valid-date",
      "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.",
      (value) => !value || dateRegex.test(value)
    ),
  purpose: yup.string(),
  character_certificate_issued: yup
    .string()
    .test(
      "is_valid_ character_certificate_issued",
      "Only accept true or false",
      (value) => !value || ["true", "false"].includes(value)
    ),
  character_certificate_no: yup
    .string()
    .test(
      "is-numeric",
      "Character certificate number must be a number",
      (value) => !isNaN(value) || /^\d+$/.test(value)
    ),
  issuing_date_cr: yup
    .string()
    .test(
      "is-valid-date",
      "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.",
      (value) => !value || dateRegex.test(value)
    ),
});

export const EditProfile = () => {
  const navigate = useNavigate();

  const regenerateToken = () => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(sessionStorage?.getItem("refreshtoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || response1.exp < Math.floor(Date.now() / 1000)) {
        navigate("/login");
      }else{
        if (sessionStorage.getItem("refreshtoken") && sessionStorage.getItem("accesstoken")) {
          let data = {
            refresh: sessionStorage?.getItem("refreshtoken"),
          };
    
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://amarnath013.pythonanywhere.com/api/user/token/refresh/",
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
    if (sessionStorage?.getItem("accesstoken") && sessionStorage?.getItem("refreshtoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.token_type !== "access" &&
        response.exp < Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isCorrespndanceSame, setIsCorrespndanceSame] = useState();
  const permanentAddress = watch("permanent_address");

  useEffect(() => {
    if (isCorrespndanceSame) {
      setValue("correspndance_address", permanentAddress);
    }
  }, [isCorrespndanceSame, permanentAddress, setValue]);

  const handleRadioChange = (event) => {
    setIsCorrespndanceSame(event.target.value === "true");
  };

  const [userProfile, setUserProfile] = useState([]);
  const [file, setFile] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/profile/`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        const token = sessionStorage.getItem("accesstoken");
        if (token) {
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
        setUserProfile(response?.data);
        setIsCorrespndanceSame(
          response?.data?.personal_information?.isCorrespndance_same
        );
        setValue(
          "first_name",
          response.data.personal_information?.first_name || ""
        );
        setValue(
          "last_name",
          response.data.personal_information?.last_name || ""
        );
        setValue(
          "father_name",
          response.data.personal_information?.father_name || ""
        );
        setValue(
          "middle_name",
          response.data.personal_information?.middle_name || ""
        );
        setValue(
          "date_of_birth",
          response.data.personal_information?.date_of_birth || ""
        );
        setValue("gender", response.data.personal_information?.gender || "");
        setValue("email", response.data.contact_information?.email || "");
        setValue(
          "permanent_address",
          response.data.personal_information?.permanent_address || ""
        );
        setValue(
          "isCorrespndance_same",
          response.data.personal_information?.isCorrespndance_same || "false"
        );
        setValue(
          "correspndance_address",
          response.data.personal_information?.correspndance_address || ""
        );
        setValue(
          "permanent_address",
          response.data.personal_information?.permanent_address || ""
        );
        setValue(
          "student_email",
          response.data.contact_information?.student_email || ""
        );
        setValue(
          "student_phone_number",
          response.data.contact_information?.student_phone_number || ""
        );
        setValue(
          "fathers_mobile_number",
          response.data.contact_information?.fathers_mobile_number || ""
        );

        setValue(
          "registration_year",
          response.data.academic_information?.registration_year || ""
        );
        setValue("year", response.data.academic_information?.year || "");
        setValue(
          "last_qualification",
          response.data.academic_information?.last_qualification || ""
        );
        setValue("school", response.data.academic_information?.school || "");
        setValue("board", response.data.academic_information?.board || "");
        setValue("branch", response.data.academic_information?.branch || "");
        setValue(
          "merit_serial_number",
          response.data.academic_information?.merit_serial_number || ""
        );
        setValue(
          "category",
          response.data.academic_information?.category || ""
        );
        setValue(
          "college_name",
          response.data.academic_information?.college_name || ""
        );
        setValue(
          "date_of_admission",
          response.data.academic_information?.date_of_admission || ""
        );
        setValue("session", response.data.academic_information?.session || "");
        setValue(
          "university_reg_no",
          response.data.academic_information?.university_reg_no || ""
        );
        setValue(
          "TC_or_CL_no",
          response.data.tc_information?.TC_or_CL_no || ""
        );
        setValue(
          "issuing_date_tc",
          response.data.tc_information?.issuing_date_tc || ""
        );
        setValue("purpose", response.data.tc_information?.purpose || "");
        setValue(
          "character_certificate_issued",
          response.data.tc_information?.character_certificate_issued || ""
        );
        setValue(
          "character_certificate_no",
          response.data.tc_information?.character_certificate_no || ""
        );
        setValue(
          "issuing_date_cr",
          response.data.tc_information?.issuing_date_cr || ""
        );
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
  }, [setValue]);

  // console.log(errors);

  const UpdateSubmit = (data) => {
    console.log(file);
    setLoading(true);
    const formData = new FormData();
    formData.append("personal_information.first_name", data.first_name);
    formData.append("personal_information.last_name", data.last_name);
    formData.append("personal_information.father_name", data.father_name);
    formData.append("personal_information.middle_name", data.middle_name);
    formData.append("personal_information.date_of_birth", data.date_of_birth);
    formData.append("personal_information.gender", data.gender);
    formData.append(
      "personal_information.permanent_address",
      data.permanent_address
    );
    formData.append(
      "personal_information.isCorrespndance_same",
      isCorrespndanceSame
    );
    formData.append(
      "personal_information.correspndance_address",
      data.correspndance_address
    );

    if (file) {
      formData.append("personal_information.profile_picture", file);
    }

    // Append contact information
    formData.append("contact_information.student_email", data.student_email);
    formData.append(
      "contact_information.student_phone_number",
      data.student_phone_number
    );
    formData.append(
      "contact_information.fathers_mobile_number",
      data.fathers_mobile_number
    );

    // Append academic information
    formData.append(
      "academic_information.registration_number",
      data.registration_number
    );
    formData.append(
      "academic_information.registration_year",
      data.registration_year
    );
    formData.append("academic_information.year", data.year);
    formData.append(
      "academic_information.last_qualification",
      data.last_qualification
    );
    formData.append("academic_information.school", data.school);
    formData.append("academic_information.board", data.board);
    formData.append("academic_information.branch", data.branch);
    formData.append(
      "academic_information.merit_serial_number",
      data.merit_serial_number
    );
    formData.append("academic_information.category", data.category);
    formData.append("academic_information.college_name", data.college_name);
    formData.append(
      "academic_information.date_of_admission",
      data.date_of_admission
    );
    formData.append("academic_information.session", data.session);
    formData.append(
      "academic_information.university_reg_no",
      data.university_reg_no
    );

    formData.append("tc_information.TC_or_CL_no", data.TC_or_CL_no);
    formData.append("tc_information.issuing_date_tc", data.issuing_date_tc);
    formData.append("tc_information.purpose", data.purpose);
    formData.append(
      "tc_information.character_certificate_issued",
      data.character_certificate_issued
    );
    formData.append(
      "tc_information.character_certificate_no",
      data.character_certificate_no
    );
    formData.append("tc_information.issuing_date_cr", data.issuing_date_cr);

    console.log(isCorrespndanceSame);
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/profile/`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
      },
      data: formData,
    };
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
    if(token && token1){
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
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
        }else{
          navigate('/login');
        }
        enqueueSnackbar(response.data.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        setLoading(false);
        navigate("/profile");
      })
      .catch((error) => {
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
        console.log(error);
      });
    }else{
      navigate('/login');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    let url = URL.createObjectURL(e.target.files[0]);
    setImgPreview(url);
  };
  return (
    <Box className="logout-container">
      <div className="circle circle1"></div>
      <div className="rectangle circle2"></div>
      <div className="circle circle3"></div>
      <div className="rectangle circle4"></div>
      <div className="rectangle circle5"></div>
      <div className="circle circle6"></div>
      <Box
        className="z-10"
        style={{ height: "calc(100vh - 2px)", overflowY: "scroll" }}
      >
        <Box>
          <NavbarNew />
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box
                className=" mt-3 w-full lg:p-10 sm:p-5 p-5"
                style={{ height: "calc(100vh - 5px)" }}
              >
                <Box className="text-center">
                  <label component="label">
                    {!imgPreview &&
                    userProfile?.personal_information?.profile_picture !==
                      null ? (
                      <img
                        src={userProfile?.personal_information?.profile_picture}
                        alt="Loading..."
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "10px 0px 10px 40px",
                          borderRadius: "50%",
                          border: "2px solid whitesmoke",
                          objectFit: "cover",
                        }}
                      />
                    ) : imgPreview ? (
                      <img
                        src={imgPreview}
                        alt="description"
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "10px 0px 10px 40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720137600&semt=ais_user"
                        alt=""
                        className="lg:w-[10%] w-[40%] sm:w-[25%] md:w-[15%] h-auto text-center"
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    <FaCameraRetro
                      style={{
                        fontSize: "1.7rem",
                        position: "relative",
                        top: "-25px",
                        left: "-25px",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                </Box>

                <form onSubmit={handleSubmit(UpdateSubmit)}>
                  <Box className="lg:p-10 sm:p-5 xs:p-0 md:p-5 mb-4">
                    <div className="flex justify-between">
                      <Box className="flex justify-between">
                        <Typography variant="p text-xl mx-auto mb-10">
                          Basic details
                        </Typography>
                      </Box>
                    </div>
                    <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
                      <Grid container className="mt-3">
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          sx={{ marginTop: "0px", marginBottom: "5px" }}
                        >
                          <Typography
                            variant="p"
                            style={{ fontSize: "1.2rem" }}
                          >
                            Registration No.
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          {
                            userProfile.personal_information
                              ?.registration_number
                          }
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">First Name</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            {...register("first_name")}
                            fullWidth
                            error={!!errors.first_name}
                            helperText={errors.first_name?.message}
                            sx={{ marginTop: "10px" }}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Middle Name</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            sx={{ marginTop: "10px" }}
                            fullWidth
                            {...register("middle_name")}
                            error={!!errors.middle_name}
                            helperText={errors.middle_name?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Last Name</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            {...register("last_name")}
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            error={!!errors.last_name}
                            helperText={errors.last_name?.message}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Father Name</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("father_name")}
                            error={!!errors.father_name}
                            helperText={errors.father_name?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />

                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">DOB</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("date_of_birth")}
                            error={!!errors.date_of_birth}
                            helperText={errors.date_of_birth?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Gender</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("gender")}
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Permanent Address</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("permanent_address")}
                            error={!!errors.permanent_address}
                            helperText={errors.permanent_address?.message}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Is Correspndance same
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              {...register("isCorrespondence_same")}
                              value={isCorrespndanceSame ? "true" : "false"}
                              onChange={handleRadioChange}
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Correspndance Address
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("correspndance_address")}
                            error={!!errors.correspndance_address}
                            helperText={errors.correspndance_address?.message}
                            disabled={isCorrespndanceSame}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Box style={{ marginBottom: "15px" }}>
                    <Typography variant="p text-xl mx-auto mb-10">
                      Contact Information
                    </Typography>
                    <Box className="bg-gray-100 p-3 rounded-2xl mt-6">
                      <Grid container className="mt-3">
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginBottom: "5px" }}
                        >
                          <Typography variant="p">Student Email</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="email"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("student_email")}
                            error={!!errors.student_email}
                            helperText={errors.student_email?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          fullWidth
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Student's Phone no.
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("student_phone_number")}
                            error={!!errors.student_phone_number}
                            helperText={errors.student_phone_number?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Father's phone no</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            sx={{ marginTop: "10px" }}
                            {...register("fathers_mobile_number")}
                            error={!!errors.fathers_mobile_number}
                            helperText={errors.fathers_mobile_number?.message}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <Box className="">
                    <Typography variant="p" style={{ fontSize: "1.2rem" }}>
                      Academic Information
                    </Typography>
                    <Box className="bg-gray-100 p-3 rounded-2xl mt-6 mb-6">
                      <Grid container className="mt-3">
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginBottom: "5px" }}
                        >
                          <Typography variant="p">
                            Registration_number
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <Typography variant="p">
                            {
                              userProfile?.academic_information
                                ?.registration_number
                            }
                          </Typography>
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Registration Year</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("registration_year")}
                            error={!!errors.registration_year}
                            helperText={errors.registration_year?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Year</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("year")}
                            error={!!errors.year}
                            helperText={errors.year?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Last Qualification
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("last_qualification")}
                            error={!!errors.last_qualification}
                            helperText={errors.last_qualification?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">School</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("school")}
                            error={!!errors.school}
                            helperText={errors.school?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Board</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("board")}
                            error={!!errors.board}
                            helperText={errors.board?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Branch</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("branch")}
                            error={!!errors.branch}
                            helperText={errors.branch?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Merit Serial Number
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("merit_serial_number")}
                            error={!!errors.merit_serial_number}
                            helperText={errors.merit_serial_number?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Category</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="string"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("category")}
                            error={!!errors.category}
                            helperText={errors.category?.message}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">College Name</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("college_name")}
                            error={!!errors.college_name}
                            helperText={errors.college_name?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Date Of Admission</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("date_of_admission")}
                            error={!!errors.date_of_admission}
                            helperText={errors.date_of_admission?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Session</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("session")}
                            error={!!errors.session}
                            helperText={errors.session?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            University Registration no.
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("university_reg_no")}
                            error={!!errors.university_reg_no}
                            helperText={errors.university_reg_no?.message}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="p text-xl mx-auto mb-10">
                      Tc Information
                    </Typography>
                    <Box className="bg-gray-100 p-3 rounded-2xl mt-6 mb-3">
                      <Grid container className="mt-3">
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <Typography variant="p">TC/CL number</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("TC_or_CL_no")}
                            error={!!errors.TC_or_CL_no}
                            helperText={errors.TC_or_CL_no?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Issuing Date Tc</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="string"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("issuing_date_tc")}
                            error={!!errors.issuing_date_tc}
                            helperText={errors.issuing_date_tc?.message}
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">Purpose</Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("purpose")}
                            error={!!errors.purpose}
                            helperText={errors.purpose?.message}
                          />
                        </Grid>
                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Character Certificate Issued
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("character_certificate_issued")}
                            error={!!errors.character_certificate_issued}
                            helperText={
                              errors.character_certificate_issued?.message
                            }
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Character Certificate No
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("character_certificate_no")}
                            error={!!errors.character_certificate_no}
                            helperText={
                              errors.character_certificate_no?.message
                            }
                          />
                        </Grid>

                        <Divider style={{ width: "100%", margin: "10px 0" }} />
                        <Grid
                          item
                          lg={4}
                          sm={12}
                          xs={12}
                          md={12}
                          style={{ marginTop: "10px" }}
                        >
                          <Typography variant="p">
                            Issuing Date creation
                          </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12} md={12}>
                          <TextField
                            type="text"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            {...register("issuing_date_cr")}
                            error={!!errors.issuing_date_cr}
                            helperText={errors.issuing_date_cr?.message}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <center>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ marginBottom: "40px" }}
                      sx={{
                        width: { lg: "30%", md: "70%", xs: "100%", sm: "90%" },
                      }}
                    >
                      {!loading && <p>Update</p>}
                      {loading && (
                        <CircularProgress style={{ color: "white",width:"20px",height:"22px" }} />
                      )}
                    </Button>
                  </center>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
