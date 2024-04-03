import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import './AdminPage.css'; // Import the entire CSS file

import GetEmployeeTotalHours from './getEmployeeTotalHours';
import RemoveEmployee from './RemoveEmployee';
import RemoveLocation from './RemoveLocation';
import ListEmployees from './ListEmployees';
import RevokeAuthentication from './RevokeAuthentication';
import AuthenticateEmployee from './AuthenticateEmployee';
import AddEmployee from './AddEmployee';
import AddLocation from './AddLocation';

import AddSupervisor from './AddSupervisor';
import RemoveSupervisor from './RemoveSupervisor';

const AdminPage = ({ contractInstance }) => {
  const [userIsOwner, setUserIsOwner] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        const isOwner = await contractInstance.methods.isOwner(userAccount).call();
        setUserIsOwner(isOwner);
      }
    };

    checkRole();
  }, [contractInstance]);

  if (!userIsOwner) {
    return <div>You are not authorized to access this page.</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin Page</h1>
      <div className="admin-page-section">
        <h2>Manage Employees</h2>
        <AddEmployee contractInstance={contractInstance} />
        <RemoveEmployee contractInstance={contractInstance} />
        <ListEmployees contractInstance={contractInstance} />
      </div>
      <div className="admin-page-section">
        <h2>Manage Locations</h2>
        <AddLocation contractInstance={contractInstance} />
        <RemoveLocation contractInstance={contractInstance} />
      </div>
      <div className="admin-page-section">
        <h2>Authentication</h2>
        <AuthenticateEmployee contractInstance={contractInstance} />
        <RevokeAuthentication contractInstance={contractInstance} />
      </div>
      <div className="admin-page-section">
        <h2>Supervisors</h2>
        <AddSupervisor contractInstance={contractInstance} />
        <RemoveSupervisor contractInstance={contractInstance} />
      </div>
      <div className="admin-page-section">
        <h2>Reports</h2>
        <GetEmployeeTotalHours contractInstance={contractInstance} />
      </div>
    </div>
  );
};

export default AdminPage;
