import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button,LinearProgress } from "@mui/material";
import { setCreditLimit } from "../services/userService"; // Import your API service function

import { getRolesFromToken, getToken } from "../services/LocalStorageService";

const validationSchema = Yup.object({
  amount: Yup.number().required("Amount is required"),
});

const SetCreditLimit = ({ editedUser, handleSetLimit }) => {
  console.log("edited", editedUser.id);
  console.log(getRolesFromToken(), "roles");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    amount: "",
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
  
    setCreditLimit(editedUser.id, values.amount, config)
      .then((res) => {
        handleSetLimit({ data: "Set Limit Successful" });
        console.log(res);
      })
      .catch((error) => {
        handleSetLimit({ error });
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Rest of your component code...

 

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
          Set Credit Limit
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-control">
              <label htmlFor="amount">Amount</label>
              <Field type="number" id="amount" name="amount" />
              <ErrorMessage name="amount" component="div" className="error" />
            </div>

            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Set Credit Limit
            </Button>
            <div>            {isLoading && <LinearProgress color ="inherit"/>}
</div>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default SetCreditLimit;
