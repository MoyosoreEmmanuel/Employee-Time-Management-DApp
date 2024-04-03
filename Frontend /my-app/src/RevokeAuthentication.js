import React, { useState } from 'react';

const RevokeAuthentication = ({ contractInstance }) => {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRevokeAuthentication = async () => {
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

      if (!contractInstance || !contractInstance.methods.revokeAuthentication) {
        throw new Error('Contract not initialized or revokeAuthentication method not found in contract.');
      }

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.revokeAuthentication(employeeAddress).send({ from: accounts[0], gas: gasLimit });

      setSuccessMessage(`Authentication for employee "${employeeAddress}" revoked successfully!`);
      setEmployeeAddress('');
    } catch (error) {
      setErrorMessage(`Error revoking authentication: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Revoke Authentication</h2>
      <input
        type="text"
        value={employeeAddress}
        onChange={e => setEmployeeAddress(e.target.value)}
        placeholder="Enter employee address"
      />
      <button onClick={handleRevokeAuthentication} disabled={isLoading}>
        {isLoading ? 'Revoking...' : 'Revoke Authentication'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default RevokeAuthentication;
