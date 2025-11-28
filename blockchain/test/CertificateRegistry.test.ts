import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("CertificateRegistry", function () {
  let certificateRegistry: Contract;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry", owner);
    certificateRegistry = await CertificateRegistryFactory.deploy();
    await certificateRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set deployer as admin", async function () {
      expect(await certificateRegistry.admin()).to.equal(await owner.getAddress());
    });

    it("should start nextId at 1", async function () {
      expect(await certificateRegistry.nextId()).to.equal(1n);
    });
  });

  describe("Issuing Certificates", function () {
    it("should issue a certificate correctly", async function () {
      const tx = await certificateRegistry.issueCertificate(user1.getAddress(), "hash123");
      const receipt = await tx.wait();

      // Check event
      const event = receipt!.logs
        .map((log) => certificateRegistry.interface.parseLog(log))
        .find((ev) => ev?.name === "CertificateIssued");

      expect(event!.args.id).to.equal(1n);
      expect(event!.args.issuer).to.equal(await owner.getAddress());
      expect(event!.args.owner).to.equal(await user1.getAddress());
      expect(event!.args.dataHash).to.equal("hash123");

      // Check on-chain storage
      const cert = await certificateRegistry.getCertificate(1);
      expect(cert.id).to.equal(1n);
      expect(cert.owner).to.equal(await user1.getAddress());
      expect(cert.issuer).to.equal(await owner.getAddress());
      expect(cert.dataHash).to.equal("hash123");
      expect(cert.revoked).to.equal(false);
    });

    it("should increment certificate ID on each issuance", async function () {
      await certificateRegistry.issueCertificate(user1.getAddress(), "h1");
      await certificateRegistry.issueCertificate(user2.getAddress(), "h2");

      const cert1 = await certificateRegistry.getCertificate(1);
      const cert2 = await certificateRegistry.getCertificate(2);
      expect(cert1.id).to.equal(1n);
      expect(cert2.id).to.equal(2n);
    });

    it("should revert if non-admin tries to issue", async function () {
      await expect(
        certificateRegistry.connect(user1).issueCertificate(await user2.getAddress(), "hash")
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Revoking Certificates", function () {
    beforeEach(async function () {
      await certificateRegistry.issueCertificate(await user1.getAddress(), "hash123");
    });

    it("should revoke an existing certificate", async function () {
      const tx = await certificateRegistry.revokeCertificate(1);
      const receipt = await tx.wait();

      const event = receipt!.logs
        .map((log) => certificateRegistry.interface.parseLog(log))
        .find((ev) => ev?.name === "CertificateRevoked");

      expect(event!.args.id).to.equal(1n);

      const cert = await certificateRegistry.getCertificate(1);
      expect(cert.revoked).to.equal(true);
    });

    it("should not allow non-admin to revoke", async function () {
      await expect(certificateRegistry.connect(user1).revokeCertificate(1))
        .to.be.revertedWith("Only admin can perform this action");
    });

    it("should revert if certificate does not exist", async function () {
      await expect(certificateRegistry.revokeCertificate(999))
        .to.be.revertedWith("Certificate does not exist");
    });
  });

  describe("Reading Certificates", function () {
    it("should revert if certificate does not exist", async function () {
      await expect(certificateRegistry.getCertificate(123))
        .to.be.revertedWith("Certificate does not exist");
    });
  });

  describe("Events", function () {
    it("should emit CertificateIssued", async function () {
      await expect(certificateRegistry.issueCertificate(await user1.getAddress(), "hash"))
        .to.emit(certificateRegistry, "CertificateIssued")
        .withArgs(
          1n,
          await owner.getAddress(),
          await user1.getAddress(),
          "hash",
          anyUint() // timestamp
        );
    });
  });
});

// Helper for timestamp matching (Hardhat's `anyValue` doesn't support uint)
function anyUint() {
  return (value: any) => {
    return typeof value === "bigint" || typeof value === "number";
  };
}