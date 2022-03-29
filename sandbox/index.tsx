import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";
import ControlPanel from "../package/control-panel";
import { IControlPanelExtension } from "../package/src/extensions/typings";
import { RecoilRoot } from "recoil";

class MaterialExtension implements IControlPanelExtension<any, any>
{
    readonly name = "Материалы";

    readonly version = "1.0.0";

    public previewObjectRequest (from: number, limit: number): Promise<any[]> {
        return null as any;
    }

    public objectSearch (query: string): Promise<any[]> {
        return null as any;
    }

    public objectDataRequest (identifier: string): Promise<any> {
        return null as any;
    }

    public updateObjectData (identifier: string, objectData: any): Promise<boolean> {
        return null as any;
    }

    public removeObject (identifier: string): Promise<boolean> {
        return null as any;
    }
}

class FilesExtension implements IControlPanelExtension<any, any>
{
    readonly name = "Файлы";

    readonly version = "1.0.0";

    public previewObjectRequest (from: number, limit: number): Promise<any[]> {
        return null as any;
    }

    public objectSearch (query: string): Promise<any[]> {
        return null as any;
    }

    public objectDataRequest (identifier: string): Promise<any> {
        return null as any;
    }

    public updateObjectData (identifier: string, objectData: any): Promise<boolean> {
        return null as any;
    }

    public removeObject (identifier: string): Promise<boolean> {
        return null as any;
    }
}

function App () {
    return <RecoilRoot>
        <ControlPanel extensions={ [ new MaterialExtension(), new FilesExtension() ] } />
    </RecoilRoot>;
}

ReactDOM.render(<App />, document.querySelector("#app-root"));
