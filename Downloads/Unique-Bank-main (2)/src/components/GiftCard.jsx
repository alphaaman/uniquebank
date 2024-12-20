import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  getUsers,
  editUsers,
  deleteUsers,
  getNotEmoloyee,
  getGiftCards,
  employeedeleteCustomerUrls,
} from "../services/userService";
import { format } from "date-fns";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Register from "./Register";
import SideBar from "./SideBar";
import UpdateUser from "./UpdateUser";
import { getToken ,getRolesFromToken} from "../services/LocalStorageService";
import AddUser from "./AddUser";
import { ProSidebarProvider, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart ,FaMoneyBillWave} from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';
import AddGiftCard  from "./AddGiftCard";

import { LockOpenSharp } from "@mui/icons-material";
import AddGiftCardBalance from "./AddGiftCardBalance";
import {toast, ToastContainer} from 'react-toastify';
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";

const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);


const GiftCard = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const styles = {
    tableContainer: {
      padding: "",
      overflow:"auto",
      marginTop:"1rem",
      marginLeft:"1rem",
      maxWidth: "84vw",
      
      
    },
    tableHeading: {
      border: "2px",
      postion:"sticky",
      background: "#DE3163", // Update the background color
      color: "black", // Set the heading text color to white
      fontWeight: "bold", // Make the heading text bold
    },
    tableCell:{
      maxHeight:"1px",
    },
    tableRowHover: {
      // height:"100px",
      cursor:"pointer",
      background: "#EBEBEB"
    },
    tableRowBasic: {
      // height:"100px",
      cursor:"pointer",
      fontWeight:"bold",
      background: "linear-gradient(to bottom, #FFECF4, #FEE9F2)"
        },
    pagination: {
      margin: "2rem",
      display: "flex",
      justifyContent: "center",
    },
  };
  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getGiftCards(config);
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await getGiftCards(config);
    //     console.log(response.data);
    //     setData(response.data);
    //     setSortedData(response.data);
    //   } catch (error) {
    //     console.log("Error fetching data:", error);
    //   }
    // };

    handleFetchData();
  }, []);
const filterData = () => {

    const filteredData = data.filter((row) => {
      const { recipientName, cardNumber, userId } = row;
      // const query = searchQuery.toLowerCase();
      // console.log(occupied,"occupied")
  
      return (
        (cardNumber && cardNumber.toString().toLowerCase().includes(searchQuery)) ||
        (userId && userId.toString().toLowerCase().includes(searchQuery)) ||
        (recipientName && recipientName.toString().toLowerCase().includes(searchQuery))

        );
    });
  
    setSortedData(filteredData);
  };
  
  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

   const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (field) => {
    let order = "asc";
    if (sortConfig.field === field && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ field, order });
  };

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortConfig.field === "id") {
        return sortConfig.order === "asc" ? a.id - b.id : b.id - a.id;
      } else {
        if (a[sortConfig.field] < b[sortConfig.field]) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (a[sortConfig.field] > b[sortConfig.field]) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      }
    });
    setSortedData(sorted);
  }, [sortConfig, data]);

  useEffect(() => {
    // Add your authentication logic here or navigate to the login page
  }, [navigate]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangePerPage = (event) => {
    setPerPage(event.target.value);
    setPage(1);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };
//   const handleDeleteClick = (event, row) => {
//     event.stopPropagation(); // Prevent event propagation to the row click handler
//     handleRowClick(row);
//     setOpenDeleteDialog(true);
//   };
  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
 

  const handleEditClick = (user) => {
    console.log(user, "user");
    setEditedUser(user);
    handleRowClick(null);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditedUser(null);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteUser = async () => {
    console.log(selectedRow, "seleted id");
    try {
      await employeedeleteCustomerUrls(selectedRow.id, config);

      setOpenDeleteDialog(false);
      setSelectedRow(null);

      const response = await getNotEmoloyee();
      setData(response.data);
      setSortedData(response.data);
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };
  const handleAddNew = () => {
    setOpenAddDialog(true);
    console.log(openAddDialog);
  };


  const handleApplyGiftCard =(e)=>{
    if(e.data){
      console.log(e)
      handleAddDialogClose()
      handleFetchData()
      toast.success("Gift card Added ")

      return
    }else{

      toast.error("Gift Card not Added!")
    }
  }

  const handleAddGiftCardBalance =(e)=>{
    if(e.data){
      console.log(e)
      setOpenEditDialog(false)
      setSelectedRow(null)
      handleFetchData()
      toast.success("Gift card Balance added ")

      return
    }else{

      toast.error("Gift Card Balance not Added!")
    }
  }

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };
  const getRole = () => {
  return getRolesFromToken();
};
  const roles = getRole().split(","); // Split the roles string into an array

  return (

    <>
    <ToastContainer/>
    {isLoading && (
        // Show loading indicator while isLoading is true
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    <div style={{
      display: "flex"}} >
    <SideBar />
<div >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width:"84vw",
          marginTop: "1rem",
          marginRight: "2rem",
        }}
      > <div>
      <input
        type="text"
        placeholder="Search by Rceipent Name, Gift Card Number or User ID"
        value={searchQuery}
        onChange={handleSearch}
        style={{ 
      marginLeft:"1rem" }}
      />
    </div>
        <Button variant="contained" color="success" onClick={handleAddNew}>
          Add New Card
        </Button>
        
      </div>
      <TableContainer component={Paper} style={styles.tableContainer}>
  <Table>
    <thead style={styles.tableHeading} >
      <tr>
        <TableCellStyled>ID</TableCellStyled>
        <TableCellStyled onClick={() => handleSort("card_number")}>
          Card Number
          {sortConfig.field === "card_number" && (
            <span>
              {sortConfig.order === "asc" ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </span>
          )}
        </TableCellStyled>
        <TableCellStyled>Deliver_at_Registered_Address</TableCellStyled>
        <TableCellStyled onClick={() => handleSort("expiration_date")}>
          Expiration Date
          {sortConfig.field === "expiration_date" && (
            <span>
              {sortConfig.order === "asc" ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </span>
          )}
        </TableCellStyled>
        <TableCellStyled>Gift Amount</TableCellStyled>
        <TableCellStyled>Issuance Fee</TableCellStyled>
        <TableCellStyled>Pin Number</TableCellStyled>
        <TableCellStyled>Recipient Name</TableCellStyled>
        <TableCellStyled>User ID</TableCellStyled>
{roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER") ? (
  <TableCellStyled>Add Balance</TableCellStyled>
) : null}
    </tr>
    </thead>
    <TableBody>
      {paginatedData.map((row) => (
        <tr
          key={row.id}
          style={row.id === hoveredRowId ? styles.tableRowHover : styles.tableRowBasic}

          onMouseEnter={() => setHoveredRowId(row.id)}
onMouseLeave={() => setHoveredRowId(null)}
          onClick={() => handleRowClick(row)}
        >
          <TableCellStyled>{row.id}</TableCellStyled>
          <TableCellStyled>{row.cardNumber}</TableCellStyled>
          <TableCellStyled>
            {row.deliver_at_registered_address ? "Yes" : "No"}
          </TableCellStyled>
          <TableCellStyled>
            {row.expirationDate}
          </TableCellStyled>
          <TableCellStyled>{row.giftAmount}</TableCellStyled>
          <TableCellStyled>{row.issuanceFee}</TableCellStyled>
          <TableCellStyled>{row.pinNumber}</TableCellStyled>
          <TableCellStyled>{row.recipientName}</TableCellStyled>
          <TableCellStyled>{row.userId}</TableCellStyled>
         {roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER") ? (
  <TableCellStyled>
    <IconButton>
      <AddIcon onClick={() => handleEditClick(row)} />
    </IconButton>
  </TableCellStyled>
) : null}

         
        </tr>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Pagination
        count={Math.ceil(sortedData.length / perPage)}
        page={page}
        onChange={handleChangePage}
        showFirstButton
        showLastButton
        color="primary"
        sx={styles.pagination}
      />
</div>
</div>
<Dialog open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)}>
  <DialogTitle>Gift Card Details</DialogTitle>
  <DialogContent>
    {selectedRow && (
      <div>
        <p>Gift Card ID: {selectedRow.id}</p>
        <p>Gift Amount: {selectedRow.giftAmount}</p>
        <p>Recipient Name: {selectedRow.recipientName}</p>
       
        <p>User ID: {selectedRow.userId}</p>
      </div>
    )}
  </DialogContent>
</Dialog>

      <Dialog
        open={Boolean(openEditDialog)}
        onClose={() => setOpenEditDialog(false)}
      >
        {/* <DialogTitle>Update User</DialogTitle> */}
        <DialogContent>
          {/* <h1>Add Balance To Gift card</h1> */}
          {openEditDialog && <AddGiftCardBalance editedUser={editedUser} handleAddGiftCardBalance={(e) => handleAddGiftCardBalance(e)} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        {/* <DialogTitle>Delete User</DialogTitle> */}
        {/* <DialogContent>
          {selectedRow && (
            <div>
              <p>ID: {selectedRow.id}</p>
              <p>Username: {selectedRow.username}</p>
              <p>Name: {selectedRow.name}</p>
              <p>Email: {selectedRow.email}</p>
              <p>
                Account Created: {selectedRow.accountCreated ? "Yes" : "No"}
              </p>
              <p>Phone Number: {selectedRow.phoneNumber}</p>
              <p>Pan Number: {selectedRow.panNo}</p>
              <p>
                Date Of Birth:{" "}
                {format(new Date(selectedRow.dateOfBirth), "dd/MM/yyyy")}
              </p>
              <p>Adress: {selectedRow.address}</p>
              <p>
                Roles:
                {selectedRow.roles.map((role) => role.name).join(", ")}
              </p>
            </div>
          )}
          <p>Are you sure you want to delete this user?</p>
        </DialogContent> */}
        {/* <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteUser}>
            Delete
          </Button>
        </DialogActions> */}
      </Dialog>
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openAddDialog && <AddGiftCard handleApplyGiftCard ={(e)=>handleApplyGiftCard(e)} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GiftCard;
