import {useState} from "react";
import {HomeContentComponent} from "../../types/ContentComponents";
import {Home} from "../content/Home";

function Content() {

    const [componentToDisplay, setComponentToDisplay] = useState<HomeContentComponent>('home');

    switch (componentToDisplay) {
        case "home":
            return (
                <Home/>
            )
    }
}

export {Content};