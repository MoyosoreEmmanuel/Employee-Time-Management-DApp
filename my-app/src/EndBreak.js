import React, { useState, useEffect } from 'react';

const EndBreak = ({ contractInstance }) => {
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    // Set the initial account
    window.ethereum.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        console.error(err);
      });

    // Subscribe to accounts change
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Unsubscribe on cleanup
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, [account]);

  const handleEndBreak = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Set a gas limit for the transaction
      const gasLimit = 500000;

      await contractInstance.methods.endBreak().send({ from: account, gas: gasLimit });

      setSuccessMessage(`Break ended successfully!`);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Error ending break: ';
  
      // Check if the error was due to a revert
      if (error.code === 'CALL_EXCEPTION') {
        errorMessage += error.data.message;
      } else {
        errorMessage += error.message;
      }

      setErrorMessage(errorMessage);
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
      <h2>End Break</h2>
      <button onClick={handleEndBreak} disabled={isLoading}>
        {isLoading ? 'Ending break...' : 'End Break'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default EndBreak;
