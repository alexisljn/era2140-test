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

export interface ScoresType {
    total: number;
    time: number;
    answers: Array<ScoreAnswer>;
}

export interface ScoreAnswer {
    question: string;
    hadRight: boolean;
    answeredIn: number;
}

export interface ModalProps {
    displayModal: () => void;
    hideModal: () => void;
}