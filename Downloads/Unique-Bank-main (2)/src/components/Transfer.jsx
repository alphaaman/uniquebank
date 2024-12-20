import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { transferAmount } from "../services/userService";
import ErrorMsg from "./ErrorMsg";
import { getToken } from "../services/LocalStorageService";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
const validationSchema = Yup.object({
  fromAccountId: Yup.string().required("From Account ID is required"),
  toAccountId: Yup.string().required("To Account ID is required"),
  amount: Yup.number().required("Amount is required"),
  narration: Yup.string().required("Narration is required"),
});

const Transfer = ({handleTransfer}) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    narration: "",
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    setError("");
  
    transferAmount(values, config)
      .then((res) => {
        handleTransfer({ data: "Transfer Successful" });
        navigate("");
        // Handle successful transfer
      })
      .catch((error) => {
        handleTransfer({ error });
        setError("Failed to transfer amount. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  return (
    <div>
      <h1>Transfer</h1>
      {error && <div>{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <div>
              <label htmlFor="fromAccountId">From Account ID</label>
              <Field type="text" id="fromAccountId" name="fromAccountId" />
              <ErrorMessage name="fromAccountId" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="toAccountId">To Account ID</label>
              <Field type="text" id="toAccountId" name="toAccountId" />
              <ErrorMessage name="toAccountId" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <Field type="number" id="amount" name="amount" />
              <ErrorMessage name="amount" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="narration">Narration</label>
              <Field type="text" id="narration" name="narration" />
              <ErrorMessage name="narration" component={ErrorMsg} />
            </div>

            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Transfer
            </Button>
            {isLoading && <LinearProgress color ="inherit"/>}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Transfer;