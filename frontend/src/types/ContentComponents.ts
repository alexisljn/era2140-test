export type HomeContentComponent = "home";

export type QuizContentComponent = "quiz";

export type TimeoutContentComponent = "timeout";

export type ContentComponents = HomeContentComponent | QuizContentComponent | TimeoutContentComponent;

export interface ContentComponentProps {
    changeComponentToDisplay: (component: ContentComponents) => void;
}