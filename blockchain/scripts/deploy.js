async function main() {
  const Contract = await ethers.getContractFactory("CertificateRegistry");
  const contract = await Contract.deploy();
  console.log("Deployed at:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
