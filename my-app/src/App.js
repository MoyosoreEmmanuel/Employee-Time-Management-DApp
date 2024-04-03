import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { contractInstance, initializeWeb3 } from './web3';
import './App.css';
import logo from './_6472f903-3f47-4bcf-b17a-fbbe76ad4590.jpeg';

import HomePage from './HomePage';
import AdminPage from './AdminPage';
import EmployeePage from './EmployeePage';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeWeb3(setIsLoading)
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="navbar">
            <li className="nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item logo">
    <Link to="/"><img src={logo} alt="Logo" /></Link>
  </li>
            <li className="nav-item dropdown">
              <a href="#">Pages</a>
              <div className="dropdown-content">
                <Link to="/admin">Admin Page</Link>
                <Link to="/employee">Employee Page</Link>
              </div>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage contractInstance={contractInstance} />} />
          <Route path="/admin" element={<AdminPage contractInstance={contractInstance} />} />
          <Route path="/employee" element={<EmployeePage contractInstance={contractInstance} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
