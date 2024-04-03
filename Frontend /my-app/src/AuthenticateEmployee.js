import React, { useState } from 'react';

const AuthenticateEmployee = ({ contractInstance }) => {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticateEmployee = async () => {
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

      if (!contractInstance || !contractInstance.methods.authenticateEmployee) {
        throw new Error('Contract not initialized or authenticateEmployee method not found in contract.');
      }

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.authenticateEmployee(employeeAddress).send({ from: accounts[0], gas: gasLimit });

      setSuccessMessage(`Employee "${employeeAddress}" authenticated successfully!`);
      setEmployeeAddress('');
    } catch (error) {
      setErrorMessage(`Error authenticating employee: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Authenticate Employee</h2>
      <input
        type="text"
        value={employeeAddress}
        onChange={e => setEmployeeAddress(e.target.value)}
        placeholder="Enter employee address"
      />
      <button onClick={handleAuthenticateEmployee} disabled={isLoading}>
        {isLoading ? 'Authenticating...' : 'Authenticate Employee'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AuthenticateEmployee;
