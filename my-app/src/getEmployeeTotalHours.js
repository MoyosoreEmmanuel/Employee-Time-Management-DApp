import React, { useState } from 'react';

const GetEmployeeHours = ({ contractInstance }) => {
    const [employeeAddress, setEmployeeAddress] = useState('');
    const [totalTime, setTotalTime] = useState({ hours: null, minutes: null, seconds: null });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Set a gas limit for the transaction
            const gasLimit = 500000;

            const time = await contractInstance.methods.getEmployeeTotalTime(employeeAddress).call({ gas: gasLimit });
            setTotalTime({ hours: time[0], minutes: time[1], seconds: time[2] });
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Failed to get employee time');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Employee Address:
                    <input
                        type="text"
                        value={employeeAddress}
                        onChange={e => setEmployeeAddress(e.target.value)}
                    />
                </label>
                <button type="submit">Get Employee Time</button>
            </form>
            {totalTime.hours !== null && (
                <p>Total time for employee {employeeAddress}: {totalTime.hours} hours, {totalTime.minutes} minutes, and {totalTime.seconds} seconds.</p>
            )}
        </div>
    );
};

export default GetEmployeeHours;
