import {ContentComponentProps} from "../../types/ContentComponents";
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {fetchApi, setItemToLocalStorage} from "../../utils/Utils";
import {Answer, Question} from "../../types/CommonTypes";
import {AppContext} from "../../App";
import {getAccessTokenInLocalStorage} from "../../utils/AuthUtils";

function Quiz({changeComponentToDisplay}: ContentComponentProps) {

    const {changeBackgroundClass, address} = useContext(AppContext);

    const time = useMemo(() => {
        return 120;
    }, []);

    const [quiz, setQuiz] = useState<Array<Question>>([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [answers, setAnswers] = useState<Array<Answer>>([]);

    const [lastAnswerAt, setLastAnswerAt] = useState<number>(time);

    const [timeLeft, setTimeLeft] = useState(time);

    const timer = useRef<number | null>(null);

    const onSelectAnswer = useCallback((answer: string) => {
        if (selectedAnswer === answer) {
            setSelectedAnswer(null);

            return;
        }

        setSelectedAnswer(answer);
    }, [selectedAnswer]);

    const onValidateAnswer = useCallback(async () => {
        const copy = [...answers];

        copy.push({label: selectedAnswer!, answeredIn: lastAnswerAt - timeLeft});

        setAnswers(copy);

        setLastAnswerAt(timeLeft);

        setSelectedAnswer(null);

        if (currentQuestionIndex !== quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);

            return
        }

        window.clearInterval(timer.current!);

        const {scores} = await fetchApi(
            'quiz',
            'POST',
            [
                {name: 'Authorization', value: `Bearer ${getAccessTokenInLocalStorage(address!)}`},
                {name: 'Content-Type', value: 'application/json'}
            ],
            {answers: copy}
        )

        setItemToLocalStorage('scores', scores);

        changeComponentToDisplay('scores');

    }, [answers, selectedAnswer, timeLeft, lastAnswerAt, currentQuestionIndex, address]);

    useEffect(() => {
        (async () => {
            changeBackgroundClass('quiz-bg')

            setQuiz(await fetchApi('quiz'));
        })();
    }, [])

    useEffect(() => {
        if (quiz.length === 0 || timer.current) return;

        timer.current = window.setInterval(() => {
            setTimeLeft((prevState) => prevState - 1)
        }, 1000);

        return () => {
            if (timer.current) {
                window.clearInterval(timer.current!);
            }
        }

    }, [quiz]);

    useEffect(() => {
        if (timeLeft === 0 && timer.current) {
            window.clearInterval(timer.current!);

            changeComponentToDisplay('timeout');
        }

    }, [timeLeft])

    if (quiz.length === 0) {
        return (
            <div className="loading">Loading...</div>
        )
    }

    return (
        <>
            <div className="quiz">
                <div className="timer"><span className="time-left">{timeLeft}</span></div>
                <div className="questions">
                    <div className="question">{quiz[currentQuestionIndex].content}</div>
                    <div className="answers">
                        {quiz[currentQuestionIndex].answers.map((answer, index) => (
                            <div className="answer" onClick={() => onSelectAnswer(answer.label)} key={index}>
                                <div className="answer-label">{answer.label}</div>
                                <div className="answer-check">
                                    {selectedAnswer === answer.label
                                        ? <i className="fa-regular fa-square-check"></i>
                                        : <i className="fa-regular fa-square"></i>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="answers-button">
                        <button
                            className={selectedAnswer !== null ? 'btn primary' : "btn disabled"}
                            disabled={selectedAnswer === null}
                            onClick={onValidateAnswer}
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

}

export {Quiz}