import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { customerUpdateCustomers } from "../services/userService";
import { getToken ,getRolesFromToken} from "../services/LocalStorageService";
import { useLocation,useNavigate } from "react-router-dom";
import {LinearProgress} from "@mui/material";


const UpdateCustomer = ({ editedUser ,handleEditNewUser }) => {
  const [isLoading ,setIsLoading]=useState(false);
    const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string(),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    panNo: Yup.string().required("PAN Number is required"),
  });

  const ErrorMsg = ({ children }) => (
    <Typography variant="caption" color="error">
      {children}
    </Typography>
  );
  const config = {
    headers: {
      "Authorization":"Bearer "+getToken(),
      "Content-Type":"application/json"
    }
  };
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
  const handleSubmit = (values) => {
    setIsLoading(true);
    console.log("tokennn congif wala", config);
    customerUpdateCustomers(values, config)
    .then((res) => {
      navigate("");
      handleEditNewUser({data:"User Edited"})
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      handleEditNewUser({error})
    });
}
  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
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
          Update 
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form">
              {/* <div className="form-control">
                <label htmlFor="username">Username</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component={ErrorMsg} />
              </div> */}

              <div className="form-control">
                <label htmlFor="name">Name</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
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
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
              {isLoading && <LinearProgress color ="inherit"/>}
            </div>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default UpdateCustomer;
