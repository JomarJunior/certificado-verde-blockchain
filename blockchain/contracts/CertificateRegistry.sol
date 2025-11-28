// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    uint256 public value;

    function store(uint256 newValue) external {
        value = newValue;
    }
}
