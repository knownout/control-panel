/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { memo, useEffect, useState } from "react";
import "./ObjectContentComponent.scss";
import { IControlPanelExtension, TCommonObject } from "../../../global/ExtensionTypes";
import { controlPanelRootState } from "../../../global/state/RecoilStates";
import { AcademicCapIcon } from "@heroicons/react/solid";
import useLoadingState from "../../../hooks/use-loading-state";
import useMinLoadingTime from "../../../hooks/use-min-loading-time";
import { useRecoilValue } from "recoil";

const DefaultInitialScreen = memo((props: { extName: string, objectsType: string }) => {


    return <div className="default-initial-screen">
        <h1>{ props.extName }</h1>
        <p>
            Выберите объект, чтобы увидеть его представление и/или начать редактирование.
        </p>
        <span>
            { <AcademicCapIcon /> }
            Данное сообщение отображается из-за того, что расширение { props.objectsType } не предоставило
            метод renderInitialObjectScreen.
        </span>
    </div>;
});

export default memo((props: { extension: IControlPanelExtension<any, any> }) => {
    const state = useRecoilValue(controlPanelRootState);
    const { startLoading, finishLoading } = useLoadingState();

    const [ content, setContent ] = useState<TCommonObject>();

    useEffect(() => {
        if (!state.objectsType) return;
        if (!state.selectedObject) {
            // if (props.extension.saveOnClose === true && props.extension.updateObject) {
            //     startLoading("content-wait");
            //     props.extension.updateObject(content).then();
            // }

            content && setContent(undefined);
            return;
        }

        startLoading("content-wait");

        props.extension.requireObjectContent(state.selectedObject.id).then(content => {
            useMinLoadingTime(() => setContent(content)).then(() => finishLoading("content-wait"));
        });
    }, [ state.selectedObject, state.objectsType ]);

    const initialScreen = props.extension.renderInitialContentScreen ? props.extension.renderInitialContentScreen()
        : <DefaultInitialScreen extName={ props.extension.name } objectsType={ state.objectsType } />;

    return <div className="object-content-view">
        { content ? <div>Content</div> : initialScreen }
    </div>;
});
