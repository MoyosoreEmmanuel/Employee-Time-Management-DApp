import React, { useState } from 'react';

const AddLocation = ({ contractInstance }) => {
  const [locationName, setLocationName] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [error, setError] = useState(null);

  const addLocation = async () => {
    setIsTransactionPending(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.addLocation(locationName).send({ from: accounts[0], gas: gasLimit });
      setLocationName(''); // Clear the input field on successful transaction
    } catch (err) {
      setError('Transaction failed: ' + err.message);
    }
    setIsTransactionPending(false);
  };

  return (
    <div>
      <h2>Add Location</h2>
      <input
        type="text"
        value={locationName}
        onChange={e => setLocationName(e.target.value)}
        placeholder="Enter location name"
      />
      <button onClick={addLocation} disabled={isTransactionPending}>
        {isTransactionPending ? 'Adding location...' : 'Add Location'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddLocation;
