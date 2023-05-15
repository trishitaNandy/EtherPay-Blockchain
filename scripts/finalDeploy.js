const hre = require("hardhat");



async function main() {
    const vendor = await hre.ethers.getContractFactory("vendor");
    const contract = await vendor.deploy();  //instance of contract

    await contract.deployed();
    console.log("Address of contracts:" , contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
