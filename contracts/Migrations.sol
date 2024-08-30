// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Migrations {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    function setCompleted(uint completed) public restricted {
        // Set completed migration
    }
}
