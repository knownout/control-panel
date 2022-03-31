/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import "./ControlPanel.scss";

import React, { createContext, useLayoutEffect, useRef } from "react";
import { IControlPanelExtension, IControlPanelScreenExtension } from "./global/ExtensionTypes";
import { IControlPanelAuthenticator } from "./global/AuthenticationTypes";
import { RecoilRoot } from "recoil";
import LoaderComponent, { loaderComponentState } from "./components/LoaderComponent";
import { classNames, limitNumber } from "@knownout/lib";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PopupComponent from "./components/PopupComponent";
import useRecoilStateObject from "./hooks/use-recoil-state-object";
import ToastComponent from "./components/ToastComponent/ToastComponent";
import useExtensionsObject from "./hooks/use-extensions-object";
import AuthenticationComponent from "./components/AuthenticationComponent";

interface IControlPanelProps
{
    extensions: IControlPanelExtension<unknown, unknown>[];

    authenticator: IControlPanelAuthenticator;

    location: string;

    screenExtensions?: IControlPanelScreenExtension[];

    recaptchaPublicToken?: string;
}

async function useInitialAuthentication (authenticator: IControlPanelAuthenticator) {
    const cachedContent = authenticator.requireCachedAccountData();
    if (!cachedContent) return false;

    const response = await authenticator.requireServerAuthentication(cachedContent);
    if (!response) authenticator.removeCachedAccountData();

    return response;
}

interface IControlPanelRootContext
{
    extensions: { [key: string]: IControlPanelExtension<unknown, unknown> };

    screenExtensions: { [key: string]: IControlPanelScreenExtension };

    authenticator: IControlPanelAuthenticator;

    recaptchaPublicToken: string;
}

export const ControlPanelRootContext = createContext<Partial<IControlPanelRootContext>>({});

function ControlPanelRoot (props: IControlPanelProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const { setState: setLoading } = useRecoilStateObject(loaderComponentState);
    const authenticationResult = useRef<boolean | null>(null);

    const { authenticator, recaptchaPublicToken } = props;

    const screenExtensions = props.screenExtensions ? useExtensionsObject(props.screenExtensions) : {};
    const extensions = useExtensionsObject(props.extensions);

    useLayoutEffect(() => {
        setLoading(true);

        useInitialAuthentication(props.authenticator).then(response => {
            const startTime = Date.now();

            const lastPathnamePart = location.pathname.split("/").slice(-1)[0];

            if (!response && lastPathnamePart != "auth")
                navigate("/auth");

            else if (response && lastPathnamePart == "auth")
                navigate("/");

            authenticationResult.current = response;

            const timeoutLeft = limitNumber(400 - (Date.now() - startTime), { bottom: 0 });
            setTimeout(() => setLoading(false), timeoutLeft);
        });
    }, [ location.pathname ]);

    const cplRootClassName = classNames("cpl-root");
    return <main className={ cplRootClassName }>
        <PopupComponent />
        <LoaderComponent />

        <ControlPanelRootContext.Provider value={ {
            extensions, screenExtensions, authenticator, recaptchaPublicToken
        } }>
            <Routes>
                <Route path="/auth" element={ <AuthenticationComponent /> } />
                <Route path="*" element={ <span>CPL Form handler</span> } />
            </Routes>
        </ControlPanelRootContext.Provider>
    </main>;
}

export default function (props: IControlPanelProps) {
    return <RecoilRoot>
        <Router basename={ props.location }>
            <ToastComponent>
                <ControlPanelRoot { ...props } />
            </ToastComponent>
        </Router>
    </RecoilRoot>;
}
