import React, { useState, useEffect } from "react";
import "./Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorMsg from "./ErrorMsg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box, Avatar, Button,LinearProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { applyLoans, getUsersByUsername } from "../services/userService";
import {
  getRolesFromToken,
  getToken,
  getUsernameFromToken,
} from "../services/LocalStorageService";
import PersonAddSharpIcon from "@mui/icons-material/PersonAddSharp";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const validationSchema = Yup.object({
  loanType: Yup.string().required("Loan type is required"),
  amount: Yup.number().required("Amount is required"),
  disburseAccountNumber: Yup.string().required(
    "Disburse account number is required"
  ),
  empStatus: Yup.string().required("Employment status is required"),
  income: Yup.number().required("Income is required"),
  termInMonths: Yup.string().required("Terms in Months is required"),
  cibilScore: Yup.number().required("CIBIL score is required"),
  userId: Yup.number().required("User ID is required"),
});

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#26B15B",
    },
    secondary: {
      main: "#540C51",
    },
  },
});

const ApplyLoan = ({handleApplyLoan}) => {

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading ,setIsLoading]=useState(false);

  const getUsername = () => {
    const username = getUsernameFromToken();
    console.log(username);
    return username;
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsersByUsername(getUsername(), config);
        console.log(userResponse.data.id, "responseData");
        console.log(userResponse.data, "userResponseData");
        setUserData(userResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const initialValues = {
    loanType: "",
    amount: "",
    disburseAccountNumber: "",
    empStatus: "",
    income: "",
    pancardNumber: userData ? userData.pancardNumber : "",
    termInMonths:"",
    cibilScore: "",
    userId: userData ? userData.id : 0,
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

  const handleSubmit = (values) => {
    setIsLoading(true);
    applyLoans(values,config)
      .then((res) => {
        navigate("");
         handleApplyLoan({data:"Loan Applied"})
         setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        handleApplyLoan({error})
      });
  };

  // Check if userData is null and render loading or form accordingly
  if (userData === null) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* Rest of the code */}
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
          <Avatar sx={{ m: 1, bgcolor: "Green" }}>
            <PersonAddSharpIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Apply for Loan
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="form">
                <div className="form-control">
                  <label htmlFor="loanType">Loan Type</label>
                  <Field as="select" id="loanType" name="loanType">
                    <option value="" disabled>
                      Select Loan Type
                    </option>
                    <option value="PERSONAL">Personal Loan</option>
                    <option value="HOME">Home Loan</option>
                    <option value="STUDENT">Education Loan</option>
                  </Field>
                  <ErrorMessage name="loanType" component={ErrorMsg} />
                </div>

                <div className="form-control">
                  <label htmlFor="amount">Loan Amount</label>
                  <Field type="number" id="amount" name="amount" />
                  <ErrorMessage name="amount" component={ErrorMsg} />
                </div>

                <div className="form-control">
                  <label htmlFor="disburseAccountNumber">
                    Disburse Account Number
                  </label>
                  <Field
                    type="text"
                    id="disburseAccountNumber"
                    name="disburseAccountNumber"
                  />
                  <ErrorMessage
                    name="disburseAccountNumber"
                    component={ErrorMsg}
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="empStatus">Employment Status</label>
                  <Field as="select" id="empStatus" name="empStatus">
                    <option value="" disabled>
                      Select Employment Status
                    </option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="UNEMPLOYEE">UNEMPLOYEE</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="ENTERPRENAUR">ENTERPRENAUR</option>
                  </Field>
                  <ErrorMessage name="empStatus" component={ErrorMsg} />
                </div>

                <div className="form-control">
                  <label htmlFor="income">Income</label>
                  <Field type="number" id="income" name="income" />
                  <ErrorMessage name="income" component={ErrorMsg} />
                </div>

                <div className="form-control">
                  <label htmlFor="termInMonths">Terms in Months</label>
                  <Field type="number" id="termInMonths" name="termInMonths" />
                  <ErrorMessage name="termInMonths" component={ErrorMsg} />
                </div>

                <div className="form-control">
                  <label htmlFor="cibilScore">CIBIL Score</label>
                  <Field type="number" id="cibilScore" name="cibilScore" />
                  <ErrorMessage name="cibilScore" component={ErrorMsg} />
                </div>

                {/* <div className="form-control">
                  <label htmlFor="userId">User ID</label>
                  <Field type="number" id="userId" name="userId" />
                  <ErrorMessage name="userId" component={ErrorMsg} />
                </div> */}

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth 
                >
                  Apply Loan
                </Button>
                {isLoading && <LinearProgress color ="inherit"/>}

              </div>
            </Form>
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ApplyLoan;
