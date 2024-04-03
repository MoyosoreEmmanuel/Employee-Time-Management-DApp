import React, { useState } from 'react';

const AddSupervisor = ({ contractInstance }) => {
  const [supervisorAddress, setSupervisorAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSupervisor = async () => {
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

      if (!contractInstance || !contractInstance.methods.addSupervisor) {
        throw new Error('Contract not initialized or addSupervisor method not found in contract.');
      }

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.addSupervisor(supervisorAddress).send({ from: accounts[0], gas: gasLimit });

      setSuccessMessage(`Supervisor "${supervisorAddress}" added successfully!`);
      setSupervisorAddress('');
    } catch (error) {
      setErrorMessage(`Error adding supervisor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Supervisor</h2>
      <input
        type="text"
        value={supervisorAddress}
        onChange={e => setSupervisorAddress(e.target.value)}
        placeholder="Enter supervisor address"
      />
      <button onClick={handleAddSupervisor} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Supervisor'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddSupervisor;
