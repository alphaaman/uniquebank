import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createAccount, depositAmount } from "../services/userService";
import ErrorMsg from "./ErrorMsg";
import { getToken } from "../services/LocalStorageService";
import { Button } from "@mui/material";
import { LinearProgress } from "@mui/material";
const validationSchema = Yup.object({
  accountId: Yup.string().required("Account ID is required"),
  narration: Yup.string().required("Narration is required"),
  amount: Yup.number().required("Amount is required"),
  refNo: Yup.string().notRequired(),
});

const Deposit = ({handleDeposit}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    accountId: "",
    narration: "",
    amount: "",
    refNo: "",
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  };

  const handleSubmit = (values) => {
    console.log(values, "values");
    setIsLoading(true);
    setError("");
    depositAmount(values, config)
      .then((res) => {
        handleDeposit({ data: "Deposit Successful" });
        // Handle successful account creation
      })
      .catch((error) => {
        handleDeposit({ error });
        setError("Failed to create account. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  return (
    <div>
      <h1>Deposit</h1>
      {error && <div>{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <div>
              <label htmlFor="accountId">Account ID</label>
              <Field type="text" id="accountId" name="accountId" />
              <ErrorMessage name="accountId" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="narration">Narration</label>
              <Field type="text" id="narration" name="narration" />
              <ErrorMessage name="narration" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <Field type="number" id="amount" name="amount" />
              <ErrorMessage name="amount" component={ErrorMsg} />
            </div>

            <div>
              <label htmlFor="refNo">Reference Number (Optional)</label>
              <Field type="text" id="refNo" name="refNo" />
              <ErrorMessage name="refNo" component={ErrorMsg} />
            </div>

            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Deposit
            </Button>
            {isLoading && <LinearProgress color ="inherit"/>}

          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Deposit;
