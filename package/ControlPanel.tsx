/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import "./ControlPanel.scss";

import React, { useLayoutEffect, useRef } from "react";
import { IControlPanelExtension, IControlPanelScreenExtension } from "./global/ExtensionTypes";
import { IControlPanelAuthenticationMechanism } from "./global/AuthenticationTypes";
import { RecoilRoot, useRecoilState } from "recoil";
import LoaderComponent, { LoaderComponentState } from "./components/LoaderComponent/LoaderComponent";
import { classNames } from "@knownout/lib";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";

interface IControlPanelProps
{
    extensions: IControlPanelExtension<unknown, unknown>[];

    authentication: IControlPanelAuthenticationMechanism;

    location: string;

    screenExtensions?: IControlPanelScreenExtension[];

    recaptchaPublicToken?: string;
}

async function useInitialAuthentication (authentication: IControlPanelAuthenticationMechanism) {
    const cachedContent = authentication.requireCachedUserData();
    if (!cachedContent) return false;

    return await authentication.requireServerAuthentication(cachedContent);
}

function ControlPanelRoot (props: IControlPanelProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [ loading, setLoading ] = useRecoilState(LoaderComponentState.loadingState);
    const [ error, setError ] = useRecoilState(LoaderComponentState.errorState);
    const authenticationResult = useRef<boolean | null>(null);

    useLayoutEffect(() => {
        setLoading(true);

        useInitialAuthentication(props.authentication).then(response => {
            const lastPathnamePart = location.pathname.split("/").slice(-1)[0];

            if (!response && lastPathnamePart != "auth")
                navigate("/auth");

            else if (response && lastPathnamePart == "auth")
                navigate("/");

            authenticationResult.current = response;

            setTimeout(() => setError("sasat"), 600);
            // setLoading(false);
        });
    }, []);

    const cplRootClassName = classNames("cpl-root");
    return <main className={ cplRootClassName }>
        <LoaderComponent />
        <Routes>
            <Route path="/auth" element={ <span>Auth form</span> } />
            <Route path="*" element={ <span>CPL Form handler</span> } />
        </Routes>
    </main>;
}

export default function (props: IControlPanelProps) {
    return <RecoilRoot>
        <Router basename={ props.location }><ControlPanelRoot { ...props } /></Router>
    </RecoilRoot>;
}
