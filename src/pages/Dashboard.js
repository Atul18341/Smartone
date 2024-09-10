import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import NavbarNew from "../components/NavbarNew";
import HistoryCard from "../components/Dashboard/HistoryCard";
import SemesterCard from "../components/Dashboard/SemsterDashboard";
import AttendanceDashboard from "../components/Dashboard/Attendance";
import Footer from "../components/Home/Footer";


export const Dashboard = () => {
  const navigate = useNavigate();

  const historyData = [
    { date: "2024-05-01", description: "Logged into the system" },
    { date: "2024-05-02", description: "Updated profile information" },
    { date: "2024-05-03", description: "Submitted an assignment" },
    { date: "2024-05-04", description: "Paid semester fee" },
  ];

  // function regenerateToken() {
  //   let data = JSON.stringify({
  //     refresh: sessionStorage.getItem("refreshtoken"),
  //   });

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "https://amarnath013.pythonanywhere.com/api/user/token/refresh/",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       sessionStorage.setItem("accesstoken", response.data.refresh);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  
  useEffect(() => {
  
    console.log(sessionStorage.getItem("accesstoken"))
    // if(sessionStorage?.getItem("accesstoken")===null){
    //   navigate("/login");
    // }
    // else if (sessionStorage?.getItem("accesstoken")) {
    //   const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
    //   if (response.exp < Math.floor(Date.now() / 1000)) {
    //     navigate("/login");
    //   }
    // } else {
     
    //   navigate("/login");
    // }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarNew />
      <div className="flex justify-center items-center mt-8 mb-4">
        <div className="grid sm:flex grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
          <AttendanceDashboard presentPercentage={70} />
          </div>
          <div>
          
            <div className="grid grid-cols-1 gap-8">
              <div>
                <HistoryCard historyItems={historyData} />
              </div>
              <div>
                <SemesterCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
