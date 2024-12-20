import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import "./PersonalProfile.css"; 
import {
  getUsernameFromToken,
  getToken,
} from "../services/LocalStorageService";
import {
  getCustomerAccountsByUserId,
  getCustomerLoansByUserId,
  getCustomerLockersByUserId,
  getUsersByUsername,
  getCustomerGiftCardsByUserId,
  getCreditCardsByCardHolderName,
  payDue
} from "../services/userService";
import chip from "../assets/chip.png";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {LinearProgress} from "@mui/material";

import UpdateCustomer from "./UpdateCustomer";
import CustomerSidebar from "./CustomerSidebar";
import ApplyLoan from "./ApplyLoan";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TextField } from "@mui/material";

export default function CustomerCreditCard() {
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [payDueAmount,setPayDueAmount]=useState({});
  const [paymentAmount, setPaymentAmount] = useState();
  const [isLoading ,setIsLoading]=useState(false);

  const handleEditClick = (user) => {
    console.log(user, "user");
    setEditedUser(user);
    setOpenEditDialog(true);
  };

  const handlePayDueClick = (user) => {
 
    setEditedUser(user);
    setOpenLoanDialog(true);
    setPayDueAmount(user)
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsersByUsername(getUsernameFromToken(), config);
        console.log(userResponse.data.id, "responseData");
        const response = await getCreditCardsByCardHolderName(
          getUsernameFromToken(),
          config
        );
        console.log("Credit Card data", response.data);
        setData(response.data);
        setUserData(userResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const avatarStyles = {
    width: "50px",
    height: "50px",
    fontSize: "20px",
    backgroundColor: "#FF9300",
    color: "white",
    textAlign: "center",
    margin: "auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonStyles = {
    color: "black",
    margin: "1rem",
    width: "10rem",
    borderColor: "Golden",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "4px",

  };

  const expiryFormatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  const handlePayNow = (values) => {
    setIsLoading(true);
    const requestBody = {
      amount: paymentAmount,
      id: values["id"],
    };
  
    payDue(requestBody, config)
      .then((response) => {
        // Handle successful payment
        console.log("Payment successful");
        toast.success("Your due has been paid successfully!");
      
      })

      .catch((error) => {
        // Handle payment error
        console.log("Payment error:", error);
        toast.error("Payment failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
        // Reset paymentAmount and close the dialog
        setPaymentAmount(0);
        setOpenLoanDialog(false);
      });
  
  
  };
  

  return (
    <>
    <ToastContainer />
      <div style={{ display: "flex" }}>
        <CustomerSidebar />
        <section className="vh-100 personal-profile-section">
          <div className="py-5 h-100 personal-profile-container">
            <div className="justify-content-center align-items-center h-100">
              <div className="mb-4 mb-lg-0">
                <div className="mb-3 personal-profile-card">
                  <div className="gradient-custom text-center text-white personal-profile-card-header">
                    <div className="avatar-container" style={{ margin: "1rem" }}>
                      <div className="credit-card">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                          <div className="card-number">
                            {data.cardNumber}
                          </div>
                          <div className="card-number" >
                            {data.cardType}
                          </div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div className="card-holder">{data.cardHolderName}</div>
                        <div> <img src={chip} alt="Chip" class="chip" style={{height:"2rem", borderRadius:"0.2rem"}}></img>
</div></div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        {Object.keys(data).length === 0 ? ( // Check if data object is empty
                    <Typography variant="body2" className="text-muted">
                      No credit cards found.
                    </Typography>
                  ) : 
                      (    <div>CVV : {data.cvv}</div>)}
                          <div className="card-expiry" style={{display:"flex",justifyContent:"flex-end"}}>
                            {data.expiryDate}
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <IconButton
                      style={buttonStyles}
                      aria-label="pay-due"
                      onClick={() => handlePayDueClick(data)}
                      disabled={Object.keys(data).length === 0} 
                    >
                      <ModeEditOutlineIcon />
                      <Typography>Pay Due</Typography>
                    </IconButton>
                    
                  </div>

                  <div
                    className="personal-profile-card-body"
                    style={{ maxWidth: "600px", margin: "0 auto" }}
                  >
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                      Credit Card Information
                    </Typography>
                    <hr className="mt-0 mb-4" />
                    {Object.keys(data).length === 0 ? ( // Check if data object is empty
                    <Typography variant="body2" className="text-muted">
                      No credit cards found.
                    </Typography>
                  ) : (
                    <div className="pt-1">
    
                      <Card className="loan-card">
                        <CardContent>
                          <div className="loan-info-row">
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Credit Card Number
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {data.cardNumber}
                              </Typography>
                            </div>
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Card Holder Name
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {data.cardHolderName}
                              </Typography>
                            </div>
                            {/* Add more fields here as required */}
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Card Limit
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {data.creditLimit}
                              </Typography>
                            </div>
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Last Payment Date
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {formatDate (data.lastPaymentDate)}
                              </Typography>
                            </div>
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Due Amount 
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {data.dueAmount}
                              </Typography>
                            </div>
                            <div className="loan-info-column">
                              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                Balance Amount 
                              </Typography>
                              <Typography variant="body2" className="text-muted">
                                {data.balance}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <UpdateCustomer user={editedUser} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Loan Dialog */}
      <Dialog
  open={openLoanDialog}
  onClose={() => setOpenLoanDialog(false)}
  maxWidth="sm"
>
  <DialogTitle>
    <Typography variant="h6">Pay Due</Typography>
  </DialogTitle>
  <DialogContent>
    <div style={{ padding: '1rem' }}>
      <TextField
        label="Payment Amount"
        variant="outlined"
        type="number"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => handlePayNow(data)}
        fullWidth
      >
        Pay Now
      </Button>
      {isLoading && <LinearProgress color="primary" style={{ marginTop: '1rem' }} />}
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenLoanDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}