import React, { useState } from "react";
import "./Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorMsg from "./ErrorMsg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useLocation,useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box, Avatar, Button,LinearProgress } from "@mui/material";
import { register } from "../services/apiService";
import { COLORS } from "./color";
import LockIcon from "@mui/icons-material/Lock";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Update } from "@mui/icons-material";
import { getToken ,getRolesFromToken} from "../services/LocalStorageService";
import { adminUpdateCustomers, adminUpdateEmployees, editUsers ,employeeupdateCustomerUrls, managerUpdateCustomers, managerUpdateEmployees} from "../services/userService";



const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const validationSchema = Yup.object({
  username: Yup.string().required("Username should be unique"),
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  
  address: Yup.string().required("Address is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  phoneNumber: Yup.number().required("Phone number is required"),
  panNo: Yup.string().required("PAN number is required"),
});

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#26B15B',
    },
    secondary: {
      main: '#540C51',
    },
  },
});
const getRole =() =>{
  return getRolesFromToken()
}
const UpdateUser = ({editedUser,handleEditNewUser}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    id:editedUser.id,
    username: editedUser.username,
    name: editedUser.name,
    email: editedUser.email,
    address: editedUser.address,
    dateOfBirth: editedUser.dateOfBirth.slice(0,10),
    phoneNumber: editedUser.phoneNumber,
    panNo: editedUser.panNo,
    role:editedUser.roles,
    accountCreated: editedUser.accountCreated,
  };

  const togglebtn = () => {
    const x = document.getElementById("password");
    const y = document.getElementById("confirmpassword");
    if (x.type === "password") {
      x.type = "text";
      y.type = "text";
      setShow(true);
    } else {
      x.type = "password";
      y.type = "password";
      setShow(false);
    }
  };
  const config = {
    headers: {
      "Authorization":"Bearer "+getToken(),
      "Content-Type":"application/json"
    }
  };
  
  const location = useLocation();
//   const redirectPath = location.state?.path || "/";
const handleSubmit = (values) => {
  setIsLoading(true);
  console.log("tokennn congif wala", config);

  const roles = getRole().split(","); // Split the roles string into an array

  if (roles.includes("ROLE_ADMIN")) {
    console.log("hello")
    if (values.role && values.role.some((role) => role.name === "MANAGER")) {
      console.log("manager")
      editUsers(values, config)
        .then((res) => {
          navigate("");
          handleEditNewUser({data:"edited user"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleEditNewUser({error})
        });
    } 
    else if (values.role && values.role.some((role) => role.name === "EMPLOYEE")) {
      console.log("employee")
      adminUpdateEmployees(values, config)
        .then((res) => {
          navigate("");
          handleEditNewUser({data:"edited user"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleEditNewUser({error})
        });
      }else if (values.role && values.role.some((role) => role.name === "CUSTOMER")) {
        console.log("customer")
        adminUpdateCustomers(values, config)
          .then((res) => {
            navigate("");
            handleEditNewUser({data:"edited user"})
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            handleEditNewUser({error})
          });
      }
  }
  else if (roles.includes("ROLE_MANAGER")) {
    if (values.role && values.role.some((role) => role.name === "EMPLOYEE")) {
      console.log("employee")
      managerUpdateEmployees(values, config)
        .then((res) => {
          navigate("");
          handleEditNewUser({data:"edited user"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleEditNewUser({error})
        });
    } else if (values.role && values.role.some((role) => role.name === "CUSTOMER")) {
      console.log("customer")
      managerUpdateCustomers(values, config)
        .then((res) => {
          navigate("");
          handleEditNewUser({data:"edited user"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleEditNewUser({error})
        });
    }
   
  }  else if (roles.includes("ROLE_EMPLOYEE")) {
    employeeupdateCustomerUrls(values, config)
      .then((res) => {
        
        navigate("/employee");
        handleEditNewUser({data:"edited user"})
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        handleEditNewUser({error})
    
      });
  }
  else  {
    // Handle error for unknown role
    console.log("Unknown role")

  }
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
         <ToastContainer/>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "Pink" }}>
          <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update User
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form><div className="form">
              <div className="form-control">
                <label htmlFor="username">Username</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="name">Name</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" va />
                <ErrorMessage name="email" component={ErrorMsg} />
              </div>
              <div className="form-control">
                <label htmlFor="address">Address</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <Field type="date" id="dateOfBirth" name="dateOfBirth" />
                <ErrorMessage name="dateOfBirth" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">Phone Number</label>
                <Field type="text" id="phoneNumber" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="panNo">PAN Number</label>
                <Field type="text" id="panNo" name="panNo" />
                <ErrorMessage name="panNo" component={ErrorMsg} />
              </div>

              <Button
                type="submit"
                // style={{ backgroundColor: COLORS.Black }}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
              {isLoading && <LinearProgress color="inherit"/>}

              </div>
            </Form>
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdateUser;
