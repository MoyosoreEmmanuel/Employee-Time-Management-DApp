
# TimeTracking Contract

## Overview

The TimeTracking contract is designed to provide efficient time tracking and management functionalities on the Ethereum blockchain. It allows for clocking in/out, managing employees, calculating payroll, and maintaining audit logs, among other features.

## Setup Instructions

### Prerequisites

1. Node.js and npm (Node Package Manager) installed on your machine.
2. MetaMask browser extension installed in your browser.

### Steps

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/TimeTracking.git
   ```

2. Navigate to the project directory:
   ```bash
   cd TimeTracking
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Compile and deploy the contract:
   ```bash
   
   //Edit config.js to use your metamask account.
   truffle compile
   truffle migrate --network sepolia
   ```

5. Move the JSON file to the `src` folder of your React app:
   ```bash
   mv build/contracts/TimeTracking.json my-app/src/TimeTracking.json
   ```

6. Navigate to the `src` folder of your React app:
   ```bash
   cd my-app/src
   ```

7. Start the React frontend:
   ```bash
   npm start
   ```

8. Access the application in your browser at http://localhost:3000/.

## Interacting with the Contract

1. **Clock In/Out:** Employees can log their work hours by clicking the "Clock In" or "Clock Out" buttons on the frontend.

2. **Managing Employees:** Supervisors can add or remove employees and assign them to specific locations using the respective functionalities in the UI.

3. **Viewing Work Hours:** Employees and supervisors can view their total work hours, breaks, and overtime on the dashboard.

4. **Audit Log:** All actions performed within the contract are logged in the audit log section, providing transparency and accountability.

oject.
![image](https://github.com/MoyosoreEmmanuel/Employee-Time-Management-DApp/assets/164285349/cff3451b-90d8-4628-88cf-d0f8f88f560c)
