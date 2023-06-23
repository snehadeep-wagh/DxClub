// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");


async function main() {
  // Compile the contract
  const DxClubDAO = await ethers.getContractFactory("DxClubDAO");
  const daoadmin = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const daoname = "PISB";
  const daodescription = "none";

  // Deploy the contract
  const dao = await DxClubDAO.deploy(
    // Pass the constructor arguments here
    daoadmin, // Replace with the desired address for 'daoadmin'
    daoname, // Replace with the desired value for 'daoname'
    daodescription // Replace with the desired value for 'daodescription'
  );

  await dao.deployed();

  console.log("Contract deployed to:", dao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    // console.error(error);
    process.exit(1);
  });