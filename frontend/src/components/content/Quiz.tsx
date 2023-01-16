import {ContentComponentProps} from "../../types/ContentComponents";
import {useContext, useEffect, useState} from "react";
import {fetchApi} from "../../utils/Utils";
import {Question} from "../../types/CommonTypes";
import {AppContext} from "../../App";

function Quiz({changeComponentToDisplay}: ContentComponentProps) {

    const {changeBackgroundClass} = useContext(AppContext);

    const [quiz, setQuiz] = useState<Array<Question>>([])

    useEffect(() => {
        (async () => {
            changeBackgroundClass('quiz-bg')

            setQuiz(await fetchApi('quiz'));
        })();
    }, [])

    useEffect(() => {
        if (quiz.length === 0) return;

        console.log("quiz", quiz);
    }, [quiz]);

    if (quiz.length === 0) {
        return (
            <div>TODO LOADING...</div>
        )
    }

    return (
        <div>le quiz !</div>
    )

}

export {Quiz}