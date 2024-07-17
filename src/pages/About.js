import { Grid, Box, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import CameraRollSharpIcon from "@mui/icons-material/CameraRollSharp";
import { Header } from "../components/Home/Header";

export const About = () => {
  return (
    <Box>
         <Header />
      <Grid
        container
        className="justify-center p-2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://static.vecteezy.com/ti/vetor-gratis/p1/20413291-moderno-isometrico-alunos-dentro-universidade-campus-conceito-com-texto-lugar-pode-usar-para-rede-bandeira-infograficos-heroi-imagens-plano-isometrico-ilustracao-isolado-em-branco-fundo-vetor.jpg)",
          filter: "brightness(0.5) opacity(0.9)",
          height: "29rem",
        }}
      ></Grid>
      <Box style={{ position: "absolute", top: "33%", }}>
        <p
          className="lg:text-5xl text-3xl text-white ml-9 w-4/5 font-semibold"
          style={{ fontFamily: "auto",color:"rgb(171 219 219)" }}
        >
          "Smartcampus - Lorem Ipsum Dolor Sit Amet"
        </p>
      </Box>

      <Box>
        <Grid
          container
          spacing={2}
          style={{
            marginTop: "0%",
            backgroundColor: "rgb(31 41 55)",
            padding: "10px",
          }}
        >
          <Grid item xs={12} sm={4}>
            <Grid container justifyContent="center" alignItems="center">
              <LocalShippingIcon className="text-4xl sm:text-2xl text-white" />
              <div style={{ display: "flex", flexDirection: "column",color:"rgb(171 219 219)" }}>
                <p className="ml-2 text-lg sm:text-base ">
                  Lorem Ipsum lorem
                </p>
                <p className="ml-2  text-sm" style={{color:"rgb(171 219 219)"}}>Lorem Ipsum lorem</p>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container justifyContent="center" alignItems="center">
              <SupportAgentIcon className=" text-white sm:text-xl none" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p className="ml-2 text-lg sm:text-base " style={{color:"rgb(171 219 219)"}}>
                  Lorem Ipsum lorem
                </p>
                <p className="ml-2 text-sm" style={{color:"rgb(171 219 219)"}}>Lorem Ipsum lorem</p>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container justifyContent="center" alignItems="center">
              <AttachMoneyIcon className=" text-white sm:text-xl xs:none" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p className="ml-2 text-lg sm:text-base" style={{color:"rgb(171 219 219)"}}>
                  Lorem Ipsum lorem
                </p>
                <p className="ml-2 text-sm" style={{color:"rgb(171 219 219)"}}>Lorem Ipsum lorem</p>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <p className="text-center text-2xl mt-16 mb-20" style={{color:"rgb(171 219 219)"}}>Why Us??</p>
      </Box>

      <Box className="mb-32" >
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            md={4}
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                padding: "27px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <CameraRollSharpIcon
                  style={{ fontSize: "3.5rem", borderRadius: "50%",color:"rgb(171 219 219)" }}
                />
              </p>
              <p >Lorem Ipsum Dolor Sit Amet</p>
              <p >Lorem Ipsum Amet Lorem Ipsum Dolor</p>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} lg={4} md={4}>
            <Box
              style={{
                padding: "27px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <SchoolIcon
                  style={{ fontSize: "3.5rem", borderRadius: "50%",color:"rgb(171 219 219)" }}
                />
              </p>
              <p >Lorem Ipsum Dolor Sit Amet</p>
              <p >Lorem Ipsum Amet Lorem Ipsum Dolor</p>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} lg={4} md={4}>
            <Box
              style={{
                padding: "27px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <CastForEducationIcon
                  style={{ fontSize: "3.3rem", borderRadius: "50%",color:"rgb(171 219 219)" }}
                />
              </p>
              <p >Lorem Ipsum Dolor Sit Amet</p>
              <p >Lorem Ipsum Dolor Sit Amet Lorem</p>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box> 
      <Box className="p-12" style={{backgroundColor:"#F8F6F4"}}>
      <Typography variant="h4" gutterBottom>
        Mission
      </Typography>
      <Typography variant="body1" paragraph>
        At the core of our mission is an unwavering commitment to excellence. We take great pride in offering a comprehensive and easy-to-use platform. It caters to all aspects of student information management, classroom administration, assessment, and reporting. With “Smartcampus,” educational institutions gain a powerful tool that streamlines their daily operations, enhances efficiency, and fosters better student outcomes.
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Intuitiveness and User-Friendliness
      </Typography>
      <Typography variant="body1" paragraph>
        One of the key pillars that sets “Smartcampus” apart is its unparalleled intuitiveness and user-friendliness. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. To further augment this, “Smartcampus” is backed by a team of seasoned experts. They are dedicated to offering personalized service and support, ensuring that our clients receive the assistance they need to optimize their experience with the software.
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Commitment
      </Typography>
      <Typography variant="body1" paragraph>
        Our commitment to delivering the highest quality educational management solutions extends to our valued partners as well. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. This investment in training not only enhances the value of their association with us but also contributes to the overall success of the institutions we serve.
      </Typography>
      
      <Typography variant="body1" paragraph>
        In the rapidly evolving landscape of educational technology, we recognize the importance of staying ahead of the curve. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Through our dedication to innovation, customer service, and the development of high-quality software solutions, “Smartcampus” has earned a reputation as one of the most trusted names in the industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </Typography>
      
      <Typography variant="body1" paragraph>
        In summary, “Smartcampus” offers more than just software; it embodies a transformative solution that drives positive change in educational institutions. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </Typography>
    </Box>
      </Box>
      <footer className="bg-gray-800 text-white p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="font-bold">Contact Information</h3>
            <p>Address, Phone, Email</p>
          </div>
          <div>
            <h3 className="font-bold">Quick Links</h3>
            <p>Admissions, Careers, Privacy Policy</p>
          </div>
          <div>
            <h3 className="font-bold">Newsletter Signup</h3>
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded mt-2 w-full"
            />
          </div>
          <div>
            <h3 className="font-bold">Accreditations and Partnerships</h3>
            <p>Logos or brief mentions</p>
          </div>
        </div>
      </footer>
    </Box>
  );
};
