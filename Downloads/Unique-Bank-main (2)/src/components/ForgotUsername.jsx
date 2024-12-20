import React, { useState } from 'react';
import { getToken } from "../services/LocalStorageService";
import { getUsersFromEmail, sendEmailToBank } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import { Container, Typography, Box, Avatar ,CircularProgress,LinearProgress,Backdrop,Skeleton} from "@mui/material";

const ForgotUsername = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  function generateOTP() {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits[randomIndex];
    }

    return otp;
  }

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const otp = generateOTP();
      setOtp(otp);
      
      const emailData = {
        to: email,
        subject: "Username Recovery Request - One-Time Password (OTP)",
        message: `Dear Customer,
        
        Welcome to Unique Bank! We would like to express our gratitude for choosing our services.
        
        We have received a request regarding a forgotten username for your Unique Bank account. To assist you in recovering your username, we have generated a One-Time Password (OTP).
        
        Please find your OTP below:
        
        OTP: ${otp}
        
        To proceed with username recovery, please follow these steps:
        
        1. Visit the Unique Bank website/app login page.
        2. Click on the "Forgot Username" link.
        3. Enter your registered email address and the OTP provided above.
        4. Follow the instructions on the screen to retrieve your username.
        
        
        If you did not initiate this username recovery request, kindly disregard this email. Your account is secure, and no changes will be made.
        
        If you require any further assistance or have any questions, please don't hesitate to contact our dedicated support team at +91 9876543210. We are here to help.
        
        Thank you for choosing Unique Bank.
        
        Best regards,
        Unique Bank`,
      };

      const response = await sendEmailToBank(emailData);
      toast.success(`OTP Sent Successfully on ${email} please check`)

      setOtpSent(true);
    } catch (error) {
        toast.error("otp not sent please verify your email")

      setErrorMessage('Failed to send OTP. Please try again.');
    }finally{
        setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    
    if (userEnteredOtp === '') {
      setErrorMessage('OTP cannot be null. Please try again.');
    } else if (userEnteredOtp === otp) {
        setIsLoading(true);
      try {
        const response = await getUsersFromEmail(email);
        setUsername(response.data.username);
        setOtpVerified(true);
        setUserEnteredOtp('');
        setOtp('');
        setErrorMessage('');
        toast.success("OTP Verified");
      } catch (error) {
        setErrorMessage('Invalid OTP. Please try again.');
        toast.error("Please enter a valid OTP.");
      }finally{
        setIsLoading(false);
    }
    } else {
      setErrorMessage('Incorrect OTP entered. Please check it.');
    }
  };

  const getEmailForm = () => (
    <div>
      <h2>Forgot Username</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      
      <Button variant="contained" color="primary" style={{ height: "1.8rem" }} onClick={sendOtp}>Send OTP</Button>
      {isLoading && <LinearProgress style={{margin:"1rem"}} color="inherit"/>}
    </div>
  );

  const getOtpForm = () => (
    <div>
      <h2>Forgot Username</h2>
      <label>OTP:</label>
      <input
        type="number"
        value={userEnteredOtp}
        onChange={(e) => setUserEnteredOtp(e.target.value)}
      />
    
      <Button variant="contained" color="primary" style={{ height: "1.8rem" }} onClick={verifyOtp}>Verify OTP</Button>
      {isLoading && <LinearProgress  style={{margin:"1rem"}} color="inherit"/>}
    </div>
  );

  const getUsernameView = () => {
    return (
      <div>
       
        <p>Your username is: {username}</p>
      </div>
    );
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {!otpSent && getEmailForm()}
      {otpSent && !otpVerified && getOtpForm()}
      {otpVerified && getUsernameView()}
    </div>
  );
};

export default ForgotUsername;
