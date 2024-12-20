import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../utility/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getToken,
  removeToken,
  getRolesFromToken,
} from "../services/LocalStorageService";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import logo from "../assets/UNIQUE BANKS.png";
import "./Header.css";
import AddUser from "./AddUser";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#97144d",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const token = getToken();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    removeToken("token");
    navigate("/");
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <img src={logo} alt="Logo" className="logo" />

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavLink className="navbar-item" to="/" color="inherit" exact>
              <Typography
                variant="button"
                color="secondary"
                sx={{
                  marginRight: 1,
                  textDecoration: "none",
                }}
              >
                Home
              </Typography>
            </NavLink>
            <NavLink className="navbar-item" to="/about" color="inherit">
              <Typography
                variant="button"
                color="secondary"
                sx={{
                  marginRight: 1,
                  textDecoration: "none",
                }}
              >
                About Us
              </Typography>
            </NavLink>
            <NavLink className="navbar-item" to="/contact" color="inherit">
              <Typography
                variant="button"
                color="secondary"
                sx={{
                  marginRight: 1,
                  textDecoration: "none",
                }}
              >
                Contact Us
              </Typography>
            </NavLink>
            <NavLink
              className="navbar-item"
              to="/rural-banking"
              color="inherit"
            >
              <Typography
                variant="button"
                color="secondary"
                sx={{
                  marginRight: 1,
                  textDecoration: "none",
                }}
              >
                Rural Banking
              </Typography>
            </NavLink>
            {token == null ? (
              <>
                <NavLink className="navbar-item" to="/login" color="inherit">
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{ marginRight: 1 }}
                  >
                    Login
                  </Button>
                </NavLink>
                <NavLink className="navbar-item" to="/register" color="inherit">
                  <Button color="secondary" variant="contained">
                    Register
                  </Button>
                </NavLink>
              </>
            ) : (
              <Button color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
      <Drawer anchor="left" open={isSidebarOpen} onClose={handleCloseSidebar}>
        <Box
          sx={{
            backgroundColor: "#97144d",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton color="inherit" onClick={handleCloseSidebar}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <List
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ListItem
              button
              component={NavLink}
              to="/users"
              exact
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Users"
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/add"
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Add New User"
              />
            </ListItem>

            <ListItem
              button
              component={NavLink}
              to="/gift-card"
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Gift Card"
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/loan"
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Loan"
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/locker"
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Locker"
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/transactions"
              onClick={handleCloseSidebar}
            >
              <ListItemText
                primaryTypographyProps={{
                  variant: "button",
                  fontWeight: "bold",
                  color: "white",
                }}
                primary="Transactions"
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Dashboard */}
      {location.pathname === "/users" && <Dashboard />}
      {location.pathname === "/add" && <AddUser />}{" "}
      {/* Render Dashboard only on the /users route */}
    </ThemeProvider>
  );
}
