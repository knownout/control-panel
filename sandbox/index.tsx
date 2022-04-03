import { CacheController, Random } from "@knownout/lib";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import ControlPanel, { IControlPanelProps } from "../package/ControlPanel";
import { IControlPanelAuthenticator, TAccountData } from "../package/global/AuthenticationTypes";
import { IControlPanelExtension, TCommonObject } from "../package/global/ExtensionTypes";
import Locales from "../package/global/Locales";
import useRecaptcha from "../package/hooks/use-recaptcha";

import "./styles.scss";

class MaterialsExtension implements IControlPanelExtension<TCommonObject, TCommonObject>
{
    public name = "Материалы";

    public version = "1.0.0-rc";

    public key = "materials";

    public async requireObjectsPreview (): Promise<TCommonObject[]> {
        return [
            { id: Random.string(6) },
            { id: Random.string(6) },
            { id: Random.string(6) }
        ];
    }

    public requireObjectPreviewByKey (key: string) {
        return null as any;
    }

    public async requireObjectsPreviewByQuery (query: string) {
        return [
            { id: Random.string(6) },
            { id: Random.string(6) },
            { id: Random.string(6) }
        ];
    }

    public requireObjectContent (key: string) {
        return null as any;
    }

    public removeObject (key: string) {
        return null as any;
    }

    public renderContentView (content: any) {
        return <div>Hello world</div>;
    }

    public renderObjectPreview (preview: TCommonObject) {
        return <div>{ JSON.stringify(preview) }</div>;
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

    public async requireServerAuthentication (userData: TAccountData, recaptchaPublicKey?: string): Promise<boolean> {
        const token = recaptchaPublicKey ? await useRecaptcha(recaptchaPublicKey)
            .catch(error => { throw new Error(error); }) : undefined;
        console.log(token);

        return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100));
    }

    public cacheAccountData (cachedUserData: TAccountData) {
        this.cacheController.setItem(this.storageKey, cachedUserData);
    }

    public removeCachedAccountData () {
        this.cacheController.removeItem(this.storageKey);
    }
}

function App () {
    const controlPanelProps: IControlPanelProps = {
        extensions: [ new MaterialsExtension() ],
        authenticator: new Authenticator(),

        location: "/control-panel",
        recaptchaPublicKey: "6LfML98dAAAAAAOl4xfqwdf4qSlyGIHiNx71wvDd",

        locale: {
            popup: Locales.Popup.Russian,
            authenticator: Locales.Authenticator.Russian,
            general: Locales.General.English
        }
    };

    return <RecoilRoot>
        <ControlPanel { ...controlPanelProps } />
    </RecoilRoot>;
}

ReactDOM.render(<App />, document.querySelector("#app-root"));
