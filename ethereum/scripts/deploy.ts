import {ethers} from "hardhat";

async function main() {
    const QuizResult = await ethers.getContractFactory("QuizResult");

    const quizResult = await QuizResult.deploy("Quiz Result", "QZR", "http://to.do");

    await quizResult.deployed();

    console.log(`quizResult has been deployed at ${quizResult.address}`);
}

main().catch(e => {
    console.error(e);
    process.exitCode = 1;
});