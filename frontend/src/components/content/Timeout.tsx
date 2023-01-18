import {ContentComponentProps} from "../../types/ContentComponents";
import {useCallback, useContext, useEffect} from "react";
import {AppContext} from "../../App";

function Timeout({changeComponentToDisplay}: ContentComponentProps) {

    const {changeBackgroundClass} = useContext(AppContext);

    const onTryAgain = useCallback(() => {
        changeComponentToDisplay('quiz');
    }, [changeComponentToDisplay]);

    useEffect(() => {
        changeBackgroundClass('timeout-bg')
    }, [changeBackgroundClass]);

    return (
        <div className="timeout">
            <div className="timeout-box">
                <div className="timeout-box-title">Time is over !</div>
                <div className="timeout-box-text">Oops</div>
                <button className="btn primary timeout-box-button" onClick={onTryAgain}>Try again</button>
            </div>
        </div>
    )
}

export {Timeout}