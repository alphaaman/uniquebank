import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button ,LinearProgress} from "@mui/material";
import { addBalanceGiftCard } from "../services/userService"; // Import your API service function

import { getRolesFromToken, getToken } from "../services/LocalStorageService";
const validationSchema = Yup.object({
  amount: Yup.number().required("Amount is required"),
});

const AddGiftCardBalance = ({ editedUser, handleAddGiftCardBalance }) => {
  console.log("edited", editedUser.id);
  console.log(getRolesFromToken(), "roles");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    amount: "",
    cardnumber: editedUser.cardNumber,
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  console.log(getRolesFromToken(), "roles");

  const handleSubmit = (values) => {
    setIsLoading(true);
    addBalanceGiftCard(values, config)
      .then((res) => {
        handleAddGiftCardBalance({ data: "Balance added" });
        console.log(res);
      })
      .catch((error) => {
        handleAddGiftCardBalance({ error });
        console.log(error);
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
          Add Gift Card Balance
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

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Balance
            </Button>
            <div>            {isLoading && <LinearProgress color ="inherit"/>}
</div>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default AddGiftCardBalance;
