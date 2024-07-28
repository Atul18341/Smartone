import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavbarNew from '../components/NavbarNew';
import Footer from '../components/Home/Footer';
import { BaseUrl } from '../components/BaseUrl';

const ShowHostelRoomRequest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response.role !== "caretaker"
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/hostel-allotments/?search=applied`,
      headers: { 
        'Authorization': `Bearer ${sessionStorage?.getItem('accesstoken')}`
      }
    };

    axios.request(config)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <center style={{marginTop:"20%"}}><CircularProgress /></center>;
  }

  return (
    <>
    <NavbarNew />

    {data.length===0 && <p style={{marginTop:"20%",textAlign:"center"}}>No Requests are present currently.</p>}
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="80vh">
        {data.map((item, index) => (
            
          <Grid item key={index} xs={12} sm={8} md={6} lg={4} style={{ margin: '20px' }}>
            <Card>
              <CardMedia
                component="img"
                width="250"
                height="140"
                image={`data:image/jpeg;base64,${item.latest_marksheet}`}
                alt="Marksheet"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Registration Number: {item.registration_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {item.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Box>
      <Footer />

    </>
  );
};

export default ShowHostelRoomRequest;
