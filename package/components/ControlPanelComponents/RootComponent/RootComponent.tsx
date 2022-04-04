/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { classNames } from "@knownout/lib";

import React, { memo, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { ControlPanelRootContext } from "../../../ControlPanel";

import { controlPanelRootState } from "../../../global/state/RecoilStates";
import useRecoilStateObject from "../../../hooks/use-recoil-state-object";

import ObjectsPreviewComponent from "../ObjectsPreviewComponent";
import useWelcomeMessage from "../use-welcome-message";

import "./RootComponent.scss";

/**
 * Root control panel component (after authentication).
 * @internal
 */
export default memo(() => {
    const { extensions, authenticator, locale } = useContext(ControlPanelRootContext);
    const { state: { objectsType }, setState } = useRecoilStateObject(controlPanelRootState);

    const location = useLocation();
    const navigate = useNavigate();

    const params = useParams<{ objectsType: string, objectID: string }>();

    const extension = useMemo(() => extensions && extensions[objectsType], [ objectsType ]);

    useWelcomeMessage(extension);
    useEffect(() => {
        if (params.objectsType && extensions && !Object.keys(extensions).includes(params.objectsType))
            return navigate("/" + (Object.values(extensions)[0] as any).key);

        if (!params.objectsType) navigate(`/${ objectsType }`);
        else if (params.objectsType != objectsType)
            setState({ objectsType: params.objectsType, selectedObject: undefined });
    }, [ location ]);

    if (!authenticator || !locale || !extensions || !extension) return null;

    const cplComponentClassName = classNames("cpl-component-root");
    return <div className={ cplComponentClassName }>
        <ObjectsPreviewComponent extensions={ extensions } extension={ extension } />
        <div className="object-content-view">

        </div>
    </div>;
});
