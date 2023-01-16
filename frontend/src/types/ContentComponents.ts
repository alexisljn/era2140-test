export type HomeContentComponent = "home";

export type QuizContentComponent = "quiz";

export type ContentComponents = HomeContentComponent | QuizContentComponent;

export interface ContentComponentProps {
    changeComponentToDisplay: (component: ContentComponents) => void;
}