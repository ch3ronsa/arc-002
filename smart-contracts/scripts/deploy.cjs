const hre = require("hardhat");

async function main() {
    const ArcJournal = await hre.ethers.getContractFactory("ArcJournal");
    const arcJournal = await ArcJournal.deploy();

    await arcJournal.waitForDeployment();

    console.log("ArcJournal deployed to:", await arcJournal.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
