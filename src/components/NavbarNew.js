import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavbarNew.css"; // If you have custom CSS, keep this import
import { jwtDecode } from "jwt-decode";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgMenuLeftAlt, CgProfile, CgMenuRightAlt } from "react-icons/cg";
import { Box, Button, Divider, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BaseUrl } from "./BaseUrl";
import { TiDelete } from "react-icons/ti";

dayjs.extend(relativeTime);

export const NavbarNew = () => {
  const navigate = useNavigate();
  const [roll, setRoll] = useState("");
  const [result, setResult] = useState([]);
  const [name,setName]=useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("accesstoken") === null) {
      navigate("/login");
    } else {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));

      setRoll(response?.role);
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      const response = jwtDecode(token);

      axios
        .get(
          `${BaseUrl}/${response?.college}/colleges/${response?.college}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setResult(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      const response = jwtDecode(token);

      axios
        .get(
          `${BaseUrl}/${response?.college}/profile/`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setName(response?.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const mainOptions = [
    "General",
    "Academic",
    "Residential",
    "Other Responsibilities",
    "Actions",
    "Others",
    "HOD",
  ];
  const general = [
    { name: "Profile", link: "/profile" },
    { name: "Change Password", link: "/change-password" },
    { name: "Logout", link: "/logout" },
  ];
  const academic = [
    { name: "Bonafide Certificate", link: "/bonafide-form" },
    { name: "Academic Fee", link: "/underDevelopment" },
    { name: "Semester Registration", link: "/semesterRegistration" },
    { name: "Internal Semester Marks", link: "/underDevelopment" },
    { name: "No dues for degree", link: "/no-dues-for-degree" },
    { name: "Assignment Submission", link: "/underDevelopment" },
    { name: "Transfer/Leaving Certificate", link: "/underDevelopment" },
    { name: "Character Certificate", link: "/underDevelopment" },
  ];
  const residential = [
    { name: "Hostel Allotment Request", link: "/hostel-room-request" },
    { name: "Hostel/Mess Fee Payment", link: "/hostel-mess-fee-payment" },
    { name: "Hostel/Mess Fee Receipts", link: "/underDevelopment" },
    { name: "Leave Request", link: "/underDevelopment" },
    { name: "Hostel No Dues Request", link: "/hostel-no-dues-request" },
    { name: "Security Money Return Request", link: "/underDevelopment" },
  ];
  const teachers = [
    { name: "Add Subject", link: "/sem-sub-register" },

    { name: "Upload/Check Assignment", link: "/underDevelopment" },
    { name: "Upload Internal Sem Marks", link: "/underDevelopment" },

    // { name: "Semester Registration Request", link: "/verifySemesterRegistration" }
  ];

  const office = [
    { name: "Add Branch", link: "/sem-branch-register" },
    { name: "User Management", link: "/user-management" },
    {
      name: "Register",
      link: sessionStorage?.getItem("accesstoken")
        ? `/register/${
            jwtDecode(sessionStorage?.getItem("accesstoken")).college
          }`
        : null,
    },
    { name: "Generate Departments", link: "/generate-departments" },
  ];

  const fees_add = [
    { name: "Add Fees", link: "/add-fees" },
    { name: "Hostel Room Allotment", link: "/hostel-room-allotment" },
    { name: "Hostel No Due Request", link: "/hostel-no-due-request" },
    { name: "Hostel/Mess Fee Payment", link: "/caretaker-dashboard" },
    { name: "Room Register", link: "/room-register" },

    // { name: "Show Hostel Room Requests", link: "/hostel-room-allotment-requests" },
  ];

  const others = [
    { name: "Guest Room Request", link: "/guest-room" },
    { name: "Complaints", link: "/complaints" },
  ];

  const department = [
    { name: "No dues for degree", link: "/No-dues-for-degree-approval" },
  ];

  const admin = [
    // { name: "Add college", link: "/add-college" },
    // { name: "Add Subject", link: "/sem-sub-register" },
    // { name: "Add Branch", link: "/sem-branch-register" },
    // {
    //   name: "Verify Semester Registration",
    //   link: "/verifySemesterRegistration",
    // },
  ];

  const hod = [
    {
      name: "Verify Semester Registration",
      link: "/verifySemesterRegistration",
    },
    { name: "Add Subjects", link: "/sem-sub-register" },
    { name: "Add Semester", link: "/sem-register" },
    { name: "Sign No Dues(for TC)", link: "/underDevelopment" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [
    isNestedDropdownGeneralOpen,
    setIsNestedDropdownGeneralOpen,
  ] = useState(false);
  const [
    isNestedDropdownAcademicOpen,
    setIsNestedDropdownAcademicOpen,
  ] = useState(false);
  const [
    isNestedDropdownResidentialOpen,
    setIsNestedDropdownResidentialOpen,
  ] = useState(false);
  const [isNestedDropdownOthersOpen, setIsNestedDropdownOthersOpen] = useState(
    false
  );
  const [
    isNestedDropdownOther_responsibilitiesOpen,
    setIsNestedDropdownOther_responsibilitiesOpen,
  ] = useState(false);
  const [
    isNestedDropdownFacultyAcadamicOpen,
    setIsNestedDropdownFacultyAcadamicOpen,
  ] = useState(false);
  const [isNestedDropdownHODOpen, setIsNestedDropdownHODOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNestedDropdownGeneral = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(!isNestedDropdownGeneralOpen);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownAcademic = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(!isNestedDropdownAcademicOpen);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownResidential = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(!isNestedDropdownResidentialOpen);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownOthers = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOthersOpen(!isNestedDropdownOthersOpen);
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownOther_responsibilities = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(
      !isNestedDropdownOther_responsibilitiesOpen
    );
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownFacultyAcademic = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownFacultyAcadamicOpen(
      !isNestedDropdownFacultyAcadamicOpen
    );
    setIsNestedDropdownHODOpen(false);
  };
  const toggleNestedDropdownHOD = (e) => {
    e.stopPropagation();
    setIsNestedDropdownGeneralOpen(false);
    setIsNestedDropdownAcademicOpen(false);
    setIsNestedDropdownResidentialOpen(false);
    setIsNestedDropdownOthersOpen(false);
    setIsNestedDropdownOther_responsibilitiesOpen(false);
    setIsNestedDropdownFacultyAcadamicOpen(false);
    setIsNestedDropdownHODOpen(!isNestedDropdownHODOpen);
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("accesstoken") !== null) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BaseUrl}/notification/?search=${
          jwtDecode(sessionStorage?.getItem("accesstoken"))?.registration_number
        }`,
        headers: {
          Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          setNotifications(response?.data?.reverse());
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/login");
    }
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);

  const deleteNotification = (id) => {
    let data = JSON.stringify({
      ids: [id],
    });

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BaseUrl}/notification/delete_all_notification/`,
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
        setNotifications(
          notifications.filter((notification) => notification.id !== id)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAllNotifications = async () => {
    if (sessionStorage.getItem("accesstoken") !== null) {
      const deleteRequests = notifications.map((notification) => {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${BaseUrl}/notification/${notification.id}/`,
          headers: {
            Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
          },
        };
        return axios.request(config);
      });

      try {
        await Promise.all(deleteRequests);
        setNotifications([]);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav
        className="bg-gray-200 text-[#041E49] px-4 py-5 shadow-md"
        style={{ zIndex: "20" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative" onClick={toggleDropdown}>
              <div className="cursor-pointer flex items-center space-x-2">
                {isDropdownOpen ? (
                  <CgMenuRightAlt style={{ fontSize: "1.3rem" }} />
                ) : (
                  <CgMenuLeftAlt style={{ fontSize: "1.3rem" }} />
                )}
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div
                      className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                      onClick={toggleNestedDropdownGeneral}
                    >
                      {mainOptions[0]}
                      {isNestedDropdownGeneralOpen && (
                        <div
                          className="hover:bg-blue-50 mt-2 bg-white rounded-lg shadow-md"
                          style={{ textDecoration: "none" }}
                        >
                          {general.map((item, index) => (
                            <Link
                              key={index}
                              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 "
                              to={item.link}
                              style={{ textDecoration: "none" }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    {roll === "student" && (
                      <>
                        <div
                          className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                          onClick={toggleNestedDropdownAcademic}
                        >
                          {mainOptions[1]}
                          {isNestedDropdownAcademicOpen && (
                            <div className="hover:bg-blue-50 mt-2 bg-white rounded-lg shadow-md">
                              {academic.map((item, index) => (
                                <Link
                                  key={index}
                                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                  to={item.link}
                                  style={{ textDecoration: "none" }}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                          onClick={toggleNestedDropdownResidential}
                        >
                          {mainOptions[2]}
                          {isNestedDropdownResidentialOpen && (
                            <div className="mt-2 bg-white rounded-lg shadow-md">
                              {residential.map((item, index) => (
                                <Link
                                  key={index}
                                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                  to={item.link}
                                  style={{ textDecoration: "none" }}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {roll === "super-admin" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownResidential}
                      >
                        Action
                        {isNestedDropdownResidentialOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {admin.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {roll === "department" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownResidential}
                      >
                        Action
                        {isNestedDropdownResidentialOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {department.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {(roll === "teacher" || roll === "faculty") && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownResidential}
                      >
                        Action
                        {isNestedDropdownResidentialOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {teachers.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {roll === "office" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownResidential}
                      >
                        Action
                        {isNestedDropdownResidentialOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {office.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* {roll !== "student" && roll !== "caretaker" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownOther_responsibilities}
                      >
                        {mainOptions[3]}
                        {isNestedDropdownOther_responsibilitiesOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {other_responsibilities.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )} */}
                    {roll === "caretaker" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownOther_responsibilities}
                      >
                        {mainOptions[4]}
                        {isNestedDropdownOther_responsibilitiesOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {fees_add.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {roll === "student" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownOthers}
                      >
                        {mainOptions[5]}
                        {isNestedDropdownOthersOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {others.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Faculty common */}
                    {/* {roll === "faculty" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownFacultyAcademic}
                      >
                        {mainOptions[1]}
                        {isNestedDropdownFacultyAcadamicOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {facultyAcadamic.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )} */}
                    {/* Faculty HOD */}

                    {roll === "hod" && (
                      <div
                        className="hover:bg-blue-50 px-4 py-2 cursor-pointer"
                        onClick={toggleNestedDropdownHOD}
                      >
                        {mainOptions[6]}
                        {isNestedDropdownHODOpen && (
                          <div className="mt-2 bg-white rounded-lg shadow-md">
                            {hod.map((item, index) => (
                              <Link
                                key={index}
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                                to={item.link}
                                style={{ textDecoration: "none" }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <h1
              className="text-xl font-bold ml-4 "
              onClick={(e) => {
                navigate("/");
              }}
            >
              Smart One
            </h1>
          </div>
          <Box sx={{display:{
            xs:"none",
            sm:"none",
            md:"block",
            lg:"block"
          }}}>
            <div >
            {result?.college_logo && result?.college_name && 
            <span style={{display:"flex",gap:"5px"}}>
            <img
                src={`${result?.college_logo}`}
                alt="College Logo"
                style={{width:"40px",borderRadius:"10px"}}
                
              />
            <span>{result?.college_name}</span>
            </span>}
            </div>
           
           
            
          </Box>
          <div className="flex items-center space-x-4">
            <div
              className="relative cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IoIosNotificationsOutline size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                  {notifications.length}
                </span>
              )}
            </div>
            {showNotifications && (
              <Box
                className="bg-white shadow-lg rounded-md z-10"
                sx={{
                  position: "absolute",
                  top: "54px",
                  right: "24px",
                  width: { lg: "20.7rem", xs: "16.7rem" },
                }}
              >
                <Box p={2} style={{ overflowY: "scroll", height: "450px" }}>
                  <div className="flex justify-between items-center">
                    <h4>Notifications</h4>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={deleteAllNotifications}
                      style={{ backgroundColor: "rgb(107, 169, 169)" }}
                    >
                      Clear All
                    </Button>
                  </div>
                  <Divider style={{ marginTop: "5px" }} />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex justify-between items-center py-2 font-semibold"
                      >
                        <Box
                          style={{
                            backgroundColor: "rgb(244, 246, 248)",
                            display: "flex",
                            flexDirection: "row",
                            padding: "10px",
                            borderRadius: "14px",
                          }}
                        >
                          <div>
                            <p>{notification.message}</p>
                            <p className="text-xs text-gray-500">
                              {dayjs(notification.time).fromNow()}
                            </p>
                          </div>
                          <Button
                            size="small"
                            onClick={() => deleteNotification(notification.id)}
                            style={{ color: "rgb(107, 169, 169)" }}
                          >
                            <TiDelete style={{ fontSize: "1.5rem" }} />
                          </Button>
                        </Box>
                      </div>
                    ))
                  ) : (
                    <p
                      className="text-center py-2 text-gray-500"
                      style={{ marginTop: "100px" }}
                    >
                      No notifications
                    </p>
                  )}
                </Box>
              </Box>
            )}
            {roll === "student" && (
              <div className="relative" style={{display:"flex",gap:"5px"}}>
                <Typography variant="body2" sx={{fontWeight:"600",display:{
                  xs:"none",sm:"block",lg:"block",md:"block"
                }}}>
                 {name?.personal_information?.first_name?.slice(0, 1)?.toUpperCase()}
                 {name?.personal_information?.first_name?.slice(1)}{" "} 
                 </Typography>
                <CgProfile
                  size={26}
                  style={{position:"relative",top:"-3px"}}
                  className="cursor-pointer z-20 "
                  onClick={(e) => {
                    navigate("/profile");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarNew;
