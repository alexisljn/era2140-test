export interface HeaderInterface {
    name: string;
    value: string;
}

export type MethodsAllowed = 'GET' | 'POST';

export interface Question {
    content: string;
    answers: Array<{label: string}>
}

export interface Answer {
    label: string
    answeredIn: number;
}