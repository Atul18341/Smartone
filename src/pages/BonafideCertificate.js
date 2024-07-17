import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../components/BaseUrl";
import { enqueueSnackbar } from "notistack";

export const BonafideCertificate = () => {
  const [result, setResult] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();



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
  useEffect(()=>{
    let data1 = JSON.stringify({
      college: 1,
      student: jwtDecode(localStorage?.getItem("accesstoken")).user_id,
      roll_no: jwtDecode(localStorage?.getItem("accesstoken")).user_id,
      required_for: localStorage?.getItem("required_for"),
      status: "approved",
      supporting_documents: localStorage?.getItem("file"),
      fee_structure: 'false',
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/bonafide/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
      data: data1,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
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
        setResult(response.data);
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
  },[]);
    
  

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      console.log(response.exp);
      if (response.exp < Math.floor(Date.now() / 1000)|| response.role!=="student" ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/profile/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
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
        setProfile(response?.data);
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
  }, []);

  return (
    <>
      <div className="container mx-auto print:px-0 print:py-0 print:mx-0 print:w-full print:max-w-none">
        <div className="flex justify-between items-center pb-4 print:flex-col print:items-start">
          <div className="flex items-center space-x-2 print:hidden"></div>
        </div>
        <div className="border border-gray-200 rounded-lg px-8 py-12 print:border-none print:rounded-none print:px-16 print:py-16">
          <div className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://imgs.search.brave.com/nlEnn1zTIbZ2U6Nip9RwamR_i6LXgcdLZbNJO_-Qxnk/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vMy8zNy9N/b3RpaGFyaV9Db2xs/ZWdlX29mX0VuZ2lu/ZWVyaW5nX2xvZ28u/anBn"
                alt="College Logo"
                className="w-24 h-24 print:w-32 print:h-32 object-cover rounded-lg"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold print:text-3xl">
                  DEPARTMENT OF SCIENCE & TECHNOLOGY
                </h2>
                <h3 className="text-xl font-medium print:text-2xl">
                  MOTIHARI COLLEGE OF ENGINEERING, MOTIHARI
                </h3>
                <p className="text-gray-500 print:text-lg">
                  BAIRIYA, FURSATPUR, MOTIHARI, EAST CHAMPARAN, BIHAR – 845401
                  <br />
                  PH. NO. 06252-290699/290695
                  <br />
                  E-MAIL ID- <span>mecmotihari4@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
          <center>
            <h2
              className="text-2xl font-bold pb-2"
              style={{ textDecoration: "underline" }}
            >
              Bonafide Certificate
            </h2>
          </center>
          <p className="text-justify leading-loose print:text-lg">
            This is to certify that{" "}
            <b>
              {profile?.personal_information?.first_name?.slice(0, 1)?.toUpperCase()}
              {profile?.personal_information?.first_name?.slice(1)}{" "}
              {profile?.personal_information?.last_name?.slice(0, 1)?.toUpperCase()}
              {profile?.personal_information?.last_name?.slice(1)}
            </b>{" "}
            S/o or D/o{" "}
            <b>
              {" "}
              {profile?.personal_information?.father_name?.slice(0, 1)?.toUpperCase()}
              {profile?.personal_information?.father_name?.slice(1)}
            </b>{" "}
            bearing College Roll No.-{" "}
            <b> {profile?.personal_information?.registration_number}</b> is a bonafide student
            of<b> {profile?.academic_information?.current_year} </b>Semester/Year. (Batch{" "}
            <b>{profile?.academic_information?.session}</b>)
            <b> {profile?.academic_information?.branch?.toUpperCase()} Department</b>, under B.Tech
            Programme of this Institute. Class starts from{" "}
            <b>{profile?.academic_information?.date_of_admission}</b> After completing the usual
            academic procedure, he/she has been enrolled under the 04 years
            B.Tech programme of the Institute.
          </p>
          <div className="flex justify-end print:justify-center">
            <p className="text-right print:text-center">
              Principal/OSD
              <br />
              Motihari College of Engineering,
              <br />
              Motihari.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonafideCertificate;
