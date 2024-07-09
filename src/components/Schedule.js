import {Grid, Typography } from "@mui/material";

export const Schedule = () => {
  return (
    <div className="container">
      <Grid container style={{ marginBottom: "20px", gap: "95px" }}>
          {/* <Typography variant="p" style={{marginLeft:"58%",color:"purple"}}>See all</Typography>
         */}
      </Grid>

      <Grid container style={{ backgroundColor:"#5e5ed6",color:"white",padding:"10px",borderRadius:"15px" }} >
        <Grid item xs={4} md={4} lg={3} sm={4} >
          <Typography variant="p">Reactjs</Typography>
       
        </Grid>
        <Grid item xs={4} md={4} lg={3} sm={4}>
          <Typography variant="p">Monday</Typography>
         
        </Grid>
        <Grid item xs={4} md={4} lg={3} sm={4}>
          <Typography variant="p">2:30pm</Typography>
       
        </Grid>
      </Grid>
   
      <Grid container style={{ marginTop: "10px",backgroundColor:"#5e5ed6",color:"white",padding:"10px",borderRadius:"15px" }}>
        <Grid item xs={4} md={4} lg={3} sm={4} >
          <Typography variant="p">Angularjs</Typography>
       
        </Grid>
        <Grid item xs={4} md={4} lg={3} sm={4}>
          <Typography variant="p">Tuesday</Typography>
         
        </Grid>
        <Grid item xs={4} md={4} lg={3} sm={4}>
          <Typography variant="p">5:30pm</Typography>
       
        </Grid>
      </Grid>
    </div>
  );
};
