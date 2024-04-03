import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import './SupervisorPage.css'; // Import the entire CSS file

import ClockIn from './ClockIn';
import ClockOut from './ClockOut';
import StartBreak from './StartBreak';
import EndBreak from './EndBreak';
import GetEmployeeTotalHours from './getEmployeeTotalHours';
import RemoveEmployee from './RemoveEmployee';
import RemoveLocation from './RemoveLocation';
import ListEmployees from './ListEmployees';
import RevokeAuthentication from './RevokeAuthentication';
import AuthenticateEmployee from './AuthenticateEmployee';
import AddEmployee from './AddEmployee';
import AddLocation from './AddLocation';

const SupervisorPage = ({ contractInstance }) => {
  const [userIsAuthorized, setUserIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        const isOwner = await contractInstance.methods.isOwner(userAccount).call();
        const isSupervisor = await contractInstance.methods.isSupervisor(userAccount).call();
        setUserIsAuthorized(isOwner || isSupervisor);
      }
    };

    checkRole();
  }, [contractInstance]);

  if (!userIsAuthorized) {
    return <div>You are not authorized to access this page.</div>;
  }

  return (
    <div className="supervisor-page">
      <h1 className="supervisor-page-title">Supervisor Page</h1>
      <div className="supervisor-page-section">
        <h2>Time Management</h2>
        <ClockIn contractInstance={contractInstance} />
        <ClockOut contractInstance={contractInstance} />
        <StartBreak contractInstance={contractInstance} />
        <EndBreak contractInstance={contractInstance} />
      </div>
      <div className="supervisor-page-section">
        <h2>Location Management</h2>
        <AddLocation contractInstance={contractInstance} />
        <RemoveLocation contractInstance={contractInstance} />
      </div>
      <div className="supervisor-page-section">
        <h2>Employee Management</h2>
        <RemoveEmployee contractInstance={contractInstance} />
        <AddEmployee contractInstance={contractInstance} />
        <ListEmployees contractInstance={contractInstance} />
      </div>
      <div className="supervisor-page-section">
        <h2>Authentication</h2>
        <AuthenticateEmployee contractInstance={contractInstance} />
        <RevokeAuthentication contractInstance={contractInstance} />
      </div>
      <div className="supervisor-page-section">
        <h2>Reports</h2>
        <GetEmployeeTotalHours contractInstance={contractInstance} />
      </div>
    </div>
  );
};

export default SupervisorPage;
