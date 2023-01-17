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

export interface Score {
    question: string;
    hadRight: boolean;
    answeredIn: number;
}