import React, { useState } from 'react';
import { getToken } from "../services/LocalStorageService";
import { getUsersFromEmail, sendEmailToBank, userUpdatePasswords } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import { Container, Typography, Box, Avatar ,CircularProgress,LinearProgress,Backdrop,Skeleton} from "@mui/material";

const ForgotPassword = ({handleForgotPassword}) => {
  const [userId, setUserId] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const [closeAll,setCloseAll]=useState(true);
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
        subject: "Password Recovery Request - One-Time Password (OTP)",
        message: `Dear Customer,
        
        Welcome to Unique Bank! We would like to express our gratitude for choosing our services.
        
        We have received a request regarding a forgotten password for your Unique Bank account. To assist you in recovering your password, we have generated a One-Time Password (OTP).
        
        Please find your OTP below:
        
        OTP: ${otp}
        
        To proceed with password recovery, please follow these steps:
        
        1. Visit the Unique Bank website/app login page.
        2. Click on the "Forgot Password" link.
        3. Enter your registered email and the OTP provided above.
        4. Follow the instructions on the screen to reset your password.
        
        
        If you did not initiate this password recovery request, kindly disregard this email. Your account is secure, and no changes will be made.
        
        If you require any further assistance or have any questions, please don't hesitate to contact our dedicated support team at +91 9876543210. We are here to help.
        
        Thank you for choosing Unique Bank.
        
        Best regards,
        Unique Bank`,
      };
      

      const response = await sendEmailToBank(emailData);
      toast.success(`OTP Sent Successfully on ${email} please check`)
      setOtpSent(true);
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
      toast.error("otp not sent please verify your email")
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
        // setUsername(response.data.username);
        setUserId(response.data.id);
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



  const updatePassword = async () => {
    setIsLoading(true);
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }else{
    try {

        const updatePasswordRequest={
            "id":userId,
            "password":newPassword,
        }
        const response = await userUpdatePasswords(updatePasswordRequest);
      

      setErrorMessage('Password updated successfully.');
      setOtpVerified(false)
      setOtpSent(false)
      setCloseAll(false)
      setErrorMessage('')
      handleForgotPassword({ data: "Password Updated Successfully" });
      toast.success("Password Updated Successfully");
    } catch (error) {
      setErrorMessage('Failed to update password. Please try again.');
      handleForgotPassword({error})
      toast.error("Password not updated");
    }finally{
        setIsLoading(false);
    }}
  };

  const getUsernameForm = () => (
    <div>
      <h2>Forgot Password</h2>
      <label>Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant="contained" color="primary" style={{ height: "1.8rem" }} onClick={sendOtp}>Send OTP</Button>
      {isLoading && <LinearProgress style={{margin:"1rem"}} color="inherit"/>}
    </div>
  );

  const getOtpForm = () => (
    <div>
      <h2>Forgot Password</h2>
      <label>OTP:</label>
      <input type="text" value={userEnteredOtp} onChange={(e) => setUserEnteredOtp(e.target.value)} />
      <Button variant="contained" color="primary" style={{ height: "1.8rem" }} onClick={verifyOtp}>Verify OTP</Button>
      {isLoading && <LinearProgress style={{margin:"1rem"}} color="inherit"/>}
    </div>
  );

  const getPasswordForm = () => (
    <div>
      <h2>Forgot Password</h2>
      <label>New Password:</label>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <label>Confirm New Password:</label>
      <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
      <div>
      <Button variant="contained" color="primary" style={{ height: "1.8rem", marginTop:"1rem" }}  onClick={updatePassword}>Update</Button>
      </div>
      {isLoading && <LinearProgress style={{margin:"1rem"}} color="inherit"/>}
    </div>
  );

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {!otpSent && closeAll && getUsernameForm()}
      {otpSent && !otpVerified && getOtpForm()}
      {otpVerified && getPasswordForm()}
    </div>
  );
};

export default ForgotPassword;
