import {useCallback, useState} from "react";
import {ContentComponents} from "../../types/ContentComponents";
import {Home} from "../content/Home";
import {Quiz} from "../content/Quiz";
import {Timeout} from "../content/Timeout";

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
    }
}

export {Content};