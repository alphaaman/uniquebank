import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
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
} from "../services/userService";
import chip from "../assets/chip.png";
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

export default function Cards() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsersByUsername(getUsername(), config);
        console.log(userResponse.data.id, "responseData");
        const response = await getCustomerGiftCardsByUserId(
          userResponse.data.id,
          config
        );
        console.log("gift Card data", response.data);
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

  return (
    <>
      <div style={{ display: "flex" }}>
        <CustomerSidebar />
        <section className="vh-100 personal-profile-section">
          {data.length > 0 ? (
            data.map((giftCard) => (
              <div className="py-5 h-100 personal-profile-container">
                <div className="justify-content-center align-items-center h-100">
                  <div className="mb-4 mb-lg-0">
                    <div className="mb-3 personal-profile-card">
                      <div
                        key={giftCard.id}
                        className="gradient-custom text-center text-white personal-profile-card-header"
                      >
                        <div
                          className="avatar-container"
                          style={{ margin: "1rem" }}
                        >
                          <div className="credit-card">
                            <div
                              className="card-number"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              {giftCard.cardNumber}
                              <img
                                src={chip}
                                alt="Chip"
                                className="chip"
                                style={{
                                  height: "2rem",
                                  borderRadius: "0.2rem",
                                }}
                              ></img>
                            </div>
                            <div className="card-holder">
                              {giftCard.recipientName}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div className="card-expiry">
                                {expiryFormatDate(giftCard.expirationDate)}
                              </div>
                              <div style={{ fontFamily: "cursive" }}>
                                UNIQUE BANK
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="personal-profile-card-body">
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold" }}
                        >
                          Gift Card Information
                        </Typography>
                        <hr className="mt-0 mb-4" />
                        {data.length > 0 ? (
                          <div className="pt-1">
                            <Card key={giftCard.id} className="loan-card">
                              <CardContent>
                                <div className="loan-info-row">
                                  <div className="loan-info-column">
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Gift Card Number
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-muted"
                                    >
                                      {giftCard.cardNumber}
                                    </Typography>
                                  </div>
                                  <div className="loan-info-column">
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Recipient Name
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-muted"
                                    >
                                      {giftCard.recipientName}
                                    </Typography>
                                  </div>
                                  {/* Add more fields here as required */}
                                  <div className="loan-info-column">
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Expiration Date
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-muted"
                                    >
                                      {expiryFormatDate(
                                        giftCard.expirationDate
                                      )}
                                    </Typography>
                                  </div>
                                  <div className="loan-info-column">
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Gift Amount
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-muted"
                                    >
                                      {giftCard.giftAmount}
                                    </Typography>
                                  </div>
                                  {/* Add more fields here as required */}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <Typography
                            variant="body2"
                            className="text-muted"
                          >
                            No gift card
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
           
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
                    <Typography
                            variant="body2"
                            className="text-muted"
                            style={{ fontWeight: "bold" }}
                          >
                            No gift card Found
                          </Typography>
                          </div>
                        </div>
                      </div>
                      </div>
                      </div>
          )}
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
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Apply Loan</DialogTitle>
        <DialogContent>
          <ApplyLoan />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoanDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
