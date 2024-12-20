import React from "react";
import { ProSidebarProvider, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import './SideBar.css';
const CustomerSidebar = () => {
  return (
    <div style={{ background: "#AD2D5F", minWidth: "13rem",maxWidth:"13rem", minHeight: "100vh", paddingTop: "5rem", fontWeight: "bold" }}>
    <ProSidebarProvider>
      <Menu iconShape="square">
        <MenuItem icon={<FaUser />} style={{color:"black"}}>
          <NavLink to="/customer/profile" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Profile
          </NavLink>
        </MenuItem>
        <MenuItem icon={<MdAccountBalance />} style={{color:"black"}}>
          <NavLink to="/customer/account" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Account
          </NavLink>
        </MenuItem>
        <MenuItem icon={<AiOutlineTransaction />}style={{color:"black"}}>
          <NavLink to="/customer/transaction" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Transaction
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaMoneyBillWave />}style={{color:"black"}}>
          <NavLink to="/customer/loan" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Loan
          </NavLink>
        </MenuItem>
        <MenuItem icon={<MdLock />}style={{color:"black"}}>
          <NavLink to="/customer/locker" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Locker
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaShoppingCart />}style={{color:"black"}}>
          <NavLink to="/customer/gift-card" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Gift Card
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaCreditCard />}style={{color:"black"}}>
          <NavLink to="/customer/credit-card" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Credit Card
          </NavLink>
        </MenuItem>
      </Menu>
    </ProSidebarProvider>
    </div>
  );
};

export default CustomerSidebar;
