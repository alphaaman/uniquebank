import React, { Component } from 'react';
import './PersonalProfile.css';
import CustomerSidebar from './CustomerSidebar';
import PersonalProfile from './PersonalProfile';
import { getUsernameFromToken } from '../services/LocalStorageService';


export default class CustomerDashboard extends Component {
  getUsername = () => {
    const username = getUsernameFromToken();
    console.log(username);
    return username;
  }

  render() {
    return (
      <div style={{ display: 'flex' }} onClick={this.getUsername}>
        <CustomerSidebar />
        <PersonalProfile />
      </div>
    );
  }
}
