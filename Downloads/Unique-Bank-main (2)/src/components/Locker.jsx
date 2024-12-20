import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import {
  getUsers,
  editUsers,
  deleteUsers,
  getNotEmoloyee,
  getLockers,
  employeedeleteCustomerUrls,
  releaseLocker,
  createLocker,
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
import { getToken,getRolesFromToken } from "../services/LocalStorageService";
import AddUser from "./AddUser";
import { ProSidebarProvider, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart ,FaMoneyBillWave} from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';

import {toast, ToastContainer} from 'react-toastify';

import { LockOpenSharp, Logout } from "@mui/icons-material";
import AssignLocker from "./AssignLocker";
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";

const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);


const Locker = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
  const navigate = useNavigate();
  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getLockers(config);
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
    //     const response = await getLockers(config);
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
      const { lockerNumber, occupied, userId } = row;
      // const query = searchQuery.toLowerCase();
      console.log(occupied,"occupied")
  
      return (
        (lockerNumber && lockerNumber.toString().toLowerCase().includes(searchQuery)) ||
        (userId && userId.toString().toLowerCase().includes(searchQuery)) ||
        (occupied !== undefined && ((occupied && searchQuery.toLowerCase() === "yes") || (!occupied && searchQuery.toLowerCase() === "no")))
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
  const handleReleaseClick = async (user) => {
    console.log("clicked")
    console.log(user, "user");
    try {
      const response = await releaseLocker(user,config);
      console.log(response.data);
      handleFetchData();
      toast.success("Locker released")
    } catch (error) {
      console.log("Error releasing locker:", error);
      toast.error("Locker Not released")
    }
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

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };
  const values={
    "occupied":false,
  }
  const handleCreateLocker = () => {
    const response =  createLocker(values,config);
    toast.success("Locker Created Successful")
    // console.log(setOpenCreateDialog);
  };
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };
  const getRole = () => {
    return getRolesFromToken();
  };
    const roles = getRole().split(","); // Split the roles string into an array
    const handleAssignLocker =(e)=>{
      if(e.data){
        console.log(e)
        handleAddDialogClose()
        handleFetchData()
        toast.success("Locker Assigned")
  
        return
      }else{
  
        toast.error("Locker not Assigned ")
      }
    }
  return (

    <>
    {isLoading && (
        // Show loading indicator while isLoading is true
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
   <ToastContainer />
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
      >
        <div>
      <input
        type="text"
        placeholder="Search by Locker Number, Occupied or User ID"
        value={searchQuery}
        onChange={handleSearch}
        style={{ 
      marginLeft:"1rem" }}
      />
    </div><div>
        <Button variant="contained" color="success" onClick={handleAddNew}>
          Assign Locker
        </Button>
        {roles.includes("ROLE_ADMIN") && (
  <Button
    variant="contained"
    color="success"
    onClick={handleCreateLocker}
    style={{ marginLeft: "1rem" }}
  >
    Create Locker
  </Button>
)}

</div>
      </div>
      <TableContainer component={Paper} style={styles.tableContainer}>
  <Table>
    <thead style={styles.tableHeading}>
      <tr>
        <TableCellStyled>ID</TableCellStyled>
        <TableCellStyled onClick={() => handleSort("locker_number")}>
          Locker Number
          {sortConfig.field === "locker_number" && (
            <span>
              {sortConfig.order === "asc" ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </span>
          )}
        </TableCellStyled>
        <TableCellStyled>Occupied</TableCellStyled>
        <TableCellStyled>User ID</TableCellStyled>
        <TableCellStyled>Action</TableCellStyled>
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
          <TableCellStyled>{row.lockerNumber}</TableCellStyled>
          <TableCellStyled>{row.occupied ? "Yes" : "No"}</TableCellStyled>
          <TableCellStyled>{row.userId}</TableCellStyled>
          
          <TableCellStyled>
          <IconButton onClick={() => handleReleaseClick(row)}>
  {row.userId && <Logout />}
</IconButton>
</TableCellStyled>
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
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
      </Dialog>
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openAddDialog && <AssignLocker handleAssignLocker ={(e)=>handleAssignLocker(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
     
      {/* <Dialog open={openCreateDialog} onClose={handleCreateDialogClose}>
     
        <DialogContent>{openCreateDialog && <CreateLocker />}</DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default Locker;