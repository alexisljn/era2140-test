import {ethers} from "hardhat";

async function main() {
    const QuizResult = await ethers.getContractFactory("QuizResult");

    const quizResult = await QuizResult.deploy("Quiz Result", "QZR", "https://firebasestorage.googleapis.com/v0/b/web3-test-5cede.appspot.com/o/dev%2F");

    await quizResult.deployed();

    console.log(`quizResult has been deployed at ${quizResult.address}`);
}

main().catch(e => {
    console.error(e);
    process.exitCode = 1;
});