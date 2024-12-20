import React from "react";
import { ProSidebarProvider, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { AiOutlineUser, AiOutlineBank, AiOutlineTransaction, AiOutlineMoneyCollect, AiOutlineLock, AiOutlineGift, AiOutlineCreditCard } from 'react-icons/ai';
import { FaUser, FaCreditCard, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { MdAccountBalance, MdLock } from 'react-icons/md';
import './SideBar.css';
const SideBar = () => {
  return (
    <div style={{ position:"sticky",background: "#AD2D5F", width: "18%", minHeight: "100vh",minWidth:"13rem" ,maxWidth:"13rem",paddingTop: "5rem", fontWeight: "bold" }}>
    <ProSidebarProvider>
      <Menu iconShape="square">
        <MenuItem icon={<FaUser />}>
          <NavLink to="/employee" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Customer
          </NavLink>
        </MenuItem>
        <MenuItem icon={<MdAccountBalance />}>
          <NavLink to="/account" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Account
          </NavLink>
        </MenuItem>
        <MenuItem icon={<AiOutlineTransaction />}>
          <NavLink to="/transaction" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Transaction
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaMoneyBillWave />}>
          <NavLink to="/loan" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Loan
          </NavLink>
        </MenuItem>
        <MenuItem icon={<MdLock />}>
          <NavLink to="/locker" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Locker
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaShoppingCart />}>
          <NavLink to="/gift-card" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Gift Card
          </NavLink>
        </MenuItem>
        <MenuItem icon={<FaCreditCard />}>
          <NavLink to="/credit-card" activeClassName="active-link" style={{ textDecoration: 'none', color: 'Black' }}>
            Credit Card
          </NavLink>
        </MenuItem>
      </Menu>
    </ProSidebarProvider>
    </div>
  );
};

export default SideBar;
