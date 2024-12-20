import React, { useState } from "react";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorMsg from "./ErrorMsg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { storeToken, getRolesFromToken } from "../services/LocalStorageService";
import { useAuth } from "../utility/auth";
import { authenticate } from "../services/apiService";
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";
import {toast, ToastContainer} from 'react-toastify';
import "./Login.css";
import ForgotUsername from "./ForgotUsername";
import ForgotPassword from "./ForgotPassword";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Link } from 'react-router-dom';
const initialValues = {
  username: "",
  password: "",
};

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const validationSchema = Yup.object({
  username: Yup.string().required("Username required"),
  password: Yup.string().required("No password provided."),
});

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Royal Blue
    },
    secondary: {
      main: "#f44336", // Red
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectPath = location.state?.path || "/employee";
  const [isLoading, setIsLoading] = useState(false);
  const [openForgotUsernameDialog, setOpenForgotUsernameDialog] = useState(false);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);

  const handleOpenForgotUsernameDialog = () => {
    setOpenForgotUsernameDialog(true);
  };

  const handleCloseForgotUsernameDialog = () => {
    setOpenForgotUsernameDialog(false);
  };

  const handleOpenForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(true);
  };

  const handleCloseForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(false);
  };
  const onSubmit = async (values) => {
    console.log("Form Data = ", values);

    setIsLoading(true); // Set loading state to true

    authenticate(values)
      .then((res) => {
        const token = res.data.token;
        storeToken(token);
        auth.login(values.username, token);
        const roles = getRolesFromToken();
        console.log(roles.includes("ROLE_ADMIN"), "includes");

        if (roles.includes("ROLE_ADMIN")) {
          console.log("Navigating to redirect path:", redirectPath);
          navigate(redirectPath, { replace: true });
          toast.success("Logged In")
        } else if (roles.includes("ROLE_MANAGER")) {
          console.log("Navigating to /employee manager");
          navigate("/employee", { replace: true });
          toast.success("Logged In")
        } else if (roles.includes("ROLE_EMPLOYEE")) {
          console.log("Navigating to /employee");
          navigate("/employee", { replace: true });
          toast.success("Logged In")
        } else {
          console.log("Navigating to /customer");
          navigate("/customer/profile", { replace: true });
          toast.success("Logged In")
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Incorrect Username or Password please check !")
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false
      });
  };

  const [show, setShow] = useState(false);

  const togglebtn = () => {
    const x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setShow(true);
    } else {
      x.type = "password";
      setShow(false);
    }
  };
  const handleForgotPassword =(e)=>{
    if(e.data){
      console.log(e)
      handleCloseForgotPasswordDialog();

      return
    }
  }

  return (
    <>
    <ToastContainer/>
    
      {isLoading && (
        // Show loading indicator while isLoading is true
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <ThemeProvider theme={customTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form className="form-container">
                <div className="form-control">
                  <label htmlFor="username">Username</label>
                  <Field type="text" id="username" name="username" />
                  <ErrorMessage name="username">
                    {(errorMsg) => <div className="error">{errorMsg}</div>}
                  </ErrorMessage>
                </div>

                <div className="form-control">
                  <div className="fd-row">
                    <label htmlFor="password">Password</label>
                    <div className="showhide" onClick={togglebtn}>
                      {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </div>
                  </div>

                  <Field type="password" id="password" name="password" />

                  <ErrorMessage name="password" component={ErrorMsg} />
                </div>
                <div style={{display:"flex", justifyContent:"space-between",width:"23vw"}}>
                <Link component="button" onClick={handleOpenForgotUsernameDialog} style={{color:"#97144d",fontWeight:"bold"}}>Forgot Username ?</Link>
                <Link component="button" onClick={handleOpenForgotPasswordDialog} style={{color:"#97144d",fontWeight:"bold"}}>Forgot Password ?</Link>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </Form>
            </Formik>
          </Box>
        </Container>
      </ThemeProvider>
      <Dialog open={openForgotUsernameDialog} onClose={handleCloseForgotUsernameDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openForgotUsernameDialog && <ForgotUsername/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotUsernameDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openForgotPasswordDialog} onClose={handleCloseForgotPasswordDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openForgotPasswordDialog && <ForgotPassword handleForgotPassword ={(e)=>handleForgotPassword(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPasswordDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
