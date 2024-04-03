import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import ClockIn from './ClockIn';
import ClockOut from './ClockOut';
import StartBreak from './StartBreak';
import EndBreak from './EndBreak';
import './EmployeePage.css'; // Import the CSS file

const EmployeePage = ({ contractInstance }) => {
  const [userIsAuthorized, setUserIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        const isOwner = await contractInstance.methods.isOwner(userAccount).call();
        const isSupervisor = await contractInstance.methods.isSupervisor(userAccount).call();
        const isEmployee = await contractInstance.methods.isEmployee(userAccount).call();
        setUserIsAuthorized(isOwner || isSupervisor || isEmployee);
      }
    };

    checkRole();
  }, [contractInstance]);

  if (!userIsAuthorized) {
    return <div>You are not authorized to access this page.</div>;
  }

  return (
    <div className="employee-page">
      <h1>Employee Page</h1>
      <div className="button-container">
        <ClockIn contractInstance={contractInstance} />
        <ClockOut contractInstance={contractInstance} />
        <StartBreak contractInstance={contractInstance} />
        <EndBreak contractInstance={contractInstance} />
      </div>
    </div>
  );
};

export default EmployeePage;
