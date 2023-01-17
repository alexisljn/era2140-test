import {ContentComponentProps} from "../../types/ContentComponents";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../App";
import {deleteItemFromLocalStorage, getItemFromLocalStorage} from "../../utils/Utils";
import {ScoresType} from "../../types/CommonTypes";
import {getOnChainScores} from "../../utils/ContractUtils";

function Scores({changeComponentToDisplay}: ContentComponentProps) {

    const {contract, address,changeBackgroundClass} = useContext(AppContext);

    const [scores, setScores] = useState<ScoresType | null>(null);

    const [bestTime, setBestTime] = useState<number | null>(0);

    // Ecouter event ScoresUpdated pour afficher bouton Mint

    useEffect(() => {
        changeBackgroundClass('scores-bg');

        const scoresFromLocalStorage = getItemFromLocalStorage('scores');

        if (scoresFromLocalStorage) {
            console.log("scores", scoresFromLocalStorage);

            // deleteItemFromLocalStorage('scores');

            setScores(scoresFromLocalStorage);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const scoresOnChain = await getOnChainScores(contract!, address!);

            setBestTime(scoresOnChain['bestTime']);
        })();
    }, [address]);

    if (!scores) {
        return (
            <p className="loading">Loading...</p>
        )
    }

    return (
        <div className="scores">
            <div className="scores-box box-mint">
                <div className="box-mint-emoji">🎉</div>
                <div className="box-mint-title">Le Quiz est terminé !</div>
                <div className="box-mint-bravo">Bravo!</div>
                <div className="box-mint-best-time">Meilleur temps : {bestTime}s</div>
                <button className="btn primary">Mint my certificate</button>
            </div>
            <div className="scores-box box-details">
                <div className="box-details-title">Détails des résultats :</div>
                <div className="box-details-answers">
                    {scores.answers.map((answer, index) => (
                        <div key={index}
                             className={answer.hadRight ? "answer-line good-answer" : "answer-line bad-answer"}
                        >
                            <div>
                                {answer.question}
                            </div>
                            <div className="score-item">
                                {answer.answeredIn}s
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export {Scores};