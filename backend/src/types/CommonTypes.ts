export interface ErrorData {
    status: number;
    message: string;
}

export interface Question {
    content: string;
    answers: Array<{label: string, isRight: boolean}>;
}

export interface Answer {
    label: string;
    answeredIn: number;
}

export interface Scores {
    total: number;
    time: number;
    answers: Array<ScoreAnswer>;
}

export interface ScoreAnswer {
    question: string;
    hadRight: boolean;
    answeredIn: number;
}