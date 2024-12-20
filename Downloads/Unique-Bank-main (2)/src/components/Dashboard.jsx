import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getUsers, editUsers, deleteUsers } from "../services/userService";
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
import UpdateUser from "./UpdateUser";
import { getToken } from "../services/LocalStorageService";
import AddUser from "./AddUser";
import SideBar from "./SideBar";
import EmployeeDashboard from "./EmployeeDashboard";
const TableCellStyled = TableCell;

const NarrowTableCell = ({ children }) => (
  <TableCellStyled>{children}</TableCellStyled>
);
const styles = {
  tableContainer: {
    padding: "2rem",
    margin: "auto",
    width: "95%",
  },
  tableHeading: {
    border: "2px",
    background: "#DE3163", // Update the background color
    color: "white", // Set the heading text color to white
    fontWeight: "bold", // Make the heading text bold
  },
  tableRowHover: {
    "&:hover": {
      background: "#F0DF00",
    },
  },
  pagination: {
    margin: "2rem",
    display: "flex",
    justifyContent: "center",
  },
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        console.log(response.data);
        setData(response.data);
        setSortedData(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      await deleteUsers(selectedRow.id, config);

      setOpenDeleteDialog(false);
      setSelectedRow(null);

      const response = await getUsers();
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
  return (
    <><EmployeeDashboard></EmployeeDashboard>
      </>
  );
};

export default Dashboard;
