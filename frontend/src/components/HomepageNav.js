import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Profile', path: '/profile' },
  { label: 'Bonafide Certificate', path: '/bonafideCertificate' },
  { label: 'Transfer/Leaving Certificate', path: '/leave' },
  { label: 'Change password', path: '/change-password' },
  { label: 'Logout', path: '/logout' }
];

function HomepageNav(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hide, setHide] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      setHide(true);
    } else {
      navigate(path);
      setMobileOpen(false);
    }
  };

  const Logout = () => {
    localStorage.removeItem('accesstoken');
    navigate('/');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Smart Campus
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavigation(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', marginBottom: '0px' }}>
      <CssBaseline />
      <AppBar component="nav" style={{ backgroundColor: 'rgb(59 130 246)' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Smart Campus
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.label} sx={{ color: '#fff' }} onClick={() => handleNavigation(item.path)}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {hide && (
        <Box
          style={{ position: 'fixed', left: '25%', top: '50%' }}
          className="bg-purple-100 w-[65%] w-sm-[50%] w-md-[50%] w-lg-[50%] h-auto p-10 text-purple-700 rounded-md z-20"
        >
          <Typography variant="h6">Logout</Typography>
          <br />
          <Typography variant="body1" className="mb-5">
            Are you sure you want to logout?
          </Typography>
          <Box className="flex gap-5 mt-5">
            <Button variant="contained" onClick={() => setHide(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={Logout}>Sure</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

HomepageNav.propTypes = {
  window: PropTypes.func,
};

export default HomepageNav;
