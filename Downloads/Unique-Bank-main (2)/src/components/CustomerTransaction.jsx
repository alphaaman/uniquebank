import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  getUsers,
  editUsers,
  deleteUsers,
  getNotEmoloyee,
  employeedeleteCustomerUrls,
  getAccounts,
  getTransactions,
  getCustomerAccountsStatementByAccountId,
  getCustomerAccountsByUserId,
  getUsersByUsername,
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
import { getToken ,getUsernameFromToken} from "../services/LocalStorageService";
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
import {toast, ToastContainer} from 'react-toastify'
import CustomerSidebar from "./CustomerSidebar";
import CustomerTransfer from "./CustomerTransfer";
import { LinearProgress, Backdrop, CircularProgress } from "@mui/material";
// import Date from "./Date";

const TableCellStyled = TableCell;


const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);
// const username = getUsernameFromToken();
    

const CustomerTransaction = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState('day');
  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);

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
  setIsLoading(true);

  try {
    if (timePeriod == null) {
      timePeriod = "day";
    }
// console.log(fromDate,"fromdate")
// console.log(toDate,"toDate")
    const userResponse = await getUsersByUsername(getUsernameFromToken(), config);
    const accountResponse = await getCustomerAccountsByUserId(userResponse.data.id, config);
    const response = await getCustomerAccountsStatementByAccountId(accountResponse.data.accountId, config);

    const filteredStatements = response.data.filter((item) => {
      const statementDate = new Date(item.statementDate);

      // if (fromDate && toDate) {
      //   const fromDateObj = new Date(fromDate);
      //   const toDateObj = new Date(toDate);
      //   return statementDate >= fromDateObj && statementDate <= toDateObj;
      // } else if (fromDate) {
      //   const fromDateObj = new Date(fromDate);
      //   return statementDate >= fromDateObj;
      // } else if (toDate) {
      //   const toDateObj = new Date(toDate);
      //   return statementDate <= toDateObj;
      // }

      const startDate = new Date();
      if (timePeriod === "day") {
        startDate.setDate(startDate.getDate() - 1);
      } else if (timePeriod === "week") {
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
    setIsLoading(false);
  }
};




  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     console.log(username,"username")
    //     const userResponse = await getUsersByUsername(username, config);
    //     console.log(userResponse.data.id, "user Id ");
    //     const accountResponse= await getCustomerAccountsByUserId(userResponse.data.id,config)
    //     console.log(accountResponse.data.accountId, "accountresponseData");
    //     const response = await getCustomerAccountsStatementByAccountId(accountResponse.data.accountId,config);
    //     console.log(response.data,"statmemt data");
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
      const { refNo, statementId, narration, statementDate } = row;
      const query = searchQuery.toLowerCase();
  
      return (
        (refNo && refNo.toString().toLowerCase().includes(searchQuery)) ||
        (statementDate && statementDate.toString().includes(query)) ||
        (narration && narration.toString().toLowerCase().includes(searchQuery)) ||
        (statementId && statementId.toString().toLowerCase().includes(searchQuery))
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
      // Your existing code here...
      const userResponse = await getUsersByUsername(getUsernameFromToken(), config);
      console.log(userResponse.data.id, "user Id ");
      const accountResponse= await getCustomerAccountsByUserId(userResponse.data.id,config)
      console.log(accountResponse.data.accountId, "accountresponseData");
      const response = await getCustomerAccountsStatementByAccountId(accountResponse.data.accountId,config);
      // Filter the statements based on the selected time period
      const filteredStatements = response.data.filter((item) => {
        // console.log(item, "item");
        const statementDate = new Date(item.statementDate);
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
  const handleTransfer =(e)=>{
    if(e.data){
      console.log(e)
      handleCloseTransferDialog()
      handleFetchData()
      toast.success("transfer done succesfully")
      return 
    }else{
        toast.error("transfer unsuccesfull")
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
    <div
      style={{
        display: "flex",
      }}
    >
      <CustomerSidebar />
      <div>
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
        placeholder="Search by Statement ID, Narration or Ref No"
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
        onClick={() => {
          downloadPDF();
        }}
        style={{
          marginRight: '1rem',
        }}
      >
        Download
      </Button>
      <select value={timePeriod} onChange={(e) => {
  const selectedTimePeriod = e.target.value;
  setTimePeriod(selectedTimePeriod);
  handleFetchData(selectedTimePeriod); 
  }} style={{width:"8rem"}}>
        <option value="day" >Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      {/* <input type="date" value={fromDate} style={{width:"7rem"}}onChange={(e) => setFromDate(e.target.value)} />
<input type="date" value={toDate} style={{width:"7rem"}} onChange={(e) => setToDate(e.target.value)} /> */}

      </div>
</div>
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table>
            <thead style={styles.tableHeading}>
              <tr>
                <TableCellStyled>Statement ID</TableCellStyled>
                <TableCellStyled>Account ID</TableCellStyled>
                <TableCellStyled>Narration</TableCellStyled>
                <TableCellStyled>Ref NO.</TableCellStyled>
                <TableCellStyled>Statement Date</TableCellStyled>
                <TableCellStyled>Deposit</TableCellStyled>
                <TableCellStyled>Withdrawal</TableCellStyled>
                <TableCellStyled>Closing Balance</TableCellStyled>
              </tr>
            </thead>
            <TableBody>
  {paginatedData.length > 0 ? (
    paginatedData.map((row) => (
      <tr
        key={row.statementId}
        style={
          row.statementId === hoveredRowId
            ? styles.tableRowHover
            : styles.tableRowBasic
        }
        onMouseEnter={() => setHoveredRowId(row.statementId)}
        onMouseLeave={() => setHoveredRowId(null)}
        onClick={() => handleRowClick(row)}
      >
        <TableCellStyled>{row.statementId}</TableCellStyled>
        <TableCellStyled>{row.accountId}</TableCellStyled>
        <TableCellStyled>{row.narration}</TableCellStyled>
        <TableCellStyled>{row.refNo}</TableCellStyled>
        <TableCellStyled>
          {format(new Date(row.statementDate), "dd/MM/yyyy HH:mm:ss")}
        </TableCellStyled>
        <TableCellStyled>{row.deposit}</TableCellStyled>
        <TableCellStyled>{row.withdrawal}</TableCellStyled>
        <TableCellStyled>{row.closingBalance}</TableCellStyled>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={8}>No records found.</td>
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
        <p>Statement ID: {selectedRow.transactionId}</p>
        <p>Account ID: {selectedRow.accountId}</p>
        <p>Narration: {selectedRow.narration}</p>
        <p>Ref No.: {selectedRow.refNo}</p>
        <p>
  Transaction Date:
  {format(new Date(selectedRow.statementDate), "dd/MM/yyyy")}
</p>
        <p>Deposit: {selectedRow.deposit}</p>
        <p>Withdrawal: {selectedRow.withdrawal}</p>
        <p>Closing Balance: {selectedRow.closingBalance}</p>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedRow(null)}>Close</Button>
  </DialogActions>
</Dialog>
{/* row details ends */}
{/* depost */}

      <Dialog open={openTransferDialog} onClose={handleCloseTransferDialog}>
        {/* <DialogTitle>Add User</DialogTitle> */}
        <DialogContent>{openTransferDialog && <CustomerTransfer handleTransfer={(e) => handleTransfer(e)} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransferDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerTransaction;