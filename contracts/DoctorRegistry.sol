// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract DoctorRegistry {
    struct Doctor {
        string name;
        string licenseNumber;
        string specialization;
        bool isRegistered;
    }

    mapping(address => Doctor) public doctors;

    event DoctorRegistered(
        address indexed doctorAddress,
        string name,
        string licenseNumber,
        string specialization
    );

    function registerDoctor(
        string memory _name,
        string memory _licenseNumber,
        string memory _specialization
    ) public {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");

        doctors[msg.sender] = Doctor({
            name: _name,
            licenseNumber: _licenseNumber,
            specialization: _specialization,
            isRegistered: true
        });

        emit DoctorRegistered(
            msg.sender,
            _name,
            _licenseNumber,
            _specialization
        );
    }

    function getDoctorInfo(
        address _doctorAddress
    ) public view returns (string memory, string memory, string memory, bool) {
        Doctor memory doctor = doctors[_doctorAddress];
        return (
            doctor.name,
            doctor.licenseNumber,
            doctor.specialization,
            doctor.isRegistered
        );
    }
}
