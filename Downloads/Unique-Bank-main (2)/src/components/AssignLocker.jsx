import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button,LinearProgress } from "@mui/material";
import { assignLocker } from "../services/userService"; // Import the API service for assigning a locker
import { getToken } from "../services/LocalStorageService";

const validationSchema = Yup.object({
  fromAccountId: Yup.string().required("From Account ID is required"),
  durationMonths: Yup.number()
    .required("Duration in months is required")
    .positive("Duration in months must be a positive number"),
});

const AssignLocker = ({handleAssignLocker}) => {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    fromAccountId: "",
    durationMonths: "",
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  };

  const handleSubmit = (values) => {
 
    setIsLoading(true)
    assignLocker(values, config)
      .then((res) => {
        handleAssignLocker({data:"Locker Assigned"})

        // Handle successful response
        console.log("Locker assigned successfully", res);
      })
      .catch((error) => {
        // Handle error
        handleAssignLocker({error})
        console.log("Error assigning locker", error);
      })
      .finally(() => {
     
        setIsLoading(false);
      });
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
          Assign Locker
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form">
              <div className="form-control">
                <label htmlFor="fromAccountId">Account ID</label>
                <Field type="text" id="fromAccountId" name="fromAccountId" />
                <ErrorMessage name="fromAccountId" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="durationMonths">Duration in Months</label>
                <Field type="number" id="durationMonths" name="durationMonths" />
                <ErrorMessage name="durationMonths" component="div" />
              </div>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Assign Locker
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

export default AssignLocker;
