import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, Button ,LinearProgress} from "@mui/material";
import { addGiftCard } from "../services/userService"; // Import the API service for adding a gift card
import { getRolesFromToken, getToken } from "../services/LocalStorageService";

const validationSchema = Yup.object({
  giftAmount: Yup.number().required("Gift amount is required"),
  recipientName: Yup.string().required("Recipient name is required"),
  deliverAtRegisteredAddress: Yup.boolean().required(),
  userId: Yup.number().required("User ID is required"),
});

const AddGiftCard = ({handleApplyGiftCard}) => {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    giftAmount:"",
    recipientName: "",
    deliverAtRegisteredAddress: false,
    userId: "",
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    addGiftCard(values, config)
      .then((res) => {
        handleApplyGiftCard({ data: "Gift card applied" });
        // Handle successful response
        console.log("Gift card added successfully", res);
      })
      .catch((error) => {
        // Handle error
        handleApplyGiftCard({ error });
        console.log("Error adding gift card", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const config = {
    headers: {
      "Authorization":"Bearer "+getToken(),
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin": "*",
    }
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
          Add Gift Card
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form">
              <div className="form-control">
                <label htmlFor="giftAmount">Gift Amount</label>
                <Field type="number" id="giftAmount" name="giftAmount" />
                <ErrorMessage name="giftAmount" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="recipientName">Recipient Name</label>
                <Field type="text" id="recipientName" name="recipientName" />
                <ErrorMessage name="recipientName" component="div" />
              </div>

              {/* <div className="form-control">
                <label htmlFor="deliverAtRegisteredAddress">
                  Deliver at Registered Address
                </label>
                <Field
                  type="checkbox"
                  id="deliverAtRegisteredAddress"
                  name="deliverAtRegisteredAddress"
                />
                <ErrorMessage
                  name="deliverAtRegisteredAddress"
                  component="div"
                />
              </div> */}

              <div className="form-control">
                <label htmlFor="userId">User ID</label>
                <Field type="number" id="userId" name="userId" />
                <ErrorMessage name="userId" component="div" />
              </div>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Gift Card
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

export default AddGiftCard;
