//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeTracking {
    address public owner;
    mapping(address => bool) private supervisors;
    mapping(address => bool) private employees;
    mapping(address => string) private employeeLocations;
    mapping(string => mapping(address => Employee)) private locationEmployees;
    mapping(address => bool) private authenticatedEmployees;

    uint public hourlyRate;
    uint public overtimeRate;
    address[] public employeeAddresses;

    enum EmployeeType { FullTime, PartTime, Contractor }

    struct Break {
        uint startTime;
        uint endTime;
        uint day;
    }
 uint private breakCounter;
    struct Employee {
    uint totalHours;
    uint totalMinutes;  
        uint totalSeconds;  
    uint clockInTime;
    bool isClockedIn;
    bool isOnBreak;
    EmployeeType employeeType;
    string task;
    uint requiredWorkHours;
    bool isActive;
    mapping(uint => bytes32[]) workPeriodBreaks;  // New field to replace 'breaks'
    uint overtime;
}


    struct AuditLog {
        address employee;
        string action;
        uint timestamp;
        uint day;
        string locationName;
        string taskDescription;
    }

    string[] private locations;
    mapping(bytes32 => Break) private breaks;  // Mapping to store Break structs
    AuditLog[] private auditLogs;


    event SupervisorAdded(address indexed supervisor);
    event SupervisorRemoved(address indexed supervisor);
    event LocationAdded(string locationName);
    event LocationRemoved(string _locationName);

    event EmployeeAddedToLocation(address indexed employee, string locationName);
    event EmployeeRemovedFromLocation(address indexed employee, string locationName);
    event EmployeeClockedIn(address indexed employee);
    event EmployeeClockedOut(address indexed employee);
    event BreakStarted(address indexed employee);
    event BreakInformationLogged(address indexed employee, uint day, uint breakCount, uint breakHours, uint breakMinutes, uint breakSeconds);

    event BreakEnded(address indexed employee);
    event EmployeeAuthenticated(address indexed employee);
    event AuthenticationRevoked(address indexed employee);
   event AuditLogCreated(address indexed employee, string action, uint timestamp, uint day, string locationName, string taskDescription);


    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Only the contract owner can perform this action");
        _;
    }

    modifier onlySupervisorOrOwner() {
        require(supervisors[msg.sender] || msg.sender == owner, "Error: Only supervisors and the contract owner can perform this action");
        _;
    }

    modifier onlyActiveEmployee() {
        require(employees[msg.sender] && locationEmployees[employeeLocations[msg.sender]][msg.sender].isActive, "Error: Not a registered active employee");
        _;
    }

    constructor() {
        owner = msg.sender;
        supervisors[msg.sender] = true;
        hourlyRate = 10; // $10 per hour
        overtimeRate = 15; //
    }
 function isValidEthereumAddress(address _address) internal view returns (bool) {
    return (_address != address(0) && _address != address(this));
}
function getAllEmployees() public view returns (string memory) {
    string memory result = "Employee Address - Total Hours - Employee Type\n";
    for (uint i = 0; i < employeeAddresses.length; i++) {
        address employeeAddress = employeeAddresses[i];
        string memory locationName = employeeLocations[employeeAddress];
        Employee storage employee = locationEmployees[locationName][employeeAddress];  // Use 'storage' instead of 'memory'
        if (employee.isActive) {
            string memory employeeType;
            if (employee.employeeType == EmployeeType.FullTime) {
                employeeType = "Full Time";
            } else if (employee.employeeType == EmployeeType.PartTime) {
                employeeType = "Part Time";
            } else {
                employeeType = "Contractor";
            }
            result = string(abi.encodePacked(result, "\n", toString(employeeAddress), " - ", toString(employee.totalHours), " - ", employeeType));
        }
    }
    return result;
}

function addLocation(string calldata _locationName) external onlySupervisorOrOwner {
    require(bytes(_locationName).length > 0, "Error: Location name cannot be empty");
    require(!locationExists(_locationName), "Error: Location already exists");

    locations.push(_locationName);
    emit LocationAdded(_locationName);
}

function addEmployeeToLocation(address _employee, string calldata _locationName, EmployeeType _employeeType, string calldata _task, uint _requiredWorkHours) external onlySupervisorOrOwner {
    require(_employee != address(0), "Error: Invalid employee address");
    require(isValidEthereumAddress(_employee), "Error: Invalid Ethereum address");
    require(_requiredWorkHours >= 0, "Error: Required work hours can't be negative");
    require(bytes(_task).length > 0, "Error: Task description cannot be empty");
    require(locationExists(_locationName), "Error: Location does not exist");
    require(!locationEmployees[_locationName][_employee].isActive, "Error: Employee already exists in this location");

    Employee storage newEmployee = locationEmployees[_locationName][_employee];
    newEmployee.totalHours = 0;
    newEmployee.clockInTime = 0;
    newEmployee.isOnBreak = false;
    newEmployee.isClockedIn = false;
    newEmployee.employeeType = _employeeType;
    newEmployee.task = _task;
    newEmployee.requiredWorkHours = _requiredWorkHours;
    newEmployee.isActive = true;
    newEmployee.overtime = 0;

    employeeLocations[_employee] = _locationName;
    employees[_employee] = true;

    // Add the employee address to the array
    employeeAddresses.push(_employee);

    emit EmployeeAddedToLocation(_employee, _locationName);
}
  


function authenticateEmployee(address _employee) external onlyOwner {
    require(_employee != address(0), "Error: Invalid employee address");
    require(isValidEthereumAddress(_employee), "Error: Invalid Ethereum address");

    authenticatedEmployees[_employee] = true;
    emit EmployeeAuthenticated(_employee);
}



function revokeAuthentication(address _employee) external onlyOwner {
    require(_employee != address(0), "Error: Invalid employee address");
    require(authenticatedEmployees[_employee], "Error: Employee not authenticated");
    authenticatedEmployees[_employee] = false;
    emit AuthenticationRevoked(_employee);
}

function clockIn() external onlyActiveEmployee {
    require(authenticatedEmployees[msg.sender], "Error: Employee not authenticated");
    string memory locationName = employeeLocations[msg.sender];
    require(bytes(locationName).length > 0, "Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][msg.sender];
    require(!employee.isClockedIn, "Error: Employee already clocked in");

    employee.isClockedIn = true;
    employee.clockInTime = block.timestamp;
    emit EmployeeClockedIn(msg.sender);
    emitAuditLog(msg.sender, "Clock In");
}

function clockOut() external onlyActiveEmployee {
    require(authenticatedEmployees[msg.sender], "Error: Employee not authenticated");
    string memory locationName = employeeLocations[msg.sender];
    require(bytes(locationName).length > 0, "Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][msg.sender];
    require(employee.isClockedIn, "Error: Employee must be clocked in to clock out");

    // Check if the employee is on a break
    if(employee.isOnBreak) {
        revert("Error: Employee must end break before clocking out");
    }

    uint totalWorkTime = block.timestamp - employee.clockInTime;
    uint totalBreakTime = 0;

    // Calculate total break time for the current work period
    bytes32[] storage workPeriodBreaks = employee.workPeriodBreaks[employee.clockInTime];
    for (uint i = 0; i < workPeriodBreaks.length; i++) {
        Break storage breakObject = breaks[workPeriodBreaks[i]];
        totalBreakTime += breakObject.endTime - breakObject.startTime;
    }

    uint workSeconds = totalWorkTime - totalBreakTime;
    uint workHours = workSeconds / 3600;
    uint workMinutes = (workSeconds % 3600) / 60;
    workSeconds = workSeconds % 60;
    if (workHours > employee.requiredWorkHours) {
        employee.overtime += workHours - employee.requiredWorkHours;
        workHours = employee.requiredWorkHours;
    }
    employee.totalHours += workHours;
    employee.totalMinutes += workMinutes;
    employee.totalSeconds += workSeconds;
    employee.isClockedIn = false;
    emit EmployeeClockedOut(msg.sender);
    emitAuditLog(msg.sender, "Clock Out");
}


    function startBreak() external onlyActiveEmployee {
    require(authenticatedEmployees[msg.sender], "Error: Employee not authenticated");
    string memory locationName = employeeLocations[msg.sender];
    require(bytes(locationName).length > 0, "Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][msg.sender];
    require(employee.isClockedIn, "Error: Employee must be clocked in to start a break");

    bytes32 breakId = keccak256(abi.encodePacked(breakCounter++));
    breaks[breakId] = Break(block.timestamp, 0, block.timestamp / 1 days);
    employee.workPeriodBreaks[employee.clockInTime].push(breakId);

    emit BreakStarted(msg.sender);
    emitAuditLog(msg.sender, "Start Break");    
}

function endBreak() external onlyActiveEmployee {
    require(authenticatedEmployees[msg.sender], "Error: Employee not authenticated");
    string memory locationName = employeeLocations[msg.sender];
    require(bytes(locationName).length > 0, "Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][msg.sender];
    require(employee.workPeriodBreaks[employee.clockInTime].length > 0, "No break to end");

    bytes32 breakId = employee.workPeriodBreaks[employee.clockInTime][employee.workPeriodBreaks[employee.clockInTime].length - 1];
    Break storage breakObject = breaks[breakId];
    require(breakObject.endTime == 0, "Break already ended");

    breakObject.endTime = block.timestamp;
    emit BreakEnded(msg.sender);
    emitAuditLog(msg.sender, "End Break");    
}

 function getEmployeeTotalTime(address _employee) external view returns (uint, uint, uint) {
    string memory locationName = employeeLocations[_employee];
    require(bytes(locationName).length > 0, "Error: Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][_employee];
    return (employee.totalHours, employee.totalMinutes, employee.totalSeconds);
}

function calculatePayroll(address _employee, uint _hourlyRate) external view returns (uint totalPay) {
    string memory locationName = employeeLocations[_employee];
    require(bytes(locationName).length > 0, "Error: Employee not associated with any location");

    Employee storage employee = locationEmployees[locationName][_employee];
    uint totalHours = employee.totalHours;
    uint totalMinutes = employee.totalMinutes;
    uint totalWorkTimeInMinutes = totalHours * 60 + totalMinutes;
    totalPay = totalWorkTimeInMinutes * (_hourlyRate > 0 ? _hourlyRate : hourlyRate) / 60;

    if (totalWorkTimeInMinutes > employee.requiredWorkHours * 60) {
        uint overtimeMinutes = totalWorkTimeInMinutes - employee.requiredWorkHours * 60;
        uint overtimePay = overtimeMinutes * overtimeRate / 60;
        totalPay += overtimePay;
    }

    return totalPay;
}




   
function isOwner(address _address) public view returns (bool) {
    return _address == owner;
}

function isSupervisor(address _address) public view returns (bool) {
    return supervisors[_address];
}

function isEmployee(address _address) public view returns (bool) {
    return employees[_address];
}


function locationExists(string memory _locationName) public view returns (bool) {
    require(bytes(_locationName).length > 0, "Error: Location name cannot be empty");

    for (uint i = 0; i < locations.length; i++) {
        if (keccak256(bytes(locations[i])) == keccak256(bytes(_locationName))) {
            return true;
        }
    }
    return false;
}

   function emitAuditLog(address _employee, string memory _action) private {
    require(_employee != address(0), "Error: Invalid employee address");
    require(bytes(_action).length > 0, "Error: Action cannot be empty");

    string memory locationName = employeeLocations[_employee];
    require(bytes(locationName).length > 0, "Error: Employee not associated with any location");

    string memory taskDescription = locationEmployees[locationName][_employee].task;
    require(bytes(taskDescription).length > 0, "Error: Task description cannot be empty");

    uint day = block.timestamp / 1 days;

    auditLogs.push(AuditLog(_employee, _action, block.timestamp, day, locationName, taskDescription));
    emit AuditLogCreated(_employee, _action, block.timestamp, day, locationName, taskDescription);
}

    function toString(address account) internal pure returns(string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) internal pure returns(string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) internal pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }







    

}