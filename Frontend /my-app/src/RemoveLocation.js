import React, { useState } from 'react';


const RemoveLocation = ({ contractInstance }) => {
  const [locationName, setLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveLocation = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!locationName.trim()) {
        throw new Error('Please enter a location name.');
      }

      if (!contractInstance || !contractInstance.methods.removeLocation) {
        throw new Error('Contract not initialized or removeLocation method not found in contract.');
      }

      if (window.ethereum && window.ethereum.request) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (!accounts || accounts.length === 0) {
          throw new Error('No Ethereum accounts available. Please connect your Ethereum wallet.');
        }

        await contractInstance.methods.removeLocation(locationName).send({ from: accounts[0] });

        setSuccessMessage(`Location "${locationName}" removed successfully!`);
        setLocationName('');
      } else {
        throw new Error('Ethereum provider not available. Please install an Ethereum-compatible browser or extension like MetaMask.');
      }
    } catch (error) {
      setErrorMessage(`Error removing location: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Remove Location</h2>
      <div>
        <label>Location Name:</label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button onClick={handleRemoveLocation} disabled={isLoading}>
        {isLoading ? 'Removing...' : 'Remove Location'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default RemoveLocation;
