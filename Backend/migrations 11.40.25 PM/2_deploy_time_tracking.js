const TimeTracking = artifacts.require("TimeTracking");

module.exports = function(deployer, network) {
  if(network === 'sepolia') {
    // Deploy the contract on Sepolia network
    deployer.deploy(TimeTracking);
  } else {
    console.log(`The network ${network} is not configured for deployment in truffle-config.js`);
  }
};

