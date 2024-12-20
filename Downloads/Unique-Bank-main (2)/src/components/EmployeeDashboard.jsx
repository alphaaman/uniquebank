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
  getAccounts,
  employeedeleteCustomerUrls,
  getNotManager,
  managerDeleteCustomers,
  adminDeleteEmployees,
  adminDeleteCustomers,
  managerDeleteEmployees,
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
import { getToken,getRolesFromToken } from "../services/LocalStorageService";
import AddUser from "./AddUser";
import { ProSidebarProvider, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart ,FaMoneyBillWave} from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';
import {toast, ToastContainer} from 'react-toastify'
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";

import { LockOpenSharp } from "@mui/icons-material";
const TableCellStyled = TableCell;

// const NarrowTableCell = ({ children }) => (
//   <TableCellStyled>{children}</TableCellStyled>
// );


const EmployeeDashboard = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [selectedRow, setSelectedRow] = useState(null);
  const [bgColor, setBgColor] = useState("#00f010");
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
      height:"100px",
      cursor:"pointer",
      background: "#EBEBEB"
    },
    tableRowBasic: {
      height:"100px",
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

  const handleFetchData = async () =>{
    setIsLoading(true);
    try {
      const roles = getRolesFromToken();
      console.log(roles.includes("ROLE_ADMIN"), "includes");

      if (roles.includes("ROLE_ADMIN")) {
        const response = await getUsers();
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
      }else if(roles.includes("ROLE_MANAGER")){
        const response = await getNotManager();
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
      }else if(roles.includes("ROLE_EMPLOYEE")){
        const response = await getNotEmoloyee();
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
      }
      
    } catch (error) {
      console.log("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  }
  const filterData = () => {
  console.log("data", data);
  const filteredData = data.filter((row) => {
    const { username, name, email, id } = row;
    const query = searchQuery.toLowerCase();

    return (
      (username && username.toString().includes(searchQuery)) ||
      (name && name.toLowerCase().includes(query)) ||
      (email && email.toString().includes(searchQuery)) ||
      (id && id.toString().includes(searchQuery))
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

  useEffect(() => {
    handleFetchData();
    // fetchData();
  }, []);

  const handleSort = (field) => {
    let order = "asc";
    if (sortConfig.field === field && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ field, order });
  };

  useEffect(() => {
    const handleFetchData = () => {
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
    console.log(selectedRow.roles, "selected id");
    try {
      const roles = getRole().split(","); // Split the roles string into an array
  
      if (roles.includes("ROLE_ADMIN")) {
        if (selectedRow.roles && selectedRow.roles.some((role) => role.name === "MANAGER")) {
          console.log("manager")
          await deleteUsers(selectedRow.id, config);
        }else if (selectedRow.roles && selectedRow.roles.some((role) => role.name === "EMPLOYEE")) {
          console.log("employee")
        await adminDeleteEmployees(selectedRow.id, config);
        
        }else if (selectedRow.roles && selectedRow.roles.some((role) => role.name === "CUSTOMER")) {
          console.log("customer")
        await adminDeleteCustomers(selectedRow.id, config);
       
        }
       
        const response = await getUsers();
        setData(response.data);
        setSortedData(response.data);
      } else if (roles.includes("ROLE_MANAGER")) {
         if (selectedRow.roles && selectedRow.roles.some((role) => role.name === "EMPLOYEE")) {
          console.log("employee")
        await managerDeleteEmployees(selectedRow.id, config);
        }else if (selectedRow.roles && selectedRow.roles.some((role) => role.name === "CUSTOMER")) {
          console.log("customer")
        await managerDeleteCustomers(selectedRow.id, config);
        }
        const response = await getNotManager();
        setData(response.data);
        setSortedData(response.data);
      } else if (roles.includes("ROLE_EMPLOYEE")) {
        await employeedeleteCustomerUrls(selectedRow.id, config);
        
        const response = await getNotEmoloyee();
        setData(response.data);
        setSortedData(response.data);
      } else {
        // Handle error for unknown role
        console.log("Unknown role:");
        return;
      }
  
      setOpenDeleteDialog(false);
      setSelectedRow(null);
  
      
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

  const handleAddNewUser = (e) => {
    if(e.data){
      console.log(e)
      setOpenAddDialog(false)
      handleFetchData()
      toast.success("User Created")
      return
    }else{

      toast.error("User can not be created!")
    }
    
  }

  const handleEditNewUser = (e) => {
    if(e.data){
      console.log(e)
      setOpenEditDialog(false)
      handleFetchData()
      toast.success("User Edited ")
      return
    }else{

      toast.error("User can not be created!")
    }
    
  }

  const getRole =() =>{
    return getRolesFromToken()
  };
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
          marginTop: "1rem",
          marginRight: "2rem",
        }}
      ><div>
      <input
        type="text"
        placeholder="Search by User ID, Username, Name, or Email"
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
        <Table >
          <thead style={styles.tableHeading}>
            <tr>
              <TableCellStyled  >ID</TableCellStyled>
              <TableCellStyled onClick={() => handleSort("username")}>
                Username
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
                Name
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
              <TableCellStyled>Email</TableCellStyled>
              <TableCellStyled onClick={() => handleSort("accountCreated")}>
                Account Created
                {sortConfig.field === "accountCreated" && (
                  <span>
                    {sortConfig.order === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </span>
                )}
              </TableCellStyled>
              <TableCellStyled>Phone Number</TableCellStyled>
              <TableCellStyled>Pan Number</TableCellStyled>
              <TableCellStyled>Date Of Birth</TableCellStyled>
              <TableCellStyled >Address</TableCellStyled>
              <TableCellStyled>Roles</TableCellStyled>
              <TableCellStyled>Edit</TableCellStyled>
              <TableCellStyled>Delete</TableCellStyled>
            </tr>
          </thead>
          <TableBody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                // className="table-row-hover"
                style={row.id === hoveredRowId ? styles.tableRowHover : styles.tableRowBasic}
    onMouseEnter={() => setHoveredRowId(row.id)}
    onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => handleRowClick(row)}
              >
                <TableCellStyled>{row.id}</TableCellStyled>
                <TableCellStyled>{row.username}</TableCellStyled>
                <TableCellStyled>{row.name}</TableCellStyled>
                <TableCellStyled>{row.email}</TableCellStyled>
                <TableCellStyled>
                  {row.accountCreated ? "Yes" : "No"}
                </TableCellStyled>
                <TableCellStyled>{row.phoneNumber}</TableCellStyled>
                <TableCellStyled>{row.panNo}</TableCellStyled>
                <TableCellStyled>
                  {format(new Date(row.dateOfBirth), "dd/MM/yyyy")}
                </TableCellStyled>
                <TableCellStyled >{row.address.length > 20 ? `${row.address.slice(0,17)}...` : row.address }</TableCellStyled>
                <TableCellStyled>
                  {row.roles.map((role) => role.name).join(", ")}
                </TableCellStyled>
                <TableCellStyled>
                  <IconButton>
                    <EditIcon onClick={() => handleEditClick(row)} />
                  </IconButton>
                </TableCellStyled>
                <TableCellStyled>
                  <IconButton>
                    <DeleteIcon
                      onClick={(event) => handleDeleteClick(event, row)}
                    />
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
        <DialogTitle>User Details</DialogTitle>
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
              
              <p>Adress: {selectedRow.address}</p>
              <p>
                Roles:
                {selectedRow.roles.map((role) => role.name).join(", ")}
              </p>
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
          {openEditDialog && <UpdateUser editedUser={editedUser} handleEditNewUser={(e) => handleEditNewUser(e)}/>} 
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
              
              <p>Adress: {selectedRow.address}</p>
              <p>
                Roles:
                {selectedRow.roles.map((role) => role.name).join(", ")}
              </p>
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
        <DialogContent>{openAddDialog && <AddUser handleAddNewUser={(e) => handleAddNewUser(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeDashboard;
