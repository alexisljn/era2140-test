import {ContentComponentProps} from "../../types/ContentComponents";
import {useEffect, useState} from "react";
import {fetchApi} from "../../utils/Utils";
import {Question} from "../../types/CommonTypes";

function Quiz({changeComponentToDisplay}: ContentComponentProps) {

    const [quiz, setQuiz] = useState<Array<Question>>([])

    useEffect(() => {
        (async () => {
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