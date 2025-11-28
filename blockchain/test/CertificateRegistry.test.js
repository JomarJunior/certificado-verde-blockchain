import { expect } from "chai";

describe("CertificateRegistry", function () {
  it("should store a value", async function () {
    const Contract = await ethers.getContractFactory("CertificateRegistry");
    const contract = await Contract.deploy();
    await contract.store(42);
    expect(await contract.value()).to.equal(42);
  });
});
