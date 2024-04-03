import React, { useState } from 'react';

const AddEmployee = ({ contractInstance }) => {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [locationName, setLocationName] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [task, setTask] = useState('');
  const [requiredWorkHours, setRequiredWorkHours] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmployee = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!window.ethereum || !window.ethereum.request) {
        throw new Error('Ethereum provider not available. Please install an Ethereum-compatible browser or extension like MetaMask.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts available. Please connect your Ethereum wallet.');
      }

      if (!contractInstance || !contractInstance.methods.addEmployeeToLocation) {
        throw new Error('Contract not initialized or addEmployeeToLocation method not found in contract.');
      }

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.addEmployeeToLocation(employeeAddress, locationName, employeeType, task, requiredWorkHours).send({ from: accounts[0], gas: gasLimit });

      setSuccessMessage(`Employee "${employeeAddress}" added to location "${locationName}" successfully!`);
      setEmployeeAddress('');
      setLocationName('');
      setEmployeeType('');
      setTask('');
      setRequiredWorkHours('');
    } catch (error) {
      setErrorMessage(`Error adding employee: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <input
        type="text"
        value={employeeAddress}
        onChange={e => setEmployeeAddress(e.target.value)}
        placeholder="Enter employee address"
      />
      <input
        type="text"
        value={locationName}
        onChange={e => setLocationName(e.target.value)}
        placeholder="Enter location name"
      />
      <input
        type="text"
        value={employeeType}
        onChange={e => setEmployeeType(e.target.value)}
        placeholder="Enter employee type"
      />
      <input
        type="text"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <input
        type="number"
        value={requiredWorkHours}
        onChange={e => setRequiredWorkHours(e.target.value)}
        placeholder="Enter required work hours"
      />
      <button onClick={handleAddEmployee} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Employee'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddEmployee;
