import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {toast, ToastContainer} from 'react-toastify';

import {
  getUsers,
  editUsers,
  deleteUsers,
  getNotEmoloyee,
  employeedeleteCustomerUrls,
  getAccounts,
} from "../services/userService";
import { format } from "date-fns";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Register from "./Register";
import SideBar from "./SideBar";
import UpdateUser from "./UpdateUser";
import { getToken } from "../services/LocalStorageService";
import AddUser from "./AddUser";
import { ProSidebarProvider, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart ,FaMoneyBillWave} from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";

import { LockOpenSharp } from "@mui/icons-material";
import CreateAccount from "./CreateAccount";
const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);

const Account = () => {
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
  
  const handleFetchData=async ()=>{
    setIsLoading(true);
    try {
      const response = await getAccounts(config);
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const filterData = () => {
    const filteredData = data.filter(
      (row) =>
        row.accountId.toString().includes(searchQuery) ||
        row.accountType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.balance.toString().includes(searchQuery) ||
        row.userId.toString().includes(searchQuery)
    );
    setSortedData(filteredData);
  };

  useEffect(() => {
  filterData();
}, [searchQuery, data]);

  useEffect(() => {

    // const fetchData = async () => {
    //   try {
    //     const response = await getAccounts(config);
    //     console.log(response.data);
    //     setData(response.data);
    //     setSortedData(response.data);
    //   } catch (error) {
    //     console.log("Error fetching data:", error);
    //   }
    // };

    handleFetchData();
  }, []);
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
    const handleFetchData=()=>{
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
  }
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
  const handleDeleteClick = (event, row) => {
    event.stopPropagation(); // Prevent event propagation to the row click handler
    handleRowClick(row);
    setOpenDeleteDialog(true);
  };
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

      const response = await getAccounts(config);
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

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleCreateAccount = (e) => {
    if(e.data){
      console.log(e)
      setOpenAddDialog(false)
      handleFetchData()
      toast.success("Account created")

      return
    }else{

      toast.error("Account can not be created!")
    }
    
  }
  return (

    <>
     <ToastContainer />
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
      ><div>
      <input
        type="text"
        placeholder="Search by Account ID, Account Type, Balance, or User ID"
        value={searchQuery}
        onChange={handleSearch}
        style={{ 
      marginLeft:"1rem" }}
      />
    </div>
        <Button variant="contained" color="success" onClick={handleAddNew}>
          Add New
        </Button>
      </div>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <thead style={styles.tableHeading} >
            <tr >
              <TableCellStyled>Account ID</TableCellStyled>
              <TableCellStyled onClick={() => handleSort("username")}>
                Account Type
                {sortConfig.field === "username" && (
                  <span>
                    {sortConfig.order === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </span>
                )}
              </TableCellStyled>
              <TableCellStyled onClick={() => handleSort("name")}>
                Balance
                {sortConfig.field === "name" && (
                  <span>
                    {sortConfig.order === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </span>
                )}
              </TableCellStyled>
              <TableCellStyled>UserId</TableCellStyled>
             
             
            </tr>
          </thead>
          <TableBody>
            {paginatedData.map((row) => (
              <tr
                key={row.accountId}
                // className="table-row-hover"
                style={row.accountId === hoveredRowId ? styles.tableRowHover : styles.tableRowBasic}

                onMouseEnter={() => setHoveredRowId(row.accountId)}
    onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => handleRowClick(row)}
              
              >
                <TableCellStyled>{row.accountId}</TableCellStyled>
                <TableCellStyled>{row.accountType}</TableCellStyled>
                <TableCellStyled>{row.balance}</TableCellStyled>
                <TableCellStyled>{row.userId}</TableCellStyled>
                
               
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
        <DialogTitle>Account Details</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <div>
              <p>Account ID: {selectedRow.accountId}</p>
              <p>Account Type: {selectedRow.accountType}</p>
              <p>Balance: {selectedRow.balance}</p>
              <p>User Id: {selectedRow.userId}</p>
              {/* <p>
                Account Created: {selectedRow.accountCreated ? "Yes" : "No"}
              </p>
              <p>Phone Number: {selectedRow.phoneNumber}</p>
              <p>Pan Number: {selectedRow.panNo}</p> */}
              {/* <p>
                Date Of Birth:{" "}
                {format(new Date(selectedRow.dateOfBirth), "dd/MM/yyyy")}
              </p> */}
              {/* <p>Adress: {selectedRow.address}</p> */}
              {/* <p>
                Roles:
                {selectedRow.roles.map((role) => role.name).join(", ")}
              </p> */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRow(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(openEditDialog)}
        onClose={() => setOpenEditDialog(false)}
      >
        {/* <DialogTitle>Update User</DialogTitle> */}
        <DialogContent>
          {openEditDialog && <UpdateUser editedUser={editedUser} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
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
              {/* <p>
                Date Of Birth:{" "}
                {format(new Date(selectedRow.dateOfBirth), "dd/MM/yyyy")}
              </p> */}
              <p>Adress: {selectedRow.address}</p>
              {/* <p>
                Roles:
                {selectedRow.roles.map((role) => role.name).join(", ")}
              </p> */}
            </div>
          )}
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openAddDialog && <CreateAccount  handleCreateAccount={(e) => handleCreateAccount(e)} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Account;
