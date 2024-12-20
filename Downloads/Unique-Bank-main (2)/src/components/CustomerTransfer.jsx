import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { transferAmount, getUsersByUsername, getCustomerAccountsByUserId } from "../services/userService";
import ErrorMsg from "./ErrorMsg";
import { getRolesFromToken, getToken, getUsernameFromToken } from "../services/LocalStorageService";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRoles } from "@testing-library/react";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {LinearProgress} from "@mui/material";

const validationSchema = Yup.object({
  fromAccountId: Yup.string().required("From Account ID is required"),
  toAccountId: Yup.string().required("To Account ID is required"),
  amount: Yup.number().required("Amount is required"),
  narration: Yup.string().required("Narration is required"),
});

const role = getRolesFromToken();
const username = getUsernameFromToken();

const CustomerTransfer = ({handleTransfer}) => {
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [fromAccountId, setFromAccountId] = useState("");
  const [isLoading ,setIsLoading]=useState(false);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(username,"username")
        const userResponse = await getUsersByUsername(username, config);
        console.log(userResponse.data.id, "userresponseData");
        const accountResponse = await getCustomerAccountsByUserId(userResponse.data.id, config);
        console.log(accountResponse.data, "accountresponseData");

        setData(accountResponse.data);

        // Check if accountResponse.data has the accountId property
        if (accountResponse.data && accountResponse.data.accountId) {
          setFromAccountId(accountResponse.data.accountId); // Set the accountId as fromAccountId
        }

        // No need for console.log here
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(fromAccountId, "fromAccountId"); // Log the fromAccountId value
  }, [fromAccountId]);

  const handleSubmit = (values) => {
    setIsLoading(true);
    const roles = getRolesFromToken();
    console.log(roles.includes("ROLE_CUSTOMER"), "includes");
  
    transferAmount(values, config)
      .then((res) => {
        handleTransfer({data:"Transfer Successfull"})
        navigate("/customer/transaction");
      setIsLoading(false);
      })
      .catch((error) => {
        setError("Failed to transfer amount. Please try again.");
      });
  };

  return (
    <div>
      <h1>Transfer</h1>
      <h1>{fromAccountId}</h1>
      {error && <div>{error}</div>}
      {fromAccountId && ( // Render the Formik component only if fromAccountId is available
        <Formik
          initialValues={{
            fromAccountId: fromAccountId, // Use the fromAccountId state
            toAccountId: "",
            amount: "",
            narration: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              {/* <div>
                <label htmlFor="fromAccountId">From Account ID</label>
                <Field type="text" id="fromAccountId" name="fromAccountId" disabled={!!fromAccountId} />
                <ErrorMessage name="fromAccountId" component={ErrorMsg} />
              </div> */}

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
      )}
    </div>
  );
};

export default CustomerTransfer;