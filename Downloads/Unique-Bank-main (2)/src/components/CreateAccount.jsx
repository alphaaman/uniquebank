import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/userService";
import ErrorMsg from "./ErrorMsg";
import { getToken } from "../services/LocalStorageService";

import { Container, Typography, Box, Avatar, Button ,CircularProgress,LinearProgress,Backdrop,Skeleton} from "@mui/material";
const validationSchema = Yup.object({
  accountType: Yup.string().required("Account Type is required"),
  deposit: Yup.number().required("Deposit amount is required"),
  userId: Yup.number().required("User Id is required"),
});


const CreateAccount = ({handleCreateAccount}) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues = {
    accountType: "",
    deposit: "",
    userId:"",
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  };

  const handleSubmit = (values) => {
    console.log(values,"balues")
    setIsLoading(true);
    setError("");
    createAccount(values, config)
        
      .then((res) => {
        navigate("/account"); 
        handleCreateAccount({data:"Account Successfully Created "})
      })
      .catch((error) => {
        setError("Failed to create account. Please try again.");
        handleCreateAccount({error})
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1>Create Account</h1>
    {/* Display the loader if isLoading is true */}
   
      {error && <div>{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <div>
              <label htmlFor="accountType">Account Type</label>
              <Field as="select" id="accountType" name="accountType">
                <option value="" disabled>
                  Select Account Type
                </option>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
              </Field>
              <ErrorMessage name="accountType" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="deposit">Deposit Amount</label>
              <Field type="number" id="deposit" name="deposit" />
              <ErrorMessage name="deposit" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="userId">User Id</label>
              <Field type="number" id="userId" name="userId" />
              <ErrorMessage name="userId" component={ErrorMsg} />
            </div>

            <Button type="submit" 
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>Create</Button>
{/* <Backdrop open={isLoading} style={{ zIndex: 999 }}>
  <CircularProgress color="inherit" />
</Backdrop> */}
{isLoading && <LinearProgress color="inherit"/>}
</div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateAccount;
