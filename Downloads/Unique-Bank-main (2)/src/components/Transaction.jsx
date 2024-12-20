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
  employeedeleteCustomerUrls,
  getAccounts,
  getTransactions,
} from "../services/userService";
import { format ,parseISO} from "date-fns";
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
import { getToken ,getRolesFromToken} from "../services/LocalStorageService";
import AddUser from "./AddUser";
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
import CreateAccount from "./CreateAccount";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Transfer from "./Transfer";
import {toast, ToastContainer} from 'react-toastify';
import { LinearProgress ,Backdrop,CircularProgress} from "@mui/material";
import { timers } from "jquery";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);


const Transaction = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [timePeriod, setTimePeriod] = useState('day');
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
const handleFetchData = async (timePeriod) => {
 setIsLoading(true)
 console.log(timePeriod,"timePeriod")
      try {
        if (timePeriod==null){
        timePeriod="day";
      }
        const response = await getTransactions(config);
        console.log(response.data);
       const filteredStatements = response.data.filter((item) => {
        // console.log(item, "item");
        const statementDate = new Date(item.transactionDate);
        // console.log(statementDate,"stement data") // Corrected the case sensitivity here
        const startDate = new Date();
       if (timePeriod === "day") {
        // console.log(timePeriod,"timeperiod",startDate)
          startDate.setDate(startDate.getDate() - 1);
        } 
        else if (timePeriod === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (timePeriod === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (timePeriod === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }
        return statementDate >= startDate && statementDate <= new Date();
      });
      
      setData(filteredStatements);
      setSortedData(filteredStatements);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
       setIsLoading(false)
      }
    };
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await getTransactions(config);
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
    console.log("datatype", data);
    console.log(typeof data.transactionDate, data.transactionDate);

    const filteredData = data.filter((row) => {
      const { transactionType, transactionId, accountId, transactionDate } = row;
      const query = searchQuery.toLowerCase();
  
      return (
        (transactionType && transactionType.toString().toLowerCase().includes(searchQuery)) ||
        (transactionDate && transactionDate.toString().includes(query)) ||
        (accountId && accountId.toString().toLowerCase().includes(searchQuery)) ||
        (transactionId && transactionId.toString().toLowerCase().includes(searchQuery))
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

  const downloadPDF = async () => {
    try {
       const response = await getTransactions(config);
         // Filter the statements based on the selected time period
      const filteredStatements = response.data.filter((item) => {
        // console.log(item, "item");
        const statementDate = new Date(item.transactionDate);
        // console.log(statementDate,"stement data") // Corrected the case sensitivity here
        const startDate = new Date();
       if (timePeriod === "day") {
          startDate.setDate(startDate.getDate() - 1);
        } 
        else if (timePeriod === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (timePeriod === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (timePeriod === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }
        return statementDate >= startDate && statementDate <= new Date();
      });
      
      // Check if there are any statements available
      if (filteredStatements.length === 0) {
        console.log("No statements available for the selected time period.");
        return;
      }
      const doc = new jsPDF();
      // Retrieve the columns from the first statement object
      const columns = Object.keys(filteredStatements[0]);
      const rows = filteredStatements.map((item) => Object.values(item));

      // Set the table header style
      doc.setFontSize(12);
      doc.setFont('bold');
  
      // Create the table using the autoTable plugin
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20, // Adjust the starting position of the table
      });
  
      // Save the PDF as a blob
      const pdfBlob = doc.output('blob');
  
      // Create a URL object from the blob data
      const url = window.URL.createObjectURL(pdfBlob);
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'statement.pdf'); // Set the filename for the downloaded file
      document.body.appendChild(link);
  
      // Simulate a click on the link to trigger the download
      link.click();
  
      // Clean up by removing the temporary link and revoking the URL object
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      // Your existing code here...
    } catch (error) {
      // Handle error
      console.error("Error downloading PDF:", error);
    }
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
  


  const handleRowClick = (row) => {
    setSelectedRow(row);
  };
  
  
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const handleOpenDepositDialog = () => {
    setOpenDepositDialog(true);
  };

  const handleOpenWithdrawDialog = () => {
    setOpenWithdrawDialog(true);
  };
  const handleOpenTransferDialog = () => {
    setOpenTransferDialog(true);
  };
  const handleCloseDepositDialog = () => {
    setOpenDepositDialog(false);
  };
  const handleCloseWithdrawDialog = () => {
    setOpenWithdrawDialog(false);
  };
  const handleCloseTransferDialog = () => {
    setOpenTransferDialog(false);
  };
  const handleDeposit =(e)=>{
    if(e.data){
      console.log(e)
      setOpenDepositDialog(false)
      handleFetchData()
      toast.success("Deposit Successful ")

      return
    }else{

      toast.error("Deposit Unsuccesfful!")
    }
  }

  const handleWithdraw =(e)=>{
    if(e.data){
      console.log(e)
      handleCloseWithdrawDialog()
      handleFetchData()
      toast.success("Withdraw Successful")

      return
    }else{

      toast.error("Withdraw Unsuccesfful!")
    }
  }

  const handleTransfer =(e)=>{
    if(e.data){
      console.log(e)
      handleCloseTransferDialog()
      handleFetchData()
      toast.success("transfer Successful")

      return
    }else{

      toast.error("Transfer Unsuccesfful!")
    }
  }
  const getRole = () => {
    return getRolesFromToken();
  };
  const roles = getRole().split(",");
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
        placeholder="Search by Transaction ID, Account Id or Transaction Type"
        value={searchQuery}
        onChange={handleSearch}
        style={{ 
      marginLeft:"1rem" }}
      />
    </div>
    <div>
<Button
    variant="contained"
    color="success"
    onClick={handleOpenTransferDialog}
    style={{
        marginRight: "1rem",}}
  >
    Transfer
  </Button>
  <Button
    variant="contained"
    color="success" 
    onClick={handleOpenWithdrawDialog}
    style={{
        marginRight: "1rem",}}
  >
    Withdraw
  </Button>
  <Button
    variant="contained"
    color="success"
    marginLeft="1rem"
    onClick={handleOpenDepositDialog}
  >
    Deposit
  </Button>
  {(roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER")) && (
  <Button
    variant="contained"
    color="success"
    onClick={() => {
      downloadPDF();
    }}
    style={{
     
      marginLeft: '1rem',
    }}
  >
    Download
  </Button>
)}

      <select value={timePeriod} onChange={(e) => {
  const selectedTimePeriod = e.target.value;
  setTimePeriod(selectedTimePeriod);
  handleFetchData(selectedTimePeriod); 
  }} style={{width:"8rem" ,marginLeft:"1rem"}}>
        <option value="day" >Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
</div>
</div>
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table>
            <thead style={styles.tableHeading}>
              <tr>
                <TableCellStyled>Transaction ID</TableCellStyled>
                <TableCellStyled>Account ID</TableCellStyled>
                <TableCellStyled>Amount</TableCellStyled>
                <TableCellStyled>Narration</TableCellStyled>
                <TableCellStyled>Payment Method</TableCellStyled>
                <TableCellStyled>To Account</TableCellStyled>
                <TableCellStyled>Transaction Date</TableCellStyled>
                <TableCellStyled>Transaction Type</TableCellStyled>
              </tr>
            </thead>
            <TableBody>
  {paginatedData.length > 0 ? (
    paginatedData.map((row) => (
      <tr
        key={row.transactionId}
        style={
          row.transactionId === hoveredRowId
            ? styles.tableRowHover
            : styles.tableRowBasic
        }
        onMouseEnter={() => setHoveredRowId(row.transactionId)}
        onMouseLeave={() => setHoveredRowId(null)}
        onClick={() => handleRowClick(row)}
      >
        <TableCellStyled>{row.transactionId}</TableCellStyled>
        <TableCellStyled>{row.accountId}</TableCellStyled>
        <TableCellStyled>{row.amount}</TableCellStyled>
        <TableCellStyled>{row.narration}</TableCellStyled>
        <TableCellStyled>{row.paymentMethod}</TableCellStyled>
        <TableCellStyled>{row.toAccount}</TableCellStyled>
        <TableCellStyled>
          {format(new Date(row.transactionDate), "dd/MM/yyyy HH:mm:ss")}
        </TableCellStyled>
        <TableCellStyled>{row.transactionType}</TableCellStyled>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={15}>No records found.</td>
    </tr>
  )}
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
 

{/* row details */}
    <Dialog open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)}>
  <DialogTitle>Transaction Details</DialogTitle>
  <DialogContent>
    {selectedRow && (
      <div>
        <p>Transaction ID: {selectedRow.transactionId}</p>
        <p>Account ID: {selectedRow.accountId}</p>
        <p>Amount: {selectedRow.amount}</p>
        <p>Narration: {selectedRow.narration}</p>
        <p>Payment Method: {selectedRow.paymentMethod}</p>
        <p>To Account: {selectedRow.toAccount}</p>
        <p>
  Transaction Date:{" "}
  {selectedRow.transactionDate
    ? format(new Date(selectedRow.transactionDate), "dd/MM/yyyy HH:mm:ss")

    : ""}
</p>
        <p>Transaction Type: {selectedRow.transactionType}</p>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedRow(null)}>Close</Button>
  </DialogActions>
</Dialog>
{/* row details ends */}
{/* depost */}
<Dialog open={openDepositDialog} onClose={handleCloseDepositDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openDepositDialog && <Deposit handleDeposit ={(e)=>handleDeposit(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepositDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openWithdrawDialog} onClose={handleCloseWithdrawDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openWithdrawDialog && <Withdraw  handleWithdraw ={(e)=>handleWithdraw(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTransferDialog} onClose={handleCloseTransferDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openTransferDialog && <Transfer handleTransfer ={(e)=>handleTransfer(e)}/>}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransferDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Transaction;
