import {useCallback, useState} from "react";
import {ContentComponents} from "../../types/ContentComponents";
import {Home} from "../content/Home";
import {Quiz} from "../content/Quiz";
import {Timeout} from "../content/Timeout";
import {Scores} from "../content/Scores";

function Content() {

    const [componentToDisplay, setComponentToDisplay] = useState<ContentComponents>('home');

    const changeComponentToDisplay = useCallback((component: ContentComponents) => {
        setComponentToDisplay(component);
    }, []);

    switch (componentToDisplay) {
        case "home":
            return (
                <Home changeComponentToDisplay={changeComponentToDisplay}/>
            )
        case "quiz":
            return (
                <Quiz changeComponentToDisplay={changeComponentToDisplay}/>
            )
        case "timeout":
            return (
                <Timeout changeComponentToDisplay={changeComponentToDisplay}/>
            )
        case "scores":
            return (
                <Scores changeComponentToDisplay={changeComponentToDisplay}/>
            )
    }
}

export {Content};