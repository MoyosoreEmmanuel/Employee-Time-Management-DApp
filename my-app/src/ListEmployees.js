import React, { useState } from 'react';

const ListEmployees = ({ contractInstance }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAllEmployees = async () => {
    setIsLoading(true);
    try {
      const result = await contractInstance.methods.getAllEmployees().call();
      const employees = result.split('\n').slice(1); // Remove the header line
      const parsedResult = employees.map(employeeString => {
        if (!employeeString) return null; // Skip if the string is empty or undefined

        const [address, totalHoursHex, employeeType] = employeeString.split(' - ');
        const totalHours = totalHoursHex ? parseInt(totalHoursHex, 16) : 0; // Use 0 as a fallback

        return { address, totalHours, employeeType };
      }).filter(Boolean); // Remove null values
      setEmployeeList(parsedResult);
    } catch (error) {
      console.error(`Error getting employee list: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>List of Employees</h2>
      <button onClick={handleGetAllEmployees}>Load Employees</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        employeeList.map((employee, index) => (
          <div key={index}>
            <p>Address: {employee.address}</p>
            <p>Total Hours: {employee.totalHours}</p>
            <p>Type: {employee.employeeType}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListEmployees;
