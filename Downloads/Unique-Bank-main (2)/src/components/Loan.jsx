import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ButtonGroup } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {toast, ToastContainer} from 'react-toastify';
import { Container, Typography, Box,LinearProgress,Backdrop,CircularProgress } from "@mui/material";

import {
  CheckCircle,
  HourglassEmpty,
  Block,
  DoneAll,
  Close,
  ApiRounded,
} from "@mui/icons-material";

import {
  getUsers,
  editUsers,
  deleteUsers,
  getNotEmoloyee,
  employeedeleteCustomerUrls,
  getLoan,
  approveLoans,
  closeLoans,
  disburseLoans,
  onprocessLoans,
  rejectLoans,
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
import { getToken, getRolesFromToken } from "../services/LocalStorageService";
import AddUser from "./AddUser";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import { ProSidebarProvider, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  AiOutlineUser,
  AiOutlineBank,
  AiOutlineTransaction,
  AiOutlineMoneyCollect,
  AiOutlineLock,
  AiOutlineGift,
  AiOutlineCreditCard,
} from "react-icons/ai";
import {
  FaUser,
  FaCreditCard,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdAccountBalance, MdLock } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";

import { LockOpenSharp } from "@mui/icons-material";
import CalculateEMI from "./CalculateEMI";
const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);



const config = {
  headers: {
    Authorization: "Bearer " + getToken(),
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const getRole = () => {
  return getRolesFromToken();
};
const Loan = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
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
  const handleFetchData = async () => {
    setIsLoading(true)
    try {
      const response = await getLoan(config);
      console.log(response.data);
      setData(response.data);
      setSortedData(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await getLoan(config);
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
      const { loanNumber, userId } = row;
      // const query = searchQuery.toLowerCase();
  
      return (
        (loanNumber && loanNumber.toString().toLowerCase().includes(searchQuery)) ||
        (userId && userId.toString().toLowerCase().includes(searchQuery))
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

  const handleStatusChange = async (values, status) => {
    console.log("clicked");
    console.log(values, "user");
    
    try {
      let updatedStatus = null;
      let response;
      setIsLoading(true);
      // Make the API call based on the status
      switch (status) {
        case "Approved":
          response = await approveLoans(values, config);
          setIsLoading(false);

          handleFetchData()
          toast.success("Loan Aprroved")
          updatedStatus = "APPROVED";
          break;
        case "Closed":
          response = await closeLoans(values, config);
          console.log(response,"resonseeee")
          setIsLoading(false);

          handleFetchData()
          updatedStatus = "CLOSED";
          toast.error("Loan Closed !")
          
          break;
        case "Disbursed":
          response = await disburseLoans(values, config);
          setIsLoading(false);

          handleFetchData()
          updatedStatus="Disbursed";
          toast.success("Loan Disbursed")
          break;
        case "OnProcess":
          response = await onprocessLoans(values, config);
          setIsLoading(false);

          handleFetchData()
          toast.success("Loan On Processing")
          updatedStatus = "ONPROCESS";
          break;
        case "Rejected":
          response = await rejectLoans(values, config);
          setIsLoading(false);

          handleFetchData()
          toast.error("Loan Rejected")
          updatedStatus = "REJECTED";
          break;
        default:
          throw new Error("Invalid status");
      }

      console.log(response.data, "data");

      // Handle the updated status here (e.g., update the UI, show a success message)
      console.log("Updated status:", updatedStatus);

      // Assuming values is an object in the form of { id: loanId }
      const updatedRow = { ...values, status: updatedStatus };
      console.log("Updated row:", updatedRow);

      // Update the row in your state or data source with the updated status
      // For example, if you have an array of rows:
      // const updatedRows = rows.map(row => {
      //   if (row.id === updatedRow.id) {
      //     return updatedRow;
      //   }
      //   return row;
      // });
      // setSelectedRow(updatedRows); // Update the state with the updated rows

      // Update the state with the updated row
      setSelectedRow(updatedRow);
    } catch (error) {
      console.log("Error changing status:", error);
      // Handle the error here (e.g., show an error message)
    }
  };
  const handleDisburse =(e)=>{
    if(e.data){
      console.log(e)
     
      handleFetchData()
      toast.success("Disbursement Successful ")

      return
    }else{

      toast.error("Disbursement Unsuccesfful!")
    }
  }

  const roles = getRole().split(","); // Split the roles string into an array

  return (
    <>
   {isLoading && (
        // Show loading indicator while isLoading is true
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
     <ToastContainer />
      <div
        style={{
          display: "flex",
        }}
      >
        <SideBar />
        <div>
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
        placeholder="Search by Loan Number or User Id"
        value={searchQuery}
        onChange={handleSearch}
        style={{ 
      marginLeft:"1rem" }}
      />
    </div>
            <Button variant="contained" color="success" onClick={handleAddNew}>
              Calculate EMI
            </Button>
          </div>
          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table>
              <thead style={styles.tableHeading} >
                <tr>
                  <TableCellStyled>ID</TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("amount")}>
                    Amount
                    {sortConfig.field === "amount" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("cibilScore")}>
                    CIBIL Score
                    {sortConfig.field === "cibilScore" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("createdAt")}>
                    Created At
                    {sortConfig.field === "createdAt" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("emi")}>
                    EMI
                    {sortConfig.field === "emi" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("empStatus")}>
                    Employment Status
                    {sortConfig.field === "empStatus" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("income")}>
                    Income
                    {sortConfig.field === "income" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("interestRate")}>
                    Interest Rate
                    {sortConfig.field === "interestRate" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("loanNumber")}>
                    Loan Number
                    {sortConfig.field === "loanNumber" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("loanType")}>
                    Loan Type
                    {sortConfig.field === "loanType" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("paidMonths")}>
                    Paid Months
                    {sortConfig.field === "paidMonths" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>

                  <TableCellStyled
                    onClick={() => handleSort("remainingMonths")}
                  >
                    Remaining Months
                    {sortConfig.field === "remainingMonths" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>

                  <TableCellStyled onClick={() => handleSort("termInMonths")}>
                    Term in Months
                    {sortConfig.field === "termInMonths" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>

                  <TableCellStyled
                    onClick={() => handleSort("disburseAccountNumber")}
                  >
                    Disburse Account Number
                    {sortConfig.field === "disburseAccountNumber" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled onClick={() => handleSort("userId")}>
                    User ID
                    {sortConfig.field === "userId" && (
                      <span>
                        {sortConfig.order === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </TableCellStyled>
                  <TableCellStyled >
                    Status
                    
                    
                  </TableCellStyled>

                  
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
                    <TableCellStyled>{row.amount}</TableCellStyled>
                    <TableCellStyled>{row.cibilScore}</TableCellStyled>
                    <TableCellStyled>
                      {format(new Date(row.createdAt), "dd/MM/yyyy")}
                    </TableCellStyled>
                    <TableCellStyled>{row.emi}</TableCellStyled>
                    <TableCellStyled>{row.empStatus}</TableCellStyled>
                    <TableCellStyled>{row.income}</TableCellStyled>
                    <TableCellStyled>{row.interestRate}</TableCellStyled>
                    <TableCellStyled>{row.loanNumber}</TableCellStyled>
                    <TableCellStyled>{row.loanType}</TableCellStyled>
                    <TableCellStyled>{row.paidMonths}</TableCellStyled>

                    <TableCellStyled>{row.remainingMonths}</TableCellStyled>

                    <TableCellStyled>{row.termInMonths}</TableCellStyled>

                    <TableCellStyled>
                      {row.disburseAccountNumber}
                    </TableCellStyled>
                    <TableCellStyled>{row.userId}</TableCellStyled>
                    <TableCellStyled>{row.status}</TableCellStyled>
 
                    <TableCellStyled>
                      {roles.includes("ROLE_ADMIN") ? (
                      <ButtonGroup>
                        
                        <Tooltip title="Disburse" placement="top">
                          <IconButton
                            disabled={
                              row.status === "Active" || row.status === "Closed"
                            }
                            onClick={() => handleStatusChange(row, "Disbursed")}
                            style={{
                              color: row.status === "Active" ? "green" : "red",
                            }}
                          >
                            <MonetizationOnRoundedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Closed" placement="top">
                          <IconButton
                            disabled={row.status === "Closed"}
                            onClick={() => handleStatusChange(row, "Closed")}
                            style={{
                              color: row.status === "Closed" ? "grey" : "black",
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Tooltip>
                       
                      </ButtonGroup>
                       ):roles.includes("ROLE_MANAGER") ? (
                        <ButtonGroup>
                          <Tooltip title="Approved" placement="top">
                          <IconButton
                            disabled={row.status === "Approved"}
                            onClick={() => handleStatusChange(row, "Approved")}
                            style={{
                              color:
                                row.status === "Approved" ? "grey" : "green",
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejected" placement="top">
                          <IconButton
                            disabled={row.status === "Rejected"}
                            onClick={() => handleStatusChange(row, "Rejected")}
                            style={{
                              color: row.status === "Rejected" ? "grey" : "red",
                            }}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                        </ButtonGroup>) :(
                          <ButtonGroup>
                             <Tooltip title="On Process" placement="top">
                          <IconButton
                            disabled={row.status === "OnProcess"}
                            onClick={() => handleStatusChange(row, "OnProcess")}
                            style={{
                              color:
                                row.status === "OnProcess" ? "grey" : "orange",
                            }}
                          >
                            <ApiRounded />
                          </IconButton>
                        </Tooltip>
                          </ButtonGroup>
                         )}

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
      <Dialog open={Boolean()} onClose={() => setSelectedRow(null)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent></DialogContent>
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

              <p>Adress: {selectedRow.address}</p>
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
        <DialogContent>{openAddDialog && <CalculateEMI />}</DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Loan;
