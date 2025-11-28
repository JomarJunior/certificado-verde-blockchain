// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry
{
    struct Certificate {
        uint256 id;                     // Certificate's unique identifier
        address issuer;                 // Who issued the certificate
        address owner;                  // Who owns the certificate
        string dataHash;                // Hash of the off-chain certificate data (IPFS, S3, DB, storage, etc.)
        uint256 timestamp;              // When the certificate was issued
        bool revoked;                   // Whether the certificate has been revoked
    }

    mapping(uint256 => Certificate) private certificates;   // Mapping from certificate ID to Certificate struct
    uint256 public nextId;                                  // Next certificate ID to be issued

    address public admin;                                   // Address with administrative privileges

    event CertificateIssued(
        uint256 indexed id,
        address indexed issuer,
        address indexed owner,
        string dataHash,
        uint256 timestamp
    ); // Emitted when a new certificate is issued

    event CertificateRevoked(
        uint256 indexed id,
        uint256 timestamp
    ); // Emitted when a certificate is revoked

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    } // Restricts function access to the admin only

    /**
    * Initializes the contract setting the deployer as the initial admin.
    * This only happens once during contract deployment.
    * Only 1 time for the entire contract's lifetime
    */
    constructor() {
        admin = msg.sender; // Assign the contract deployer as the admin
        nextId = 1;         // Initialize the next certificate ID to 1
    }

    /**
    * Issues a new certificate and stores it in the registry.
    * Only the admin can call this function.
    * @param owner The address of the certificate owner.
    * @param dataHash The hash of the off-chain certificate data.
    * @return id The unique identifier of the issued certificate.
    */
    function issueCertificate(address owner, string calldata dataHash)
        external
        onlyAdmin
        returns (uint256 id)
    {
        id = nextId++; // Assign the current nextId to id, then increment nextId

        certificates[id] = Certificate({
            id: id,
            issuer: msg.sender,
            owner: owner,
            dataHash: dataHash,
            timestamp: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(id, msg.sender, owner, dataHash, block.timestamp);
    }

    /**
    * Revokes an existing certificate.
    * Only the admin can call this function.
    * @param id The unique identifier of the certificate to revoke.
    */
    function revokeCertificate(uint256 id)
        external
        onlyAdmin
    {
        require(certificates[id].id != 0, "Certificate does not exist");
        require(!certificates[id].revoked, "Certificate already revoked");

        certificates[id].revoked = true;

        emit CertificateRevoked(id, block.timestamp);
    }

    /**
    * Retrieves a certificate by its unique identifier.
    * @param id The unique identifier of the certificate to retrieve.
    * @return certificate The Certificate struct associated with the given id.
    */
    function getCertificate(uint256 id)
        external
        view
        returns (Certificate memory certificate)
    {
        require(certificates[id].id != 0, "Certificate does not exist");
        certificate = certificates[id];
    }
}
