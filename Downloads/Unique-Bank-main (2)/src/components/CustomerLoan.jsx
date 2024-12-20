import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PersonalProfile.css"; // Import the new CSS file
import {
  getUsernameFromToken,
  getToken,
} from "../services/LocalStorageService";
import {
  getCustomerAccountsByUserId,
  getCustomerLoansByUserId,
  getUsersByUsername,
} from "../services/userService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import UpdateCustomer from "./UpdateCustomer";
import CustomerSidebar from "./CustomerSidebar";
import ApplyLoan from "./ApplyLoan";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function CustomerLoan() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const getUsername = () => {
    const username = getUsernameFromToken();
    console.log(username);
    return username;
  };

  const handleEditClick = (user) => {
    console.log(user, "user");
    setEditedUser(user);
    setOpenEditDialog(true);
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const handleFetchData = async () => {
    try {
      const userResponse = await getUsersByUsername(getUsername(), config);
      console.log(userResponse.data.id, "responseData");
      const response = await getCustomerLoansByUserId(
        userResponse.data.id,
        config
      );
      console.log("Loan data ", response.data);
      setData(response.data);
      setUserData(userResponse.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetchData();
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

  const handleApplyLoan = (result) => {
    if (result) {
      setOpenEditDialog(false);
      handleFetchData();
      toast.success("Loan applied successfully!");
    } else {
      toast.error("Loan application unsuccessful");
    }
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
                    <div
                      className="avatar-container"
                      style={{ margin: "1rem" }}
                    >
                      <Avatar style={avatarStyles}></Avatar>
                    </div>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      {userData.username}
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      {userData.name}
                    </Typography>
                    <IconButton
                      style={buttonStyles}
                      aria-label="edit"
                      onClick={() => handleEditClick(data)}
                    >
                      <ModeEditOutlineIcon />
                      <Typography>Apply Loan</Typography>
                    </IconButton>
                  </div>
                  {data.map((loan) => (
                  <div
                    className="personal-profile-card-body"
                    style={{ maxWidth: "600px", margin: "0 auto" }}
                  >
                    
                    <Typography
                      variant="h6"
                      style={{ fontWeight: "bold" }}
                    >
                      Loan Information
                    </Typography>
                    <hr className="mt-0 mb-4" />
                    {data.length > 0 ? (
                      <div className="pt-1">
                        
                          <Card key={loan.id} className="loan-card">
                            <CardContent>
                              <div className="loan-info-row">
                                <div className="loan-info-column">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Loan Type
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.loanType}
                                  </Typography>
                                </div>
                                <div className="loan-info-column">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Loan Number
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.loanNumber}
                                  </Typography>
                                </div>
                                <div className="loan-info-column">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Amount
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.amount}
                                  </Typography>
                                </div>
                                <div className="loan-info-column">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Interest Rate
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.interestRate}
                                  </Typography>
                                </div>
                                <div className="loan-info-column">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Status
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.status}
                                  </Typography>
                                </div>
                                <div className="mb-3">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    EMI
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.emi}
                                  </Typography>
                                </div>
                                <div className="mb-3">
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Paid Months
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-muted"
                                  >
                                    {loan.paidMonths}
                                  </Typography>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                       
                      </div>
                    ) : (
                      <Typography variant="body2" className="text-muted">
                        No loans found.
                      </Typography>
                    )}
                  </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <ApplyLoan handleApplyLoan={(e) => handleApplyLoan(e)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
