import React, { useState } from "react";
import "./Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorMsg from "./ErrorMsg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useLocation,useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box, Avatar, Button,CircularProgress, LinearProgress} from "@mui/material";
import { register } from "../services/apiService";
import { COLORS } from "./color";
import LockIcon from "@mui/icons-material/Lock";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddSharpIcon from '@mui/icons-material/PersonAddSharp';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Update } from "@mui/icons-material";
import { getRolesFromToken, getToken } from "../services/LocalStorageService";
import { editUsers,addManager,addEmployee,addCustomer, employeeAddCustomers, managerAddEmployees, managerAddCustomers
 } from "../services/userService";



const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const validationSchema = Yup.object({
  username: Yup.string().required("Username should be unique"),
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required.")
    .matches(
      passwordRules,
      "Minimum 5 characters, 1 uppercase, 1 lowercase, 1 numeric"
    ),
  confirmpassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  address: Yup.string().required("Address is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  phoneNumber: Yup.number().required("Phone number is required"),
  panNo: Yup.string().required("PAN number is required"),
  role: Yup.string().required("ROle cannot be null")
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

const AddUser = ({handleAddNewUser}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const initialValues = {
    username: "",
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
  address: "",
  dateOfBirth: "",
  phoneNumber: "",
  panNo: "",
  accountCreated: false,
  role:"",
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
  setError("");
  console.log("tokennn congif wala", config);

  const roles = getRole().split(","); // Split the roles string into an array

  if (roles.includes("ROLE_ADMIN")) {
    if (values.role === "Manager") {
      addManager(values, config)
        .then((res) => {
          navigate("");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
        });
    } else if (values.role === "Employee") {
      addEmployee(values, config)
        .then((res) => {
          navigate("/employee");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
          
          // Handle error for adding Employee
        });
    } else if (values.role === "Customer") {
      addCustomer(values, config)
        .then((res) => {
          navigate("");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
          // Handle error for adding Customer
        });
    }
  } else if (roles.includes("ROLE_MANAGER")) {
    if (values.role === "Employee") {
      managerAddEmployees(values, config)
        .then((res) => {
          navigate("");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
          // Handle error for adding Employees as a Manager
        });
    } else if (values.role === "Customer") {
      managerAddCustomers(values, config)
        .then((res) => {
          navigate("");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
          // Handle error for adding Customers as a Manager
        });
    }
  } else if (roles.includes("ROLE_EMPLOYEE")) {
    if (values.role === "Customer") {
      employeeAddCustomers(values, config)
        .then((res) => {
          navigate("");
          handleAddNewUser({data:"User Created!"})
          setIsLoading(false);
         
        })
        .catch((error) => {
          console.log(error);
          handleAddNewUser({error})
          setError("Cannot Created")
          setIsLoading(false);
          // Handle error for adding Customers as an Employee
        });
    }
    
  } else {
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
          <Avatar sx={{ m: 1, bgcolor: "Green" }}>
          < PersonAddSharpIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New User
          </Typography>
          {error && <div>{error}</div>}

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
  <label htmlFor="role">Role</label>
  <Field as="select" id="role" name="role">
    <option value="" disabled>
      Select Role
    </option>
    {getRole().includes('ROLE_ADMIN') && (
      <>
        <option value="Manager">Manager</option>
      </>
    )}
    {(getRole().includes('ROLE_ADMIN') || getRole().includes('ROLE_MANAGER')) && (
      <>
        <option value="Employee">Employee</option>
      </>
    )}
    <option value="Customer">Customer</option>
  </Field>
  <ErrorMessage name="role" component={ErrorMsg} />
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
                <div className="fd-row">
                  <label htmlFor="password">Password</label>
                  <div className="showhide" onClick={togglebtn}>
                    {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </div>
                </div>

                <Field type="password" id="password" name="password" />

                <ErrorMessage name="password" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <Field
                  type={show ? "text" : "password"}
                  id="confirmpassword"
                  name="confirmpassword"
                />
                <ErrorMessage name="confirmpassword" component={ErrorMsg} />
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
                Add User
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

export default AddUser;
