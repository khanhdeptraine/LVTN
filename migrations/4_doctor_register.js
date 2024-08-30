// migrations/2_deploy_contracts.js
const DoctorRegistry = artifacts.require("DoctorRegistry");

module.exports = function (deployer) {
    deployer.deploy(DoctorRegistry);
};
