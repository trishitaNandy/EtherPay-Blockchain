// This file is for locally deploying the contract in our system through hardhat

const hre = require("hardhat");

async function getBalances(address)
{
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses)
{
  let counter= 0;
  for (const address of addresses )
  {
    console.log(`Address ${counter} balance:` , await getBalances(address));
    counter++;
  }      
}

async function consoleMemos(memos)
{
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    const Amount = memo.Amount;

  console.log(`At ${timestamp}, name : ${name}, paid : ${Amount} ,address : ${from} , message : ${message}`);

  }
}


async function main() {
    const [owner,from1,from2,from3] = await hre.ethers.getSigners();
    const vendor = await hre.ethers.getContractFactory("vendor");
    const contract = await vendor.deploy();

    await contract.deployed();
    console.log("Address of contracts:" , contract.address);

    const addresses = [owner.address, from1.address, from2.address ,from3.address];
    console.log("Before buying");
    await consoleBalances(addresses);

    const amount = { value:hre.ethers.utils.parseEther("200.703")};
    await contract.connect(from1).buy("from1", "very nice service",amount);
    await contract.connect(from2).buy("from2", "good service",amount);
    await contract.connect(from3).buy("from3", "overrated",amount);

    console.log("After buying");
    await consoleBalances(addresses);

    const memos = await contract.getMemos();
    consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
