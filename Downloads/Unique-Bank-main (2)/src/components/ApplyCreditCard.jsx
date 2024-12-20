import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button,LinearProgress } from "@mui/material";
import { applyCreditCard } from "../services/userService"; // Import the API service for applying for a credit card
import { getRolesFromToken, getToken } from "../services/LocalStorageService";

const validationSchema = Yup.object({
  cardHolderName: Yup.string().required("Card holder name is required"),
  cardType: Yup.string().required("Card type is required"),
  creditLimit: Yup.number().required("Credit limit is required"),
  income: Yup.number().required("Income is required"),
  age: Yup.number().required("Age is required"),
});

const ApplyCreditCard = ({handleApplyCreditCard}) => {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    cardHolderName: "",
    cardType: "",
    creditLimit: "",
    income: "",
    age: "",
  };

  const config = {
    headers: {
      "Authorization":"Bearer "+getToken(),
      "Content-Type":"application/json"
    }
  };
  

  const handleSubmit = (values) => {
    setIsLoading(true);
    applyCreditCard(values,config)
      .then((res) => {
        handleApplyCreditCard({data:"Credit Card Applied"})
        // Handle successful response
        console.log("Credit card applied successfully", res);
      })
      .catch((error) => {
        // Handle error
        handleApplyCreditCard({error})
        console.log("Error applying for credit card", error);
      })
      .finally(()=>{
        setIsLoading(false)
    
  })
};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Apply for Credit Card
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form">
              <div className="form-control">
                <label htmlFor="cardHolderName">Username</label>
                <Field type="text" id="cardHolderName" name="cardHolderName" />
                <ErrorMessage name="cardHolderName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="cardType">Card Type</label>
                <Field type="text" id="cardType" name="cardType" />
                <ErrorMessage name="cardType" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="creditLimit">Credit Limit</label>
                <Field type="number" id="creditLimit" name="creditLimit" />
                <ErrorMessage name="creditLimit" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="income">Income</label>
                <Field type="number" id="income" name="income" />
                <ErrorMessage name="income" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="age">Age</label>
                <Field type="number" id="age" name="age" />
                <ErrorMessage name="age" component="div" />
              </div>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Apply for Credit Card
              </Button>
              <div>            {isLoading && <LinearProgress color ="inherit"/>}
</div>
            </div>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default ApplyCreditCard;
