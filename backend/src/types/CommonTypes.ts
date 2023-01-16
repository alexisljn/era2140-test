export interface ErrorData {
    status: number;
    message: string;
}

export interface Question {
    content: string;
    answers: Array<{label: string, isRight: boolean}>
}