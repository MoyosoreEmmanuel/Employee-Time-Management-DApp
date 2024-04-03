import React, { useState } from 'react';

const CalculatePayroll = ({ contractInstance }) => {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculatePayroll = async () => {
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

      if (!contractInstance || !contractInstance.methods.calculatePayroll) {
        throw new Error('Contract not initialized or calculatePayroll method not found in contract.');
      }

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      const totalPay = await contractInstance.methods.calculatePayroll(employeeAddress, hourlyRate).call({ from: accounts[0], gas: gasLimit });

      setSuccessMessage(`Total pay for employee "${employeeAddress}" is ${totalPay}`);
      setEmployeeAddress('');
      setHourlyRate('');
    } catch (error) {
      setErrorMessage(`Error calculating payroll: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Calculate Payroll</h2>
      <input
        type="text"
        value={employeeAddress}
        onChange={e => setEmployeeAddress(e.target.value)}
        placeholder="Enter employee address"
      />
      <input
        type="number"
        value={hourlyRate}
        onChange={e => setHourlyRate(e.target.value)}
        placeholder="Enter hourly rate"
      />
      <button onClick={handleCalculatePayroll} disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Calculate Payroll'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CalculatePayroll;
