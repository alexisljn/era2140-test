import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";

describe('QuizResult smart contract test', () => {
    async function deployQuizResultFixture() {
        const QuizResult = await ethers.getContractFactory("QuizResult");

        const [owner, otherAccounts] = await ethers.getSigners();

        const quizResultContract = await QuizResult.deploy("Quiz Result", "QZR", "http://to.do")

        await quizResultContract.deployed();

        return {quizResultContract, owner, otherAccounts};
    }

    describe('Deploy', () => {
        it("Deploy", async () => {
            const {quizResultContract, owner, otherAccounts} = await loadFixture(deployQuizResultFixture);
        })
    })

});