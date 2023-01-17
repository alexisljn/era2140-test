export type HomeContentComponent = "home";

export type QuizContentComponent = "quiz";

export type TimeoutContentComponent = "timeout";

export type ScoresContentComponent = "scores";

export type ContentComponents = HomeContentComponent | QuizContentComponent | TimeoutContentComponent | ScoresContentComponent;

export interface ContentComponentProps {
    changeComponentToDisplay: (component: ContentComponents) => void;
}