import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CustomerSidebar from "./CustomerSidebar";
import './PersonalProfile.css'; // Import the new CSS file
import { getUsernameFromToken, getToken } from '../services/LocalStorageService';
import { getUsersByUsername } from "../services/userService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import UpdateCustomer from "./UpdateCustomer";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import ChatBot from './ChatBot'; // Import the Chatbot component

export default function PersonalProfile() {
  const [data, setData] = useState({});
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
          const response = await getUsersByUsername(getUsername(), config);
          console.log(response.data, "responseData");
          setData(response.data);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };



  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await getUsersByUsername(getUsername(), config);
    //     console.log(response.data, "responseData");
    //     setData(response.data);
    //   } catch (error) {
    //     console.log("Error fetching data:", error);
    //   }
    // };

    handleFetchData();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };
  const avatarStyles = {
    width: '50px',
    height: '50px',
    fontSize: '20px',
    backgroundColor: '#FF9300',
    color: 'white',
    textAlign: 'center',
    margin: 'auto 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyles = {
    color: 'black',
    margin: '1rem',
    width: '6rem',
    borderColor: 'Golden',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '4px',
  };


  const handleEditNewUser = (e) => {
    console.log(e,"eerr")
    if(e.data){
      console.log(e)
      setOpenEditDialog(false)
      handleFetchData()
      toast.success("User Edited ")
      return
    }else{

      toast.error("User can not be Edited!")
    }
    
  }



  return (
    <>
    
  <ToastContainer/>
    <div style={{display:"flex"}}>
       <CustomerSidebar />
      <section className="vh-100 personal-profile-section">
        <div className="py-5 h-100 personal-profile-container">
          <div className="justify-content-center align-items-center h-100">
            <div className="mb-4 mb-lg-0">
              <div className="mb-3 personal-profile-card">
                <div className="gradient-custom text-center text-white personal-profile-card-header">
                  <div className="avatar-container" style={{ margin: "1rem" }}>
                    <Avatar style={avatarStyles}></Avatar>
                  </div>
                  <Typography variant="h5" style={{ fontWeight: "bold" }}>{data.username}</Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>{data.name}</Typography>
                  <IconButton style={buttonStyles} aria-label="edit" onClick={() => handleEditClick(data)}>
                    <ModeEditOutlineIcon />
                    <Typography>Edit</Typography>
                  </IconButton>
                </div>
                <div className="personal-profile-card-body">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>Information</Typography>
                  <hr className="mt-0 mb-4" />
                  <div className="pt-1">
                    <div className="mb-3">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>Email</Typography>
                      <Typography variant="body2" className="text-muted">{data.email}</Typography>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>Phone</Typography>
                      <Typography variant="body2" className="text-muted">{data.phoneNumber}</Typography>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>Address</Typography>
                      <Typography variant="body2" className="text-muted">{data.address}</Typography>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>Date of Birth</Typography>
                      <Typography variant="body2" className="text-muted"> {formatDate(data.dateOfBirth)}</Typography>
                    </div>
                    <div className="mb-3" >
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>Phone Number</Typography>
                      <Typography variant="body2" className="text-muted">{data.phoneNumber}</Typography>
                    </div>
                    <div className="mb-3" >
                      <Typography variant="h6"style={{ fontWeight: "bold" }}>PAN No</Typography>
                      <Typography variant="body2" className="text-muted">{data.panNo}</Typography>
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog
        open={Boolean(openEditDialog)}
        onClose={() => setOpenEditDialog(false)}
      >
        {/* <DialogTitle>Update User</DialogTitle> */}
        <DialogContent>
          {openEditDialog && <UpdateCustomer editedUser={editedUser}  handleEditNewUser={(e) => handleEditNewUser(e)} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* <ChatBot /> Add the Chatbot component */}
      
      </div>
    </>
  );
}
