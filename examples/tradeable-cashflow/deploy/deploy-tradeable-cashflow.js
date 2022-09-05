// require("@nomiclabs/hardhat-ethers")

// //kovan addresses - change if using a different network
// const host = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3"
// const fDAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff"

// //your address here...
// const owner = "0xc41876DAB61De145093b6aA87417326B24Ae4ECD"

// //to deploy, run yarn hardhat deploy --network kovan

// module.exports = async ({ getNamedAccounts, deployments }) => {
//     const { deploy } = deployments

//     const { deployer } = await getNamedAccounts()
//     console.log(deployer)

//     const deployTx = await deploy("TradeableCashflow", {
//         from: deployer,
//         args: [owner, "Sunny Bowl", "SUNNYBOWL", host, fDAIx],
//         log: true
//     })
//     await deployTx.wait();

//     console.log(deployTx)
// }
// module.exports.tags = ["TradeableCashflow"]


const hre = require("hardhat");
const ethers = hre.ethers;
const { Framework } = require("@superfluid-finance/sdk-core");

async function main() {

  //// Applying best practices and using Superfluid Framework to get deployment info

  // Setting up network object - this is set as the goerli url, but can be changed to reflect your RPC URL and network of choice
  const url = `${process.env.GOERLI_URL}`;
  const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
  const network = await customHttpProvider.getNetwork();

  // Setting up the out Framework object with Goerli (knows it's Goerli when we pass in network.chainId)
  const sf = await Framework.create({
    chainId: network.chainId,
    provider: customHttpProvider
  });

  // Getting the Goerli fDAIx Super Token object from the Framework object
  // This is fDAIx on goerli - you can change this token to suit your network and desired token address
  const daix = await sf.loadSuperToken("fDAIx");

  //// Actually deploying

  // We get the contract to deploy to Gorli Testnet
  const TokenSpreader = await ethers.getContractFactory("TokenSpreader");
  const tokenSpreader = await TokenSpreader.deploy(
    sf.settings.config.hostAddress, // Getting the Goerli Host contract address from the Framework object
    daix.address                  
  );

  await tokenSpreader.deployed();

  console.log("Token Spreader deployed to:", tokenSpreader.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});