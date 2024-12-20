import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/footer";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";
import Register from "./components/Register";
import EmplooyeeDashboard from "./components/EmployeeDashboard";
import GiftCard from "./components/GiftCard";
import CustomerDashboard from "./components/CustomerDashboard";
import Account from "./components/Account";
import ManagerDashboard from "./components/ManagerDashboard";
import Transaction from "./components/Transaction";
import Loan from "./components/Loan";
import CreditCard from "./components/CreditCard";
import { Navigate } from "react-router-dom";
import Login from "./components/Login";
import { RequireAuth } from "./utility/RequireAuth";
import { getToken } from "./services/LocalStorageService";
import { AuthProvider } from "./utility/auth";
import Locker from "./components/Locker";
import Home from "./components/Home";
import SideBar from "./components/SideBar";
import PersonalProfile from "./components/PersonalProfile";
import CustomerAccount from "./components/CustomerAccount";
import CustomerTransaction from "./components/CustomerTransaction";
import CustomerLoan from "./components/CustomerLoan";
import CustomerLocker from "./components/CustomerLocker";
import Cards from "./components/Cards";
import CustomerCreditCard from "./components/CustomerCreditCard";
import RuralBanking from "./components/RuralBanking";
import "../src/components/base.css"
function App() {
  const token = getToken();

  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/employee" element={<EmplooyeeDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/account" element={<Account />} />

          <Route path="/transaction" element={<Transaction />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/gift-card" element={<GiftCard />} />
          <Route path="/credit-card" element={<CreditCard />} />
          <Route path="locker" element={<Locker />} />
          <Route path="/customer/profile" element={<PersonalProfile />} />
          <Route path="/customer/account" element={<CustomerAccount />} />
          <Route
            path="/customer/transaction"
            element={<CustomerTransaction />}
          />
          <Route path="/customer/loan" element={<CustomerLoan />} />
          <Route path="/customer/locker" element={<CustomerLocker />} />
          <Route path="/customer/gift-card" element={<Cards />} />
          <Route
            path="/customer/credit-card"
            element={<CustomerCreditCard />}
          />
          <Route path="/rural-banking" element={<RuralBanking />} />
          {/* <Route path="/users" element={<Users/>}/> */}
        </Routes>
        <Footer sx={{ mt: 5 }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
