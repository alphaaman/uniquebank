import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button,LinearProgress } from "@mui/material";
import { emiCalculator } from "../services/userService";
import ErrorMsg from "./ErrorMsg";
import { getToken } from "../services/LocalStorageService";

const validationSchema = Yup.object({
  amount: Yup.number().required("Amount is required"),
  interestRate: Yup.number().required("Interest rate is required"),
  termInMonths: Yup.number().required("Term in months is required"),
});

const CalculateEMI = () => {
  const initialValues = {
    amount: "",
    interestRate: "",
    termInMonths: "",
  };
  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const [emi, setEmi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = (values) => {
  setIsLoading(true);

  emiCalculator(values, config)
    .then((res) => {
      console.log(res.data, "emi");
      setEmi(res.data);
    })
    .catch((error) => {
      console.log(error);
      // Handle error
    })
    .finally(() => {
      setIsLoading(false);
    });
};


  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">
          Calculate EMI
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <div className="form">
              <div className="form-control">
                <label htmlFor="amount">Loan Amount</label>
                <Field type="number" id="amount" name="amount" />
                <ErrorMessage name="amount" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="interestRate">Interest Rate</label>
                <Field type="number" id="interestRate" name="interestRate" />
                <ErrorMessage name="interestRate" component={ErrorMsg} />
              </div>

              <div className="form-control">
                <label htmlFor="termInMonths">Term in Months</label>
                <Field type="number" id="termInMonths" name="termInMonths" />
                <ErrorMessage name="termInMonths" component={ErrorMsg} />
              </div>

              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Calculate
              </Button>
              <div>            {isLoading && <LinearProgress color ="inherit"/>}
</div>
              {emi > 0 && (
                <div className="form-control">
                  <label htmlFor="emi">EMI</label>
                  
                  <div>{emi}</div>
                </div>
              )}
            </div>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default CalculateEMI;
