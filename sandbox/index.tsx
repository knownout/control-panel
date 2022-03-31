import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";
import ControlPanel from "../package/ControlPanel";
import { RecoilRoot } from "recoil";
import { IControlPanelExtension } from "../package/global/ExtensionTypes";
import { IControlPanelAuthenticator, TAccountData } from "../package/global/AuthenticationTypes";
import { CacheController } from "@knownout/lib";

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

    public renderObjectPreview (preview: any): JSX.Element {
        return <div>Hello preview</div>;
    }
}

class Authenticator implements IControlPanelAuthenticator
{
    public storage = sessionStorage;

    private readonly storageKey = "accountData";
    private readonly cacheController = new CacheController(this.storage);

    public requireCachedAccountData (): TAccountData | false {
        return this.cacheController.getItem<TAccountData>(this.storageKey);
    }

    public requireServerAuthentication (userData: TAccountData): Promise<boolean> {
        return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 1000));
    }

    public cacheAccountData (cachedUserData: TAccountData) {
        this.cacheController.setItem(this.storageKey, cachedUserData);
    }

    public removeCachedAccountData () {
        this.cacheController.removeItem(this.storageKey);
    }
}

function App () {
    return <RecoilRoot>
        <ControlPanel extensions={ [ new MaterialsExtension() ] } authenticator={ new Authenticator() }
                      location={ "/control-panel" }
                      recaptchaPublicToken={ "6LfML98dAAAAAAOl4xfqwdf4qSlyGIHiNx71wvDd" } />
    </RecoilRoot>;
}

ReactDOM.render(<App />, document.querySelector("#app-root"));
