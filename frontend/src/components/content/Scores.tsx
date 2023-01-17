import {ContentComponentProps} from "../../types/ContentComponents";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../App";
import {deleteItemFromLocalStorage, getItemFromLocalStorage} from "../../utils/Utils";

function Scores({changeComponentToDisplay}: ContentComponentProps) {

    const {changeBackgroundClass} = useContext(AppContext);

    const [scores, setScores] = useState([]);

    useEffect(() => {
        changeBackgroundClass('scores-bg');

        const scoresFromLocalStorage = getItemFromLocalStorage('scores');

        if (scoresFromLocalStorage) {
            console.log("scores", scoresFromLocalStorage);

            deleteItemFromLocalStorage('scores');

            setScores(scoresFromLocalStorage);
        }

    }, []);

    return (
        <div>les scores</div>
    )
}

export {Scores};