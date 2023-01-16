import {useCallback, useState} from "react";
import {ContentComponents} from "../../types/ContentComponents";
import {Home} from "../content/Home";
import {Quiz} from "../content/Quiz";

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
    }
}

export {Content};