import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";
import ControlPanel from "../package/ControlPanel";
import { RecoilRoot } from "recoil";
import { IControlPanelExtension } from "../package/global/ExtensionTypes";
import { IControlPanelAuthenticationMechanism, TStoredUserData } from "../package/global/AuthenticationTypes";

class MaterialsExtension implements IControlPanelExtension<any, any>
{
    public name = "Материалы";
    public version = "1.0.0-rc";

    public requireObjectsPreview (offset: number, limit: number): any[] {
        return null as any;
    }

    public requireObjectPreviewByKey (key: string): any {
        return null as any;
    }

    public requireObjectsPreviewByQuery (query: string, limit: number): any[] {
        return null as any;
    }

    public requireObjectContent (key: string): any {
        return null as any;
    }

    public removeObject (key: string): Promise<boolean> {
        return null as any;
    }

    public renderContentView (content: any): JSX.Element {
        return <div>Hello world</div>;
    }
}

class AuthenticationMechanism implements IControlPanelAuthenticationMechanism
{
    public storage = sessionStorage;

    public requireCachedUserData (): TStoredUserData | false {
        return null as any;
    }

    public requireServerAuthentication (userData: TStoredUserData): Promise<boolean> {
        return true as any;
    }
}

function App () {
    return <RecoilRoot>
        <ControlPanel extensions={ [ new MaterialsExtension() ] } authentication={ new AuthenticationMechanism() }
                      location={ "/control-panel" } />
    </RecoilRoot>;
}

ReactDOM.render(<App />, document.querySelector("#app-root"));
