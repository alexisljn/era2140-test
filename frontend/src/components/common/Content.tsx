import {useCallback, useState} from "react";
import {ContentComponents} from "../../types/ContentComponents";
import {Home} from "../content/Home";

function Content() {

    const [componentToDisplay, setComponentToDisplay] = useState<ContentComponents>('home');

    const changeComponentToDisplay = useCallback((component: ContentComponents) => {
        setComponentToDisplay(component);
    }, []);

    switch (componentToDisplay) {
        case "home":
            return (
                <Home/>
            )
    }
}

export {Content};